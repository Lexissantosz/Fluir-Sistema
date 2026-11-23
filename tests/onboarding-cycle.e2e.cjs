const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=(()=>{try{return require("playwright")}catch{
 return require(path.join(process.env.TEMP||process.env.TMP,"fluir-browser-qa-2211","node_modules","playwright"));
}})();
const URL="http://127.0.0.1:5505/html/setup.html";
const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==","base64");
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",args:["--no-sandbox"]});
 let passed=0;const lines=[];const note=x=>{lines.push(x);console.log(x)};
 const run=async(name,fn)=>{try{await fn();passed++;note("PASS "+name)}catch(e){note("FAIL "+name+": "+e.message);throw e}};
 const page=await browser.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1});
 let errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(URL,{waitUntil:"domcontentloaded"});
 await run("onboarding original permanece com quatro etapas",async()=>{
  assert.match(await page.title(),/Fluir/i);assert.equal(await page.locator(".setup-step").count(),4);
  assert.equal(await page.locator("#restartSetupBtn").count(),1);
 });
 async function reachCycle(){
  await page.locator("#userName").fill("Pessoa Teste");
  await page.locator("#userNickname").fill("Pessoa");
  for(const id of ["sexAtBirth","userPronouns","communicationTone"]){
    const option=await page.locator("#"+id+" option").evaluateAll(options=>options.map(o=>o.value).filter(v=>v!==""));
    await page.locator("#"+id).selectOption(option[0]);
  }
  await page.locator("#userAge").fill("22");
  await page.locator("#nextBtn").click();
  await page.locator('.module-option input[value="menstrualCycle"]').check();
  await page.locator("#nextBtn").click();
  await page.locator("#fluirCycleBlock").waitFor({state:"visible"});
 }
 await reachCycle();
 await run("Ciclo integrado à etapa 3, sem protótipo paralelo",async()=>{
  assert.equal(await page.locator("#fluirCycleBlock").count(),1);
  assert.match(await page.locator("#fluirCycleBlock").textContent(),/mais de uma pessoa/i);
  assert.doesNotMatch(await page.locator("#fluirCycleBlock").textContent(),/sexo atribuído ao nascer/i);
 });
 await run("Múltiplas pessoas: 'Outra pessoa' + 'Sim' cria duas vagas",async()=>{
  await page.locator("#cycleMode").selectOption("other");
  assert.equal(await page.locator(".cycle-person").count(),1);
  await page.locator("#cycleCountYes").click();
  assert.equal(await page.locator(".cycle-person").count(),2);
  assert.match(await page.locator("#cyclePlanNote").innerText(),/plano pago/);
 });
 await run("Apelido com HTML não é executado",async()=>{
  await page.locator("[data-alias]").nth(0).fill("<img src=x onerror=alert(1)>");
  assert.equal(await page.locator(".cycle-person [data-name]").nth(0).textContent(),"<img src=x onerror=alert(1)>");
  assert.equal(await page.locator(".cycle-person [data-name] img").count(),0);
  await page.locator("[data-alias]").nth(0).fill("Ana");
  await page.locator("[data-alias]").nth(1).fill("Bia");
 });
 await run("Prévia de foto aparece no perfil e na revisão",async()=>{
  await page.locator(".cycle-person [data-photo]").first().setInputFiles({name:"avatar.png",mimeType:"image/png",buffer:png});
  await page.locator(".cycle-person .cycle-avatar img").first().waitFor({state:"attached",timeout:4000});
  await page.locator("#nextBtn").click();
  assert.equal(await page.locator('.setup-step[data-step="4"].active').count(),1);
  assert.equal(await page.locator(".cycle-review-person").count(),2);
  assert.equal(await page.locator(".cycle-review-person img").count(),1);
  assert.match(await page.locator("#reviewBox").innerText(),/Bia/);
 });
 await run("Recomeçar zera as escolhas e volta à primeira etapa",async()=>{
  page.once("dialog",dialog=>dialog.accept());await page.locator("#restartSetupBtn").click();
  assert.equal(await page.locator('.setup-step[data-step="1"].active').count(),1);
  assert.equal(await page.locator('.module-option input[value="menstrualCycle"]').isChecked(),false);
  assert.equal(await page.evaluate(()=>window.FluirCycleOnboarding.getState().modo),"later");
  assert.deepEqual(await page.evaluate(()=>window.FluirCycleOnboarding.getState().pessoas),[]);
 });
 await run("Meu próprio ciclo tem campos de duração sem supor identidade",async()=>{
  await reachCycle();
  await page.locator("#cycleMode").selectOption("self");
  await page.locator("#cycleMenstruates").selectOption("sim");
  await page.locator("#cycleDuration").fill("28");
  await page.locator("#cycleBleeding").fill("5");
  await page.locator("#nextBtn").click();
  assert.equal(await page.locator(".cycle-review-person").count(),1);
  assert.match(await page.locator(".cycle-review-person").innerText(),/Meu ciclo/);
 });
 await run("Tema clássico mantém botões pretos e tipografia original",async()=>{
  const bgcolor=await page.locator("#nextBtn").evaluate(el=>getComputedStyle(el).backgroundColor);
  assert.ok(bgcolor==="rgb(22, 22, 22)"||bgcolor==="rgb(23, 23, 23)"||bgcolor==="rgb(26, 26, 26)",bgcolor);
 });
 await run("Nenhuma exceção de script no fluxo desktop",async()=>assert.deepEqual(errors,[]));
 await page.screenshot({path:path.join(__dirname,"evidencia-onboarding-pc.png"),fullPage:true});
 await page.close();
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});
 let mobileErrors=[];mobile.on("pageerror",e=>mobileErrors.push(e.message));
 await mobile.goto(URL,{waitUntil:"domcontentloaded"});
 await run("Largura 390px sem scroll horizontal na abertura",async()=>{
   const dims=await mobile.evaluate(()=>({page:document.documentElement.scrollWidth,screen:innerWidth}));
   assert.ok(dims.page<=dims.screen+1,JSON.stringify(dims));
 });
 await mobile.screenshot({path:path.join(__dirname,"evidencia-onboarding-mobile.png"),fullPage:true});
 await run("Fluxo de duas pessoas também funciona no celular (390px)",async()=>{
   await mobile.locator("#userName").fill("Teste Mobile");
   await mobile.locator("#userNickname").fill("Mobile");
   for(const id of ["sexAtBirth","userPronouns","communicationTone"]){
     const opts=await mobile.locator("#"+id+" option").evaluateAll(options=>options.map(o=>o.value).filter(Boolean));
     await mobile.locator("#"+id).selectOption(opts[0]);
   }
   await mobile.locator("#userAge").fill("21");
   await mobile.locator("#nextBtn").click();
   await mobile.locator('.module-option input[value="menstrualCycle"]').check();
   await mobile.locator("#nextBtn").click();
   await mobile.locator("#cycleMode").selectOption("other");
   await mobile.locator("#cycleCountYes").click();
   assert.equal(await mobile.locator(".cycle-person").count(),2);
   await mobile.locator("[data-alias]").nth(0).fill("Ana");
   await mobile.locator("[data-alias]").nth(1).fill("Bia");
   const dims=await mobile.evaluate(()=>({content:document.documentElement.scrollWidth,window:innerWidth}));
   assert.ok(dims.content<=dims.window+1,JSON.stringify(dims));
   await mobile.screenshot({path:path.join(__dirname,"evidencia-onboarding-mobile-etapa3.png"),fullPage:true});
   await mobile.locator("#nextBtn").click();
   assert.equal(await mobile.locator(".cycle-review-person").count(),2);
 });
 await run("Nenhuma exceção JS em tela móvel",async()=>assert.deepEqual(mobileErrors,[]));
 await run("Falha temporária na API de ciclo não duplica POST do onboarding",async()=>{
   const retry=await browser.newPage({viewport:{width:1200,height:800}});
   await retry.addInitScript(()=>sessionStorage.setItem("fluir-user",
     JSON.stringify({id:3,nome:"Conta de Testes",token:"TOKEN_FICTICIO_QA"})));
   let general=0,cycle=0;
   await retry.route("https://fluir-sistema.onrender.com/api/onboarding/salvar",async route=>{
     general++;await route.fulfill({status:200,contentType:"application/json",body:'{"status":"salvo"}'});
   });
   await retry.route("http://localhost:8080/api/ciclos/configuracao-inicial",async route=>{
     cycle++;await route.fulfill({status:cycle===1?503:200,contentType:"application/json",
       body:cycle===1?'{"erro":"indisponivel"}':'{"status":"salvo"}'});
   });
   await retry.goto(URL,{waitUntil:"domcontentloaded"});
   await retry.locator("#userName").fill("Pessoa de Testes");
   await retry.locator("#userNickname").fill("Teste");
   for(const id of ["sexAtBirth","userPronouns","communicationTone"]){
     const opts=await retry.locator("#"+id+" option").evaluateAll(v=>v.map(o=>o.value).filter(Boolean));
     await retry.locator("#"+id).selectOption(opts[0]);
   }
   await retry.locator("#userAge").fill("22");
   await retry.locator("#nextBtn").click();
   await retry.locator('.module-option input[value="menstrualCycle"]').check();
   await retry.locator("#nextBtn").click();
   await retry.locator("#cycleMode").selectOption("self");
   await retry.locator("#nextBtn").click();
   await retry.locator("#nextBtn").click();
   await retry.locator("#formMessage.show").waitFor({timeout:7000});
   assert.match(await retry.locator("#formMessage").innerText(),/cadastro geral foi salvo/i);
   assert.equal(general,1);assert.equal(cycle,1);
   await retry.locator("#nextBtn").click();
   await retry.waitForURL("**/dashboard.html",{timeout:8000});
   assert.equal(general,1);assert.equal(cycle,2);
   await retry.close();
 });
 await browser.close();
 fs.writeFileSync(path.join(__dirname,"relatorio-browser-qa.txt"),lines.join("\n")+"\n"+passed+" testes aprovados\n");
 console.log("FINAL: "+passed+" testes aprovados");
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
