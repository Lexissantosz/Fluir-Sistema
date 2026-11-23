const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=(()=>{try{return require("playwright")}catch{
 return require(path.join(process.env.TEMP||process.env.TMP,"fluir-browser-qa-2211","node_modules","playwright"));
}})();
const AUTH_URL="http://127.0.0.1:5505/html/setup.html";
const URL=AUTH_URL+"?qa=1";
const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==","base64");
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",args:["--no-sandbox"]});
 let passed=0;const lines=[];const note=x=>{lines.push(x);console.log(x)};
 const run=async(name,fn)=>{try{await fn();passed++;note("PASS "+name)}catch(e){note("FAIL "+name+": "+e.message);throw e}};
 const page=await browser.newPage({viewport:{width:1366,height:768},deviceScaleFactor:1});
 let errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto(URL,{waitUntil:"domcontentloaded"});
 await run("onboarding original preservado com cinco etapas",async()=>{
  assert.match(await page.title(),/Fluir/i);assert.equal(await page.locator(".setup-step").count(),5);
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
 await run("A quantidade é a primeira pergunta; opções individuais ficam condicionais",async()=>{
  assert.equal(await page.locator("#cycleCountBox").isVisible(),true);
  assert.equal(await page.locator("#cycleModeField").isVisible(),false);
  await page.locator("#cycleCountNo").click();
  assert.equal(await page.locator("#cycleModeField").isVisible(),true);
  assert.equal(await page.locator("#cycleMode").inputValue(),"self");
  assert.equal(await page.locator("#cycleMenstruates").inputValue(),"sim");
  await page.locator("#cycleMode").selectOption("other");
  assert.equal(await page.locator(".cycle-person").count(),1);
  assert.equal(await page.locator("#cycleOwn").isVisible(),false);
 });
 await run("Mais de uma pessoa com perfis de terceiros cria duas identificações",async()=>{
  await page.locator("#cycleCountYes").click();
  assert.equal(await page.locator("#cycleMode").inputValue(),"other");
  assert.equal(await page.locator(".cycle-person").count(),2);
  assert.match(await page.locator("#cyclePlanNote").innerText(),/plano gratuito/i);
 });
 await run("Alternar de 'Sim' para 'Não' remove segunda vaga e mantém escolha de terceiro",async()=>{
  await page.locator("#cycleCountNo").click();
  assert.equal(await page.locator(".cycle-person").count(),1);
  assert.equal(await page.locator("#cycleMode").inputValue(),"other");
  await page.locator("#cycleCountYes").click();
  assert.equal(await page.locator(".cycle-person").count(),2);
 });
 await run("Botões de foto são acessíveis e substituem input nativo visível",async()=>{
  const file=page.locator(".cycle-person [data-photo]").first();
  assert.equal(await file.evaluate(el=>getComputedStyle(el).position),"absolute");
  assert.equal(await page.locator(".cycle-person .cycle-upload-button").first().isVisible(),true);
  const associated=await page.locator(".cycle-person .cycle-upload-button").first().getAttribute("for");
  assert.equal(associated,await file.getAttribute("id"));
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
  await page.locator("#nextBtn").click(); // Planos
  assert.equal(await page.locator('.setup-step[data-step="4"].active').count(),1);
  await page.locator("#nextBtn").click(); // Resumo
  assert.equal(await page.locator('.setup-step[data-step="5"].active').count(),1);
  assert.equal(await page.locator(".cycle-review-person").count(),2);
  assert.equal(await page.locator(".cycle-review-person img").count(),1);
  assert.match(await page.locator("#reviewBox").innerText(),/Bia/);
 });
 await run("Recomeçar zera as escolhas e volta à primeira etapa",async()=>{
  page.once("dialog",dialog=>dialog.accept());await page.locator("#restartSetupBtn").click();
  assert.equal(await page.locator('.setup-step[data-step="1"].active').count(),1);
  assert.equal(await page.locator('.module-option input[value="menstrualCycle"]').isChecked(),false);
  assert.equal(await page.evaluate(()=>window.FluirCycleOnboarding.getState().modo),"later");
  assert.equal(await page.evaluate(()=>window.FluirCycleOnboarding.getState().multi),"later");
  assert.deepEqual(await page.evaluate(()=>window.FluirCycleOnboarding.getState().pessoas),[]);
 });
 await run("Meu próprio ciclo preenche Sim e esconde períodos quando seleciono Não",async()=>{
  await reachCycle();
  await page.locator("#cycleCountNo").click();
  assert.equal(await page.locator("#cycleMode").inputValue(),"self");
  assert.equal(await page.locator("#cycleMenstruates").inputValue(),"sim");
  await page.locator("#cycleDuration").fill("28");
  await page.locator("#cycleBleeding").fill("5");
  await page.locator("#cycleMenstruates").selectOption("nao");
  assert.equal(await page.locator("#cycleOwnMenstrualFields").isVisible(),false);
  assert.equal(await page.locator("#cycleDuration").inputValue(),"");
  assert.equal(await page.locator("#cycleBleeding").inputValue(),"");
  const legacy=await page.evaluate(()=>window.FluirCycleOnboarding.legacy());
  assert.equal(legacy.currentlyMenstruates,"nao");
  assert.equal(legacy.cycleLength,"");
  assert.equal(legacy.bleedingLength,"");
  assert.equal(await page.locator("#cycleOwnNoPeriodNote").isVisible(),true);
  await page.locator("#nextBtn").click(); // Planos
  await page.locator("#nextBtn").click(); // Resumo
  assert.equal(await page.locator(".cycle-review-person").count(),1);
  assert.match(await page.locator(".cycle-review-person").innerText(),/Meu ciclo/);
 });
 await run("Meu ciclo e outras pessoas predefine Sim sem repetir a pergunta",async()=>{
  await page.locator("#backBtn").click(); // Planos
  await page.locator("#backBtn").click(); // Preferências
  await page.locator("#cycleCountYes").click();
  assert.equal(await page.locator("#cycleMode").inputValue(),"both");
  assert.equal(await page.locator("#cycleMenstruationQuestion").isVisible(),false);
  assert.equal(await page.evaluate(()=>window.FluirCycleOnboarding.getState().menstrua),"sim");
  assert.equal(await page.locator("#cycleOwnMenstrualFields").isVisible(),true);
  assert.equal(await page.locator(".cycle-person").count(),1);
  await page.locator("[data-alias]").fill("Ana");
  await page.locator("#nextBtn").click(); // Planos
  await page.locator("#nextBtn").click(); // Resumo
  assert.equal(await page.locator(".cycle-review-person").count(),2);
 });
 await run("Agora não oculta perfis e campos sensíveis",async()=>{
  await page.locator("#backBtn").click(); // Planos
  await page.locator("#backBtn").click(); // Preferências
  await page.locator("#cycleCountLater").click();
  assert.equal(await page.locator("#cycleModeField").isVisible(),false);
  assert.equal(await page.locator("#cycleOwn").isVisible(),false);
  assert.equal(await page.locator("#cycleOthers").isVisible(),false);
  assert.equal(await page.evaluate(()=>window.FluirCycleOnboarding.getState().modo),"later");
  await page.locator("#nextBtn").click(); // Planos
  await page.locator("#nextBtn").click(); // Resumo
 });
 await run("Tema clássico mantém botões pretos e tipografia original",async()=>{
  const bgcolor=await page.locator("#nextBtn").evaluate(el=>getComputedStyle(el).backgroundColor);
  assert.ok(bgcolor==="rgb(22, 22, 22)"||bgcolor==="rgb(23, 23, 23)"||bgcolor==="rgb(26, 26, 26)",bgcolor);
 });
 await run("Nenhuma exceção de script no fluxo desktop",async()=>assert.deepEqual(errors,[]));
 await page.screenshot({path:path.join(__dirname,"evidencia-onboarding-pc.png"),fullPage:true});
 await run("Prévia local QA finaliza sem salvar e sem usar token fictício",async()=>{
   let outbound=0;
   page.on("request",req=>{
     if(req.url().startsWith("https://fluir-sistema.onrender.com/"))outbound++;
   });
   await page.locator("#nextBtn").click();
   assert.match(await page.locator("#formMessage").innerText(),/Simulação concluída/);
   assert.equal(outbound,0);
   assert.equal(await page.evaluate(()=>localStorage.getItem("fluir-setup")),null);
 });
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
   await mobile.locator("#cycleCountYes").click();
   await mobile.locator("#cycleMode").selectOption("other");
   assert.equal(await mobile.locator(".cycle-person").count(),2);
   await mobile.locator("[data-alias]").nth(0).fill("Ana");
   await mobile.locator("[data-alias]").nth(1).fill("Bia");
   const dims=await mobile.evaluate(()=>({content:document.documentElement.scrollWidth,window:innerWidth}));
   assert.ok(dims.content<=dims.window+1,JSON.stringify(dims));
   await mobile.screenshot({path:path.join(__dirname,"evidencia-onboarding-mobile-etapa3.png"),fullPage:true});
   await mobile.locator("#nextBtn").click(); // Planos
   await mobile.locator("#nextBtn").click(); // Resumo
   assert.equal(await mobile.locator(".cycle-review-person").count(),2);
 });
 await run("Nenhuma exceção JS em tela móvel",async()=>assert.deepEqual(mobileErrors,[]));
 await run("Falha temporária na API de ciclo não duplica POST do onboarding",async()=>{
   const retry=await browser.newPage({viewport:{width:1200,height:800}});
   await retry.addInitScript(()=>sessionStorage.setItem("fluir-user",
     JSON.stringify({id:3,nome:"Conta de Testes",token:"TOKEN_FICTICIO_QA_SEM_CREDENCIAL_123456789"})));
   let general=0,cycle=0,plan=0;
   await retry.route("http://localhost:8080/api/planos/interesse",async route=>{
     plan++;await route.fulfill({status:200,contentType:"application/json",body:'{"status":"salvo"}'});
   });
   await retry.route("https://fluir-sistema.onrender.com/api/onboarding/salvar",async route=>{
     general++;await route.fulfill({status:200,contentType:"application/json",body:'{"status":"salvo"}'});
   });
   await retry.route("http://localhost:8080/api/ciclos/configuracao-inicial",async route=>{
     cycle++;await route.fulfill({status:cycle===1?503:200,contentType:"application/json",
       body:cycle===1?'{"erro":"indisponivel"}':'{"status":"salvo"}'});
   });
   await retry.goto(AUTH_URL,{waitUntil:"domcontentloaded"});
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
   await retry.locator("#cycleCountNo").click();
   await retry.locator("#cycleMode").selectOption("self");
   await retry.locator("#nextBtn").click(); // Planos
   await retry.locator("#nextBtn").click(); // Resumo
   await retry.locator("#nextBtn").click(); // Salvar
   await retry.locator("#formMessage.show").waitFor({timeout:7000});
   assert.match(await retry.locator("#formMessage").innerText(),/cadastro geral foi salvo/i);
   assert.equal(general,1);assert.equal(cycle,1);
   await retry.locator("#nextBtn").click();
   await retry.waitForURL("**/dashboard.html",{timeout:8000});
   assert.equal(general,1);assert.equal(cycle,2);assert.equal(plan,1);
   await retry.close();
 });
 await run("Sem login no mesmo endereço: informar ausência de sessão antes do formulário",async()=>{
   const unauth=await browser.newPage({viewport:{width:1200,height:800}});
   await unauth.goto(AUTH_URL,{waitUntil:"domcontentloaded"});
   assert.equal(await unauth.locator("#setupForm").evaluate(el=>el.inert),true);
   assert.match(await unauth.locator("#setupSessionNotice").innerText(),/não significa que sua sessão expirou/i);
   assert.equal(await unauth.locator('a[href="setup.html?qa=1"]').count(),1);
   await unauth.close();
 });
 await run("401 real no backend é apresentado como sessão expirada",async()=>{
   const reject=await browser.newPage({viewport:{width:1200,height:800}});
   await reject.addInitScript(()=>sessionStorage.setItem("fluir-user",
     JSON.stringify({id:3,nome:"Conta de Testes",token:"TOKEN_FICTICIO_QA_SEM_CREDENCIAL_123456789"})));
   let calls=0;
   await reject.route("https://fluir-sistema.onrender.com/api/onboarding/salvar",async route=>{
     calls++;await route.fulfill({status:401,contentType:"application/json",
       body:'{"mensagem":"Sessão ausente ou expirada."}'});
   });
   await reject.goto(AUTH_URL,{waitUntil:"domcontentloaded"});
   await reject.locator("#userName").fill("QA Sessão");
   await reject.locator("#userNickname").fill("QA");
   for(const id of ["sexAtBirth","userPronouns","communicationTone"]){
     const opts=await reject.locator("#"+id+" option").evaluateAll(v=>v.map(o=>o.value).filter(Boolean));
     await reject.locator("#"+id).selectOption(opts[0]);
   }
   await reject.locator("#userAge").fill("22");
   await reject.locator("#nextBtn").click();
   await reject.locator('.module-option input[value="menstrualCycle"]').check();
   await reject.locator("#nextBtn").click();
   await reject.locator("#nextBtn").click(); // Planos
   await reject.locator("#nextBtn").click(); // Resumo
   await reject.locator("#nextBtn").click(); // Salvar
   await reject.locator("#formMessage.show").waitFor({timeout:7000});
   assert.equal(calls,1);
   assert.match(await reject.locator("#formMessage").innerText(),/Sua sessão de 12 horas terminou/);
   await reject.close();
 });
 await browser.close();
 fs.writeFileSync(path.join(__dirname,"relatorio-browser-qa.txt"),lines.join("\n")+"\n"+passed+" testes aprovados\n");
 console.log("FINAL: "+passed+" testes aprovados");
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
