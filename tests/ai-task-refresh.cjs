const {chromium}=require("playwright"),assert=require("node:assert/strict"),http=require("node:http"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const server=http.createServer((req,res)=>{const f=path.resolve(root,"."+new URL(req.url,"http://localhost").pathname);if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return}res.writeHead(200,{"Content-Type":{".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css",".svg":"image/svg+xml"}[path.extname(f)]||"application/octet-stream"});fs.createReadStream(f).pipe(res)});
(async()=>{await new Promise(r=>server.listen(5528,"127.0.0.1",r));const browser=await chromium.launch({channel:"chrome",headless:true});
try{
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await page.addInitScript(()=>{sessionStorage.setItem("fluir-user",JSON.stringify({id:777,nome:"QA",token:"qa_test_token_12345678901234567890"}));sessionStorage.setItem("fluir-onboarding-completed","true");localStorage.setItem("fluir:account:777:fluir-setup",JSON.stringify({usuarioId:777,onboardingConcluido:true,user:{name:"QA"},modules:{tasks:true}}));});
const api="https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api";
const today=new Date();const future=new Date(today);future.setDate(today.getDate()+40);const dateKey=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
const records=[{id:101,titulo:"Tarefa futura existente",dataTarefa:dateKey(future),categoria:"Pessoal",prioridade:"low",concluida:false}];let posts=0,reads=0;
const respond=(r,data,status=200)=>r.fulfill({status,contentType:"application/json",body:JSON.stringify(data)});
await page.route(api+"/**",r=>{const url=r.request().url(),method=r.request().method();
if(url.endsWith("/tarefas/usuario/777")){reads++;return respond(r,records)}
if(url.endsWith("/tarefas")&&method==="POST"){posts++;const b=r.request().postDataJSON();assert.equal(b.usuarioId,777);assert.equal(b.dataTarefa,dateKey(future));const saved={...b,id:102};records.unshift(saved);return respond(r,saved)}
if(url.endsWith("/assistente/chat"))return respond(r,{resposta:"Confira a proposta.",acao:{tipo:"tarefa",titulo:"Tarefa IA QA",texto:"Teste",data:dateKey(future),hora:"15:00"}});
return respond(r,{});});
const base="http://127.0.0.1:5528/html/";
await page.goto(base+"tasks.html");await page.locator("#taskList .task-card").filter({hasText:"Tarefa futura existente"}).waitFor();assert.equal(await page.locator("#periodBtnLabel").innerText(),"Todos os dias");assert.equal(await page.locator("#pendingTasks").innerText(),"1");
await page.locator("#periodBtn").click();await page.locator('[data-period="today"]').click();assert.equal(await page.locator("#taskList .task-card").count(),0);assert.equal(await page.locator("#pendingTasks").innerText(),"0");
await page.locator("#fluirAssistantButton").click();await page.locator(".fluir-assistant-form textarea").fill("Crie uma tarefa futura");if(await page.locator(".fluir-assistant-consent input").isVisible())await page.locator(".fluir-assistant-consent input").check();await page.locator(".fluir-assistant-form button[type=submit]").click();
await page.getByRole("button",{name:"Confirmar e salvar",exact:true}).click();await page.getByText("Registro salvo com sucesso.",{exact:true}).waitFor();
await page.locator("#taskList .task-card").filter({hasText:"Tarefa IA QA"}).waitFor();assert.equal(await page.locator("#periodBtnLabel").innerText(),"Todos os dias");assert.equal(await page.locator("#pendingTasks").innerText(),"2");assert.equal(posts,1);
await page.reload();await page.locator("#taskList .task-card").filter({hasText:"Tarefa IA QA"}).waitFor();assert.equal(await page.locator("#taskList .task-card").count(),2);assert.equal(posts,1);assert(reads>=2);
console.log("PASS: future tasks visible by default, period counts consistent, AI saves once and refreshes list, reload persists (mocked API).");
await page.goto(base+"dashboard.html");await page.locator('[data-module-panel="tasks"] .small-btn').waitFor();for(const width of [320,390,430]){await page.setViewportSize({width,height:844});const info=await page.locator('[data-module-panel="tasks"] .panel-header').evaluate(el=>{const a=el.getBoundingClientRect(),b=el.querySelector(".small-btn").getBoundingClientRect(),c=el.querySelector("h3").getBoundingClientRect();return {delta:Math.abs((a.x+a.width/2)-(b.x+b.width/2)),below:b.y>=c.bottom,overflow:document.documentElement.scrollWidth>innerWidth+1}});assert(info.delta<3&&info.below&&!info.overflow,JSON.stringify({width,...info}));}console.log("PASS: Dashboard task button centered at 320, 390, 430px.");
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});