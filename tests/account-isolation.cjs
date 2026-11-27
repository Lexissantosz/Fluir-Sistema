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
(async()=>{
 await new Promise(r=>server.listen(5513,"127.0.0.1",r));
 const browser=await chromium.launch({channel:"chrome",headless:true});
 try {
 const ctx=await browser.newContext();
 await ctx.route("https://xqzxfhodhmlgneudubjm.supabase.co/**",r=>r.fulfill({status:200,contentType:"application/json",body:r.request().url().includes("/tarefas/usuario/")?"[]":"{}"}));
 const base="http://127.0.0.1:5513/html/";
 const a=await ctx.newPage(), b=await ctx.newPage();
 for(const [page,id] of [[a,101],[b,202]]){
  await page.goto(base+"login.html");
  await page.evaluate(id=>{
   sessionStorage.setItem("fluir-user",JSON.stringify({id,token:"test_only_token_01234567890123456",nome:"QA "+id}));
   sessionStorage.setItem("fluir-onboarding-completed","true");
   FluirStorage.setItem("fluir-setup",JSON.stringify({usuarioId:id,onboardingConcluido:true,user:{name:"QA "+id},modules:{tasks:true,habits:true,water:true,diary:true}}));
  },id);
 }
 const keys=["fluir-timeline-events","fluir-habits","fluir-water","fluir-sleep-logs","fluir-finances","fluir-diary","fluir-profile","fluir-attachments","fluir-menstrual-cycle","fluir-nutrition","fluir-physical-health"];
 await a.evaluate(keys=>{
  for(const k of keys){localStorage.setItem(k,JSON.stringify(["LEGACY"]));FluirStorage.setItem(k,JSON.stringify([{title:"PRIVATE_A",date:"2026-11-26",completedDates:[]}]))}
 },keys);
 assert.deepEqual(await b.evaluate(keys=>keys.map(k=>FluirStorage.getItem(k)),keys),keys.map(()=>null));
 assert.notEqual(await a.evaluate(()=>FluirStorage.databaseName("fluir-attachments-db")),await b.evaluate(()=>FluirStorage.databaseName("fluir-attachments-db")));
 await b.goto(base+"dashboard.html");
 await b.locator("#dashboardTaskList").getByText("Nenhuma tarefa ainda").waitFor();
 assert.equal(await b.getByText("PRIVATE_A",{exact:true}).count(),0);
 assert.equal(await b.getByText("Acordei",{exact:true}).count(),0);
 await b.goto(base+"timeline.html");
 await b.locator("#timelineEmptyState").waitFor();
 assert.equal(await b.locator(".event-item").count(),0);
 await b.goto(base+"habits.html");
 assert.equal(await b.evaluate(()=>JSON.parse(FluirStorage.getItem("fluir-habits")||"[]").length),0);
 await a.goto(base+"timeline.html");
 assert.equal(await a.locator(".event-item").count(),1);
 assert.equal(await a.evaluate(()=>JSON.parse(FluirStorage.getItem("fluir-timeline-events"))[0].title),"PRIVATE_A");
 await b.goto(base+"login.html");
 await b.evaluate(()=>{sessionStorage.removeItem("fluir-user");sessionStorage.removeItem("fluir-onboarding-completed")});
 assert.equal(await b.evaluate(()=>FluirStorage.getItem("fluir-timeline-events")),null);
 await b.goto(base+"timeline.html");
 await b.waitForURL("**/login.html");
 assert.equal(await a.evaluate(()=>JSON.parse(localStorage.getItem("fluir-timeline-events"))[0]),"LEGACY");
 console.log("PASS: two accounts, 11 data keys, legacy preserved, separate attachment DB names, empty dashboard/timeline/habits, guest redirect");
 await ctx.close();
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});