"use strict";
const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const http=require("node:http"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,"."+new URL(req.url,"http://localhost").pathname);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end()}
 const types={".html":"text/html",".js":"application/javascript",".css":"text/css",".svg":"image/svg+xml"};
 res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream"});fs.createReadStream(file).pipe(res)
});
const api="https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api";
const token="test_only_token_012345678901234567890123456";
const modules={timeline:true,tasks:true,habits:true,sleep:true,water:true,finances:true,diary:true,nutrition:true,physicalHealth:true,menstrualCycle:true,attachments:true};
(async()=>{
 await new Promise(r=>server.listen(5514,"127.0.0.1",r));
 const browser=await chromium.launch({channel:"chrome",headless:true});
 try {
 const base="http://127.0.0.1:5514/html/";
 const ctx=await browser.newContext({viewport:{width:1280,height:850}});
 const errors=[];const p=await ctx.newPage();p.on("pageerror",e=>errors.push(p.url()+": "+e.message));
 await p.addInitScript(({token,modules})=>{
  if(!sessionStorage.getItem("qa-initialized")){
    sessionStorage.setItem("qa-initialized","true");
    sessionStorage.setItem("fluir-user",JSON.stringify({id:777,token,nome:"Fluir QA",email:"qa@example.invalid"}));
    sessionStorage.setItem("fluir-onboarding-completed","true");
    localStorage.setItem("fluir:account:777:fluir-setup",JSON.stringify({usuarioId:777,onboardingConcluido:true,user:{name:"Fluir QA",email:"qa@example.invalid"},modules}));
  }
 },{token,modules});
 let tasks=[],requests=[],revoked=[],logout=false,proposal=null,linked=true;
 await ctx.route(api+"/**",async r=>{
  const u=new URL(r.request().url()),method=r.request().method(),suffix=u.pathname.split("/fluir-api")[1];
  const send=(body,status=200)=>r.fulfill({status,contentType:"application/json",body:JSON.stringify(body)});
  if(method==="OPTIONS")return r.fulfill({status:204});
  if(suffix==="/conta/seguranca")return send({google:{vinculado:linked,nome:"Fluir QA",email:"qa@example.invalid"},sessoes:[{id:"current",atual:true,criadoEm:"2026-11-26T20:00:00Z",dispositivo:"Windows · Chrome"},{id:"other",atual:false,criadoEm:"2026-11-26T20:05:00Z",dispositivo:"Android · Chrome"}].filter(s=>!revoked.includes(s.id))});
  if(suffix.startsWith("/conta/sessoes/")&&method==="DELETE"){revoked.push(suffix.split("/").pop());return send({encerrada:true})}
  if(suffix==="/conta/logout"){logout=true;return send({encerrada:true})}
  if(suffix==="/usuarios/google/config")return send({habilitado:true,clientId:"123-test.apps.googleusercontent.com"});
  if(suffix==="/assistente/chat"){requests.push(r.request().postDataJSON());return send({resposta:"Proposta QA",acao:proposal})}
  if(suffix==="/tarefas"&&method==="POST"){const input=r.request().postDataJSON();assert.equal(input.usuarioId,777);tasks.push({...input,id:123});return send(tasks.at(-1))}
  if(suffix.startsWith("/tarefas/usuario/"))return send(tasks);
  return send({});
 });
 await ctx.route("https://accounts.google.com/gsi/client",r=>r.fulfill({status:200,contentType:"text/javascript",body:"window.google={accounts:{id:{initialize(){},renderButton(m){m.textContent='Google QA'}}}}"}));
 await p.goto(base+"profile.html");
 await p.locator("#googleAccountCard").getByText("qa@example.invalid",{exact:false}).waitFor();
 assert.equal(await p.locator("#googleProfileMount").isVisible(),false);
 assert.match(await p.locator("#fluirSessionCount").innerText(),/2/);
 assert.match(await p.locator("#fluirSessionList").innerText(),/Windows · Chrome/);
 p.once("dialog",d=>d.accept());
 await p.getByRole("button",{name:"Encerrar sessão"}).click();
 await p.waitForFunction(()=>document.getElementById("fluirSessionCount").textContent.includes("1"));
 assert.deepEqual(revoked,["other"]);console.log("PASS: verified Google identity, real-session UI, revoke other session (mocked API)");
 await p.goto(base+"dashboard.html");
 await p.locator("#fluirAssistantButton").click();
 await p.locator(".fluir-assistant-form textarea").fill("Create a habit");
 await p.locator(".fluir-assistant-form button[type=submit]").click();
 assert.equal(requests.length,0);
 await p.locator(".fluir-assistant-consent input").check();
 proposal={tipo:"habito",titulo:"Ler todos os dias",texto:"",dias:[0,1,2,3,4,5,6]};
 await p.locator(".fluir-assistant-form button[type=submit]").click();
 await p.getByRole("button",{name:"Confirmar e salvar"}).waitFor();
 assert.equal(await p.evaluate(()=>FluirStorage.getItem("fluir-habits")),null);
 await p.getByRole("button",{name:"Confirmar e salvar"}).click();
 await p.getByText("Registro salvo com sucesso.",{exact:true}).waitFor();
 assert.equal(await p.evaluate(()=>JSON.parse(FluirStorage.getItem("fluir-habits"))[0].weeklyGoal),7);
 assert.equal(await p.locator(".fluir-assistant-consent").isVisible(),false);
 proposal={tipo:"diario",titulo:"Meu dia",texto:"Terminei meu projeto."};
 await p.locator(".fluir-assistant-form textarea").fill("Anote no diario");
 await p.locator(".fluir-assistant-form button[type=submit]").click();
 await p.getByRole("button",{name:"Confirmar e salvar"}).click();
 await p.waitForFunction(()=>JSON.parse(FluirStorage.getItem("fluir-diary")||"[]").length===1);
 proposal={tipo:"tarefa",titulo:"Revisar projeto",texto:"",data:"2026-11-27",hora:"10:00"};
 await p.locator(".fluir-assistant-form textarea").fill("Crie uma tarefa");
 await p.locator(".fluir-assistant-form button[type=submit]").click();
 await p.getByRole("button",{name:"Confirmar e salvar"}).click();
 await p.waitForFunction(()=>document.querySelectorAll(".fluir-assistant-bubble p").length>2);
 assert.equal(tasks.length,1);
 assert.equal(requests.length,3);assert(requests.every(r=>r.consentimento===true));
 console.log("PASS: consent once, confirmed habit and diary locally, task POST (mocked AI and API)");
 await p.goto(base+"settings.html");
 assert.equal(await p.locator("#fluirAIRevoke").isEnabled(),true);
 await p.locator("#fluirAIRevoke").click();
 assert.equal(await p.evaluate(()=>FluirStorage.getItem("fluir-ai-consent-v1")),null);
 await p.locator("#fluirAssistantButton").click();
 assert.equal(await p.locator(".fluir-assistant-consent").isVisible(),true);
 console.log("PASS: revoke consent from settings");
 const pages=["dashboard","timeline","tasks","habits","sleep","water","finances","diary","nutrition","physical-health","menstrual-cycle","attachments","achievements","settings","profile","plans"];
 for(const locale of ["en-US","es"]){
   await p.evaluate(locale=>FluirStorage.setItem("fluir-language",locale),locale);
   for(const name of pages){
     await p.goto(base+name+".html");
     assert.equal(await p.locator("html").getAttribute("lang"),locale,name);
     assert.equal(await p.evaluate(()=>FluirI18n.t("Tarefas")),locale==="en-US"?"Tasks":"Tareas");
   }
 }
 assert.equal(errors.length,0,errors.join("\n"));
 console.log("PASS: 32 authenticated page loads EN/ES without JavaScript exceptions");
 for(const [lang,heading] of [["de","Hallo, Besucher"],["it","Ciao, visitatore"]]){
  const d=await browser.newPage();await d.goto(base+"demo.html?lang="+lang);
  await d.locator("#demoHeading").getByText(heading,{exact:true}).waitFor();
  await d.locator(".demo-sidebar [data-demo-view='tasks']").click();
  await d.locator("#demoHeading").getByText(lang==="de"?"Aufgaben":"Attività",{exact:true}).waitFor();
  await d.close();
 }
 console.log("PASS: German and Italian demo headings/navigation");
 await p.evaluate(()=>FluirStorage.setItem("fluir-language","pt-BR"));
 await p.goto(base+"profile.html");
 await p.locator("[data-fluir-logout]").first().click();
 await p.waitForURL("**/login.html");
 assert.equal(logout,true);assert.equal(await p.evaluate(()=>sessionStorage.getItem("fluir-user")),null);
 console.log("PASS: logout calls server then clears local session");
 await ctx.close();
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});