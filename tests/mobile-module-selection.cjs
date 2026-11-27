"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,"..");
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,"."+new URL(req.url,"http://localhost").pathname);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return}
 const types={".html":"text/html; charset=utf-8",".css":"text/css",".js":"application/javascript",".svg":"image/svg+xml"};
 res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream"});fs.createReadStream(file).pipe(res)
});
(async()=>{
 await new Promise(r=>server.listen(5517,"127.0.0.1",r));
 const browser=await chromium.launch({channel:"chrome",headless:true});
 try{
  const ctx=await browser.newContext({viewport:{width:390,height:844}});
  await ctx.route("https://xqzxfhodhmlgneudubjm.supabase.co/**",r=>r.fulfill({status:200,contentType:"application/json",body:r.request().url().includes("/tarefas/usuario/")?"[]":"{}"}));
  const p=await ctx.newPage(),base="http://127.0.0.1:5517/html/";
  await p.goto(base+"login.html");
  await p.evaluate(()=>{sessionStorage.setItem("fluir-user",JSON.stringify({id:777,token:"test_only_token_01234567890123456",nome:"QA"}));sessionStorage.setItem("fluir-onboarding-completed","true");FluirStorage.setItem("fluir-setup",JSON.stringify({usuarioId:777,onboardingConcluido:true,user:{name:"QA"},modules:{timeline:true,tasks:true,habits:false,sleep:false,water:false,finances:false,diary:false,nutrition:false,physicalHealth:false,menstrualCycle:false,attachments:false}}))});
  const getLinks=sel=>p.locator(sel).evaluateAll(es=>es.map(e=>e.getAttribute("href")));
  for(const width of [320,390,760,1280]){
   await p.setViewportSize({width,height:844});await p.goto(base+"dashboard.html");
   const mobile=await getLinks(".mobile-drawer-nav a"),desktop=await getLinks(".sidebar-nav a");
   assert.deepEqual(mobile,desktop);
   assert(mobile.includes("tasks.html"));assert(!mobile.includes("habits.html"));assert(!mobile.includes("water.html"));
   assert.deepEqual(await getLinks(".mobile-bottom-nav a"),["dashboard.html","timeline.html","tasks.html"]);
  }
  await p.setViewportSize({width:390,height:844});
  for(const page of ["timeline","tasks","habits","sleep","water","finances","diary","nutrition","physical-health","menstrual-cycle","attachments","achievements","settings","profile","plans"]){
   await p.goto(base+page+".html");
   const icons=await p.locator(".page-icon,.title-icon,.heading-icon").evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>({display:getComputedStyle(e).display,center:getComputedStyle(e).placeItems,position:getComputedStyle(e,"::before").position,anchor:getComputedStyle(e).position,left:parseFloat(getComputedStyle(e,"::before").left),top:parseFloat(getComputedStyle(e,"::before").top),width:e.clientWidth,height:e.clientHeight,transform:getComputedStyle(e,"::before").transform})));
   for(const icon of icons){assert.equal(icon.display,"grid",page);assert.equal(icon.center,"center",page);assert.equal(icon.position,"absolute",page);assert.equal(icon.anchor,"relative",page);assert(Math.abs(icon.left-icon.width/2)<=1,page+" horizontal center");assert(Math.abs(icon.top-icon.height/2)<=1,page+" vertical center");assert.equal(icon.transform,"matrix(1, 0, 0, 1, -11, -11)",page)}
  }
  await p.goto(base+"timeline.html");
  assert(await p.locator(".timeline-panel").evaluate(e=>e.getBoundingClientRect().height)<200,"empty timeline too tall");
  assert.equal(await p.locator("#timelinePeriodLabel").textContent(),"Todos os dias");
  await p.evaluate(()=>{
    const today=new Date(), old=new Date(today);old.setDate(old.getDate()-35);
    const key=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
    FluirStorage.setItem("fluir-timeline-events",JSON.stringify([
      {id:101,title:"QA hoje",category:"tasks",date:key(today),time:"10:00"},
      {id:102,title:"QA anterior",category:"tasks",date:key(old),time:"11:00"}
    ]));
  });
  await p.reload();
  assert.equal(await p.locator(".event-item:not(.hidden-event)").count(),2);
  await p.locator("#timelinePeriodBtn").click();
  assert.equal(await p.locator("#timelinePeriodBtn").getAttribute("data-period"),"today");
  assert.equal(await p.locator(".event-item:not(.hidden-event)").count(),1);
  await p.locator("#timelinePeriodBtn").click();
  assert.equal(await p.locator("#timelinePeriodBtn").getAttribute("data-period"),"week");
  assert.equal(await p.locator(".event-item:not(.hidden-event)").count(),1);
  await p.locator("#timelinePeriodBtn").click();
  assert.equal(await p.locator(".event-item:not(.hidden-event)").count(),2);
  console.log("PASS: compact empty timeline, today/week/all period filters");
  console.log("PASS: mobile and desktop module selection matches at 4 widths; title icon CSS checked across 15 pages");
  await ctx.close();
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1})