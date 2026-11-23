const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=(()=>{try{return require("playwright")}catch{return require(path.join(process.env.TEMP,"fluir-browser-qa-2211","node_modules","playwright"))}})();
const URL="http://127.0.0.1:5505/html/login.html";
const SETUP="http://127.0.0.1:5505/html/setup.html";
const BACKEND="https://fluir-sistema.onrender.com";
const PHOTO_FAKE="TOKEN_TESTE_SEM_ACESSO_REAL_0123456789ABCDEF";
const results=[];
function test(name,fn){return fn().then(()=>{results.push("PASS "+name);console.log("PASS "+name)})}
async function reachLastStep(page){
 await page.locator("#userName").fill("Pessoa QA");
 await page.locator("#userNickname").fill("QA");
 for(const id of ["sexAtBirth","userPronouns","communicationTone"]){
  const values=await page.locator("#"+id+" option").evaluateAll(options=>options.map(o=>o.value).filter(Boolean));
  await page.locator("#"+id).selectOption(values[0]);
 }
 await page.locator("#userAge").fill("22");
 for(let i=0;i<4;i++)await page.locator("#nextBtn").click();
 assert.equal(await page.locator('.setup-step[data-step="5"].active').count(),1);
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",args:["--no-sandbox"]});
 try {
 // Cadastro lento: tela não some, evita cadastro duplicado, só redireciona após 200.
 const pc=await browser.newPage({viewport:{width:1280,height:820}});
 let allowCadastro;const responseGate=new Promise(resolve=>allowCadastro=resolve);
 let cadastros=0;
 await pc.route(BACKEND+"/api/usuarios/cadastro",async route=>{
  cadastros++;await responseGate;
  await route.fulfill({status:201,contentType:"application/json",body:JSON.stringify({
   id:88,nome:"Pessoa Teste",email:"qa@fluir.invalid",token:PHOTO_FAKE})});
 });
 await pc.goto(URL,{waitUntil:"domcontentloaded"});
 await pc.locator("#showRegister").click();
 const registration=pc.locator("#registerForm");
 await registration.locator('input[type="text"]').first().fill("Pessoa Teste");
 await registration.locator('input[type="email"]').fill("qa@fluir.invalid");
 await pc.locator("#registerPassword").fill("SenhaFicticia123!");
 await pc.locator("#registerConfirmPassword").fill("SenhaFicticia123!");
 await registration.locator('button[type="submit"]').click();
 await pc.locator("#fluirTransition").waitFor({state:"visible"});
 await test("Cadastro exibe carregamento enquanto backend ainda processa",async()=>{
  assert.match(await pc.locator("#fluirTransition").innerText(),/Criando sua conta/);
  assert.equal(await pc.locator("main.page").getAttribute("aria-busy"),"true");
  assert.equal(await pc.locator("#fluirTransition").getAttribute("role"),"status");
  await registration.evaluate(el=>el.requestSubmit());
  assert.equal(cadastros,1);
 });
 allowCadastro();
 await pc.waitForURL("**/setup.html",{timeout:8000});
 await test("Cadastro só navega ao onboarding após resposta válida",async()=>{
  assert.equal(cadastros,1);
  assert.equal(await pc.evaluate(()=>JSON.parse(sessionStorage.getItem("fluir-user")).id),88);
 });
 await pc.close();
 const fail=await browser.newPage();
 await fail.route(BACKEND+"/api/usuarios/cadastro",r=>r.fulfill({status:503,contentType:"application/json",body:'{"mensagem":"Serviço temporariamente indisponível."}'}));
 await fail.goto(URL,{waitUntil:"domcontentloaded"});
 await fail.locator("#showRegister").click();
 await fail.locator("#registerForm input[type=text]").first().fill("Pessoa Teste");
 await fail.locator("#registerForm input[type=email]").fill("qa@fluir.invalid");
 await fail.locator("#registerPassword").fill("SenhaFicticia123!");
 await fail.locator("#registerConfirmPassword").fill("SenhaFicticia123!");
 await fail.locator("#registerForm button[type=submit]").click();
 await fail.locator("#registerMessage").getByText(/indisponível/i).waitFor();
 await test("Cadastro 503 restaura formulário sem prender overlay",async()=>{
  assert.equal(await fail.locator("#fluirTransition").isVisible(),false);
  assert.equal(await fail.locator("main.page").getAttribute("aria-busy"),null);
  assert.equal(await fail.locator("#registerForm button[type=submit]").isEnabled(),true);
 });
 await fail.close();
 // Onboarding lento (com POST simulado): overlay depende da operação real.
 const setup=await browser.newPage({viewport:{width:1200,height:800}});
 await setup.addInitScript(t=>sessionStorage.setItem("fluir-user",JSON.stringify({id:88,nome:"Pessoa Teste",token:t})),PHOTO_FAKE);
 let approveSetup;const setupGate=new Promise(resolve=>approveSetup=resolve);
 let saves=0;
 await setup.route(BACKEND+"/api/onboarding/salvar",async route=>{
  saves++;await setupGate;
  await route.fulfill({status:200,contentType:"application/json",body:'{"status":"salvo"}'});
 });
 await setup.route("http://localhost:8080/api/planos/interesse",r=>r.fulfill({status:200,contentType:"application/json",body:'{"status":"salvo"}'}));
 await setup.goto(SETUP,{waitUntil:"domcontentloaded"});
 await reachLastStep(setup);
 await setup.locator("#nextBtn").click();
 await setup.locator("#fluirTransition").waitFor({state:"visible"});
 await test("Onboarding mostra progresso durante gravação, sem navegar antes da resposta",async()=>{
  assert.match(await setup.locator("#fluirTransition").innerText(),/Salvando suas preferências/);
  assert.equal(saves,1);
  assert.equal(await setup.locator("#nextBtn").isEnabled(),false);
  assert.ok(setup.url().includes("setup.html"));
 });
 approveSetup();
 await setup.waitForURL("**/dashboard.html",{timeout:8000});
 await test("Onboarding só abre dashboard após confirmar salvamento",async()=>{
  assert.equal(saves,1);
  assert.equal(await setup.evaluate(()=>sessionStorage.getItem("fluir-onboarding-completed")),"true");
 });
 await setup.close();
 // Onboarding 503: mantém contexto e permite repetir; não grava antes do sucesso.
 const retry=await browser.newPage();
 await retry.addInitScript(t=>sessionStorage.setItem("fluir-user",JSON.stringify({id:88,nome:"Pessoa Teste",token:t})),PHOTO_FAKE);
 let attempts=0;
 await retry.route(BACKEND+"/api/onboarding/salvar",r=>{
  attempts++;
  return r.fulfill({status:attempts===1?503:200,contentType:"application/json",
    body:attempts===1?'{"mensagem":"Serviço de teste indisponível."}':'{"status":"salvo"}'});
 });
 await retry.route("http://localhost:8080/api/planos/interesse",r=>r.fulfill({status:200,contentType:"application/json",body:'{"status":"salvo"}'}));
 await retry.goto(SETUP,{waitUntil:"domcontentloaded"});
 await reachLastStep(retry);
 await retry.locator("#nextBtn").click();
 await retry.locator("#formMessage.show").waitFor();
 await test("Falha ao salvar mostra erro e restaura o botão para tentar de novo",async()=>{
  assert.equal(attempts,1);
  assert.equal(await retry.locator("#fluirTransition").isVisible(),false);
  assert.equal(await retry.locator("#nextBtn").isEnabled(),true);
  assert.equal(await retry.evaluate(()=>sessionStorage.getItem("fluir-onboarding-completed")),null);
 });
 await retry.locator("#nextBtn").click();
 await retry.waitForURL("**/dashboard.html",{timeout:8000});
 await test("Nova tentativa salva e navega normalmente",async()=>assert.equal(attempts,2));
 await retry.close();
 // Exibição e acessibilidade na largura de celular + movimento reduzido.
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,reducedMotion:"reduce"});
 await mobile.goto(URL,{waitUntil:"domcontentloaded"});
 await mobile.evaluate(()=>window.FluirTransition.show("Preparando seu espaço...","Sem dados pessoais aqui."));
 await test("Tela responsiva 390px e animação desligada em reduzir movimento",async()=>{
  const values=await mobile.evaluate(()=>{
   const overlay=document.getElementById("fluirTransition");
   return {scroll:document.documentElement.scrollWidth,viewport:innerWidth,
    animation:getComputedStyle(overlay.querySelector(".fluir-transition__spinner")).animationName,
    status:overlay.getAttribute("aria-live")};
  });
  assert.ok(values.scroll<=values.viewport+1,JSON.stringify(values));
  assert.equal(values.animation,"none");
  assert.equal(values.status,"polite");
 });
 await mobile.screenshot({path:path.join(__dirname,"evidencia-transicao-mobile-23-11.png")});
 await mobile.close();
 const out=path.join(__dirname,"relatorio-transicoes-23-11.txt");
 fs.writeFileSync(out,results.join("\n")+"\n"+results.length+" testes aprovados\n");
 console.log("TOTAL",results.length);
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
