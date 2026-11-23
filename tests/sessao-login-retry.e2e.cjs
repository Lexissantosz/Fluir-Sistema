const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const {chromium} = (()=>{try{return require("playwright")}catch{return require(path.join(process.env.TEMP, "fluir-browser-qa-2211", "node_modules", "playwright"))}})();
const BASE="http://127.0.0.1:5505/html/login.html";
const API="https://fluir-sistema.onrender.com";
const token="TOKEN_FICTICIO_TESTE_A_SESSAO_0123456789abcd";
const browserBin="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outcomes=[];
async function run(name,fn){try{await fn();outcomes.push("PASS "+name);console.log("PASS",name)}catch(e){outcomes.push("FAIL "+name+": "+e.message);throw e}}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:browserBin,args:["--no-sandbox"]});
 async function setup() {
   const ctx=await browser.newContext();
   const page=await ctx.newPage();
   let loginCalls=0,preferencesCalls=0;
   await page.route(API+"/api/usuarios/login",r=>{
     loginCalls++;return r.fulfill({status:200,contentType:"application/json",
        body:JSON.stringify({id:7,nome:"Pessoa Teste",email:"teste@fluir.invalid",token})});
   });
   await page.goto(BASE,{waitUntil:"domcontentloaded"});
   const email=page.locator("#loginForm input[type=email]");
   const password=page.locator("#loginForm input[type=password]").first();
   await email.fill("teste@fluir.invalid");
   await password.fill("senha_teste_ficticia");
   return {ctx,page,stats:()=>({loginCalls,preferencesCalls}), setRequest:async handler=>{
     await page.route(API+"/api/onboarding/usuario/7",r=>{preferencesCalls++;return handler(r,preferencesCalls)});
   }};
 }
 const first=await setup();
 await first.setRequest((r,n)=>r.fulfill({status:n===1?503:200,contentType:"application/json",
   body:n===1?'{"mensagem":"temporariamente indisponível"}':JSON.stringify({
     usuarioId:7,onboardingConcluido:false,modulos:{},apelido:"Teste",nome:"Pessoa Teste"})}));
 await first.page.locator("#loginForm button[type=submit]").click();
 await run("Falha 503 de preferências mantém token recebido no login",async()=>{
   await first.page.locator("#loginMessage").getByText(/sessão foi mantida/i).waitFor();
   assert.equal((await first.page.evaluate(()=>JSON.parse(sessionStorage.getItem("fluir-user")))).token,token);
   assert.equal(first.stats().loginCalls,1);assert.equal(first.stats().preferencesCalls,1);
 });
 await run("Retry verifica preferências sem gerar segundo login",async()=>{
   await first.page.getByRole("button",{name:"Tentar carregar preferências novamente"}).click();
   await first.page.waitForURL("**/setup.html",{timeout:6000});
   assert.equal(first.stats().loginCalls,1);
   assert.equal(first.stats().preferencesCalls,2);
   assert.equal((await first.page.evaluate(()=>JSON.parse(sessionStorage.getItem("fluir-user")))).token,token);
 });
 await first.ctx.close();
 const rejected=await setup();
 await rejected.setRequest(r=>r.fulfill({status:401,contentType:"application/json",body:'{"mensagem":"Sessão rejeitada"}'}));
 await rejected.page.locator("#loginForm button[type=submit]").click();
 await run("401 de preferências remove token e não oferece Retry",async()=>{
   await rejected.page.locator("#loginMessage").getByText(/sessão rejeitada/i).waitFor();
   assert.equal(await rejected.page.evaluate(()=>sessionStorage.getItem("fluir-user")),null);
   assert.equal(await rejected.page.getByRole("button",{name:"Tentar carregar preferências novamente"}).count(),0);
 });
 await rejected.ctx.close();
 const network=await setup();
 await network.setRequest(r=>r.abort("failed"));
 await network.page.locator("#loginForm button[type=submit]").click();
 await run("Falha de rede preserva sessão e oferece Retry",async()=>{
   await network.page.locator("#loginMessage").getByText(/sessão foi mantida/i).waitFor();
   assert.equal((await network.page.evaluate(()=>JSON.parse(sessionStorage.getItem("fluir-user")))).token,token);
   assert.equal(await network.page.getByRole("button",{name:"Tentar carregar preferências novamente"}).count(),1);
 });
 await network.ctx.close();
 const forbidden=await setup();
 await forbidden.setRequest(r=>r.fulfill({status:403,contentType:"application/json",
   body:'{"mensagem":"Acesso temporariamente indisponível"}'}));
 await forbidden.page.locator("#loginForm button[type=submit]").click();
 await run("403 na consulta de preferências não destrói token válido",async()=>{
   await forbidden.page.locator("#loginMessage").getByText(/sessão foi mantida/i).waitFor();
   assert.equal((await forbidden.page.evaluate(()=>JSON.parse(sessionStorage.getItem("fluir-user")))).token,token);
   assert.equal(await forbidden.page.getByRole("button",{name:"Tentar carregar preferências novamente"}).count(),1);
 });
 await forbidden.ctx.close();
 const absent=await setup();
 await absent.setRequest(r=>r.fulfill({status:400,contentType:"application/json",
   body:JSON.stringify({mensagem:"Onboarding não encontrado para este usuário"})}));
 await absent.page.locator("#loginForm button[type=submit]").click();
 await run("Conta nova sem onboarding vai para configuração, sem erro de sessão",async()=>{
   await absent.page.waitForURL("**/setup.html",{timeout:7000});
   assert.equal(absent.stats().loginCalls,1);
   assert.equal(absent.stats().preferencesCalls,1);
 });
 await absent.ctx.close();
 await browser.close();
 fs.writeFileSync(path.join(__dirname,"relatorio-sessao-retry-23-11.txt"),outcomes.join("\n")+"\n"+outcomes.length+" cenários aprovados\n");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
