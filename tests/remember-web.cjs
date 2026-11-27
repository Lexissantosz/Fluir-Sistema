"use strict";
const {chromium}=require("playwright"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const handler=require("../api/remember-session.js"),root=path.resolve(__dirname,"..");
const origin="https://fluir-qa.example.invalid",api="https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api";
const token="synthetic_session_"+ "a".repeat(40);
const user={id:77,nome:"QA",email:"qa@example.invalid",token};
const onboarding={usuarioId:77,onboardingConcluido:true,usuario:{nome:"QA",email:"qa@example.invalid"},modulos:{tarefas:true}};
let revoked=false,loginCount=0,restores=0;
const secure=()=>({google:{nome:user.nome,email:user.email,vinculado:false},sessoes:revoked?[]:[{atual:true,expiraEm:new Date(Date.now()+3600000).toISOString()}]});
const originalFetch=global.fetch;
global.fetch=async (u,opts)=>{assert.equal(opts.headers.Authorization,"Bearer "+token);if(revoked)return new Response("{}",{status:401});return Response.json(u.endsWith("/conta/seguranca")?secure():onboarding)};
(async()=>{
 const browser=await chromium.launch({channel:"chrome",headless:true});
 try{
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:"block"});
 await context.route("**/*",async route=>{
 const req=route.request(),u=new URL(req.url()),method=req.method();
 const json=(data,status=200)=>route.fulfill({status,contentType:"application/json",headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"authorization,content-type","Access-Control-Allow-Methods":"GET,POST,DELETE,OPTIONS"},body:JSON.stringify(data)});
 if(req.url().startsWith(api)){
 if(method==="OPTIONS")return json({},200);
 if(u.pathname.endsWith("/usuarios/login")){loginCount++;return json(user);}
 if(u.pathname.endsWith("/usuarios/google/config"))return json({habilitado:false});
 if(u.pathname.endsWith("/conta/logout")){revoked=true;return json({encerrada:true});}
 if(u.pathname.endsWith("/conta/seguranca"))return json(secure());
 if(u.pathname.includes("/onboarding/usuario/"))return json(onboarding);
 if(u.pathname.includes("/tarefas/usuario/"))return json([]);
 return json({});
 }
 if(u.origin!==origin)return route.abort();
 if(u.pathname==="/api/remember-session"){
 const res={statusCode:200,headers:{},body:"",setHeader(k,v){this.headers[k.toLowerCase()]=v},end(s=""){this.body=s}};
 const headers=await req.allHeaders();headers.host||=u.host;await handler({method,headers,body:req.postDataJSON?.()},res);console.log("QA session endpoint",method,res.statusCode,headers.origin||"no origin",Boolean(res.headers["set-cookie"]));
 if(method==="GET"&&res.statusCode===200)restores++;
 return route.fulfill({status:res.statusCode,headers:res.headers,body:res.body});
 }
 const f=path.resolve(root,"."+u.pathname);if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile())return route.fulfill({status:404,body:"Not found"});
 return route.fulfill({status:200,contentType:{".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css",".svg":"image/svg+xml",".png":"image/png"}[path.extname(f)]||"application/octet-stream",body:fs.readFileSync(f)});
 });
 let page=await context.newPage();await page.goto(origin+"/html/login.html");
 await page.locator("#rememberSession").check();
 await page.locator('#loginForm input[type=email]').fill(user.email);
 await page.locator('#loginForm input[type=password]').fill("QA-password-not-real");
 await page.locator('#loginForm button[type=submit]').click();
 await page.waitForURL("**/dashboard.html");
 let cookies=await context.cookies(origin);
 let c=cookies.find(x=>x.name==="__Host-fluir_remember");assert(c&&c.httpOnly&&c.secure&&c.sameSite==="Strict");
 assert.equal(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("fluir-user")).id),77);
 assert.equal(await page.evaluate(t=>JSON.stringify(localStorage).includes(t),token),false);
 await page.reload();await page.waitForURL("**/dashboard.html");assert.equal(await page.evaluate(()=>JSON.parse(sessionStorage.getItem("fluir-user")).id),77);
 await page.close();page=await context.newPage();await page.goto(origin+"/html/dashboard.html");await page.waitForURL("**/dashboard.html");
 await page.waitForFunction(()=>JSON.parse(sessionStorage.getItem("fluir-user")||"null")?.id===77);
 assert.equal(restores,1);assert.equal(loginCount,1);
 await page.locator("[data-fluir-logout]").first().evaluate(e=>e.click());
 await page.waitForURL("**/login.html");
 assert.equal((await context.cookies(origin)).find(x=>x.name==="__Host-fluir_remember"),undefined);
 assert.equal(await page.evaluate(()=>sessionStorage.getItem("fluir-user")),null);assert(revoked);
 await page.close();page=await context.newPage();await page.goto(origin+"/html/dashboard.html");await page.waitForURL("**/login.html");
 assert.equal(await page.evaluate(()=>sessionStorage.getItem("fluir-user")),null);
 console.log("PASS: login with opt-in, reload, fresh tab restore, no persistent token in JS storage, logout revocation, no restore after logout.");
 await context.close();
 }finally{await browser.close();global.fetch=originalFetch}
})().catch(e=>{console.error(e);process.exitCode=1});
