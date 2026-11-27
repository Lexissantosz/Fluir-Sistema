"use strict";
const assert=require("node:assert/strict"),{test}=require("node:test");
const session=require("../api/remember-session.js"),download=require("../api/qa-apk.js");
function request(handler,{method="GET",origin="https://qa.example.test",cookie,body,site}={}){
 const headers={host:"qa.example.test",origin,"content-type":"application/json",...(cookie?{cookie}:{}),...(site?{"sec-fetch-site":site}:{})};
 const res={statusCode:200,headers:{},body:"",setHeader(k,v){this.headers[k.toLowerCase()]=v},end(s=""){this.body=s}};
 return Promise.resolve(handler({method,headers,body},res)).then(()=>res);
}
test("remember cookie validates account and expiry, rejects CSRF and clears logout",async()=>{
 const original=global.fetch, token="a".repeat(48);let revoked=false,wrongId=false,expired=false, calls=0;
 global.fetch=async (url,options)=>{calls++;assert.equal(options.headers.Authorization,"Bearer "+token);if(revoked)return new Response("{}",{status:401});
 if(url.endsWith("/conta/seguranca"))return Response.json({google:{nome:"QA",email:"qa@example.invalid"},sessoes:[{atual:true,expiraEm:new Date(Date.now()+(expired?-1:3600000)).toISOString()}]});
 return wrongId?new Response("{}",{status:403}):Response.json({usuarioId:77,onboardingConcluido:true});};
 try{
 let r=await request(session);assert.equal(r.statusCode,401);assert.equal(calls,0);
 r=await request(session,{method:"POST",origin:"https://evil.example",body:{id:77,token}});assert.equal(r.statusCode,403);assert.equal(calls,0);
 r=await request(session,{method:"POST",body:{id:77,token}});assert.equal(r.statusCode,204);const cookie=r.headers["set-cookie"];assert.match(cookie,/^__Host-fluir_remember=77\.[a]+; Path=\/; Secure; HttpOnly; SameSite=Strict; Max-Age=\d+$/);assert(Number(cookie.split("Max-Age=")[1])<=3600);
 const raw=cookie.split(";")[0];r=await request(session,{cookie:raw});assert.equal(r.statusCode,200);assert.equal(JSON.parse(r.body).id,77);assert.equal(r.headers["cache-control"],"private, no-store, max-age=0");
 wrongId=true;r=await request(session,{cookie:raw});assert.equal(r.statusCode,401);assert.match(r.headers["set-cookie"],/Max-Age=0/);wrongId=false;
 expired=true;r=await request(session,{cookie:raw});assert.equal(r.statusCode,401);expired=false;
 revoked=true;r=await request(session,{cookie:raw});assert.equal(r.statusCode,401);
 r=await request(session,{method:"DELETE",cookie:raw});assert.equal(r.statusCode,204);assert.match(r.headers["set-cookie"],/Max-Age=0/);
 }finally{global.fetch=original;}
});
test("APK link restricted to preview and valid expiry",async()=>{
 const orig={...process.env};try{
 process.env.VERCEL_ENV="production";process.env.FLUIR_QA_APK_URL="https://fluir-sistema-example-lexissantosz.vercel.app/Fluir-QA-Android-test.apk?_vercel_share=synthetic";process.env.FLUIR_QA_APK_EXPIRES_AT=String(Math.floor(Date.now()/1000)+3600);
 let r=await request(download,{method:"HEAD"});assert.equal(r.statusCode,404);
 process.env.VERCEL_ENV="preview";r=await request(download,{method:"HEAD"});assert.equal(r.statusCode,204);
 r=await request(download);assert.equal(r.statusCode,302);assert.equal(r.headers.location,process.env.FLUIR_QA_APK_URL);
 process.env.FLUIR_QA_APK_EXPIRES_AT="1";r=await request(download);assert.equal(r.statusCode,404);
 process.env.FLUIR_QA_APK_EXPIRES_AT=String(Math.floor(Date.now()/1000)+3600);process.env.FLUIR_QA_APK_URL="https://evil.example/Fluir-QA-Android-test.apk?_vercel_share=synthetic";r=await request(download);assert.equal(r.statusCode,404);
 }finally{for(const k of ["VERCEL_ENV","FLUIR_QA_APK_URL","FLUIR_QA_APK_EXPIRES_AT"]){if(orig[k]===undefined)delete process.env[k];else process.env[k]=orig[k];}}
});
