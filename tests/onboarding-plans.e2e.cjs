const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=(()=>{try{return require("playwright")}catch{
 return require(path.join(process.env.TEMP||process.env.TMP,"fluir-browser-qa-2211","node_modules","playwright"));
}})();
const URL="http://127.0.0.1:5505/html/setup.html?qa=1";
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",args:["--no-sandbox"]});
 const results=[];
 const check=async(title,cb)=>{
  try{await cb();results.push("PASS "+title);console.log("PASS "+title);}
  catch(e){results.push("FAIL "+title+": "+e.message);throw e;}
 };
 async function stepThree(page,modules){
   await page.goto(URL,{waitUntil:"domcontentloaded"});
   await page.locator("#userName").fill("QA Planos");
   await page.locator("#userNickname").fill("QA");
   for(const id of ["sexAtBirth","userPronouns","communicationTone"]){
     const valid=await page.locator("#"+id+" option").evaluateAll(ops=>ops.map(o=>o.value).filter(Boolean));
     await page.locator("#"+id).selectOption(valid[0]);
   }
   await page.locator("#userAge").fill("22");
   await page.locator("#nextBtn").click();
   const step=await page.locator(".setup-step.active").getAttribute("data-step");
   if(step!=="2")throw new Error("Etapa 1 bloqueada: "+await page.locator("#formMessage").innerText()+" (etapa "+step+")");
   for(const m of modules)await page.locator('.module-option input[value="'+m+'"]').check();
   await page.locator("#nextBtn").click();
 }
 const pc=await browser.newPage({viewport:{width:1366,height:768}});
 let errors=[];pc.on("pageerror",e=>errors.push(e.message));
 await stepThree(pc,["finances","diary"]);
 await pc.locator("#nextBtn").click();
 await pc.locator("#planSuggestedName").waitFor({state:"visible"});
 await pc.waitForTimeout(350); // aguarda a animação de entrada antes da evidência
 await pc.screenshot({path:path.join(__dirname,"evidencia-planos-pc.png"),fullPage:false});
 await check("Onboarding possui cinco etapas, planos antes do resumo",async()=>{
   assert.equal(await pc.locator(".setup-step").count(),5);
   assert.equal(await pc.locator('.setup-step[data-step="4"].active').count(),1);
   assert.equal(await pc.locator("#stepLabel").innerText(),"Etapa 4 de 5");
   assert.equal(await pc.locator("#planSuggestedName").innerText(),"Pessoal");
 });
 await check("Duas escolhas do Pessoal sugerem Pessoal",async()=>{
   const snap=await pc.evaluate(()=>window.FluirPlansOnboarding.snapshot());
   assert.equal(snap.counts.personal,2);
   assert.equal(snap.counts.complete,0);
   assert.equal(snap.suggestedPlan,"personal");
 });
 await check("Sem seleção premium, outros planos ficam recolhidos",async()=>{
   assert.equal(await pc.locator("#planExplore").evaluate(e=>e.open),false);
   assert.equal(await pc.locator("#planComparison").evaluate(e=>e.open),false);
 });
 await pc.locator("#planExplore summary").click();
 await pc.locator('[data-add-feature="ai.insights"]').click();
 await check("Duas escolhas Pessoal + uma Completo recomendam Completo",async()=>{
   const snap=await pc.evaluate(()=>window.FluirPlansOnboarding.snapshot());
   assert.equal(snap.counts.personal,2);
   assert.equal(snap.counts.complete,1);
   assert.equal(snap.suggestedPlan,"complete");
   assert.equal(await pc.locator("#planSuggestedPrice").innerText(),"R$ 39,90/mês");
 });
 await pc.locator('[data-interest="interested"]').click();
 await pc.locator('[data-remove-feature="ai.insights"]').click();
 await check("Remover premium rebaixa para Pessoal sem presumir interesse em outro plano",async()=>{
   const snap=await pc.evaluate(()=>window.FluirPlansOnboarding.snapshot());
   assert.equal(snap.suggestedPlan,"personal");
   assert.equal(snap.counts.personal,2);
   assert.equal(snap.counts.complete,0);
   assert.equal(snap.interest,"later");
 });
 await pc.locator('[data-interest="interested"]').click();
 await check("Interesse selecionado não cria cobrança",async()=>{
   assert.equal((await pc.evaluate(()=>window.FluirPlansOnboarding.snapshot())).interest,"interested");
   assert.match(await pc.locator("#planSelectionNotice").innerText(),/Nenhum pagamento/);
 });
 await pc.locator('[data-remove-feature="finance.basic"]').click();
 await check("Retirar finanças não remove diário",async()=>{
   assert.equal((await pc.evaluate(()=>window.FluirPlansOnboarding.snapshot())).counts.personal,1);
   assert.equal(await pc.locator('.module-option input[value="finances"]').isChecked(),false);
   assert.equal(await pc.locator('.module-option input[value="diary"]').isChecked(),true);
 });
 await pc.locator('[data-remove-feature="diary.full"]').click();
 await check("Sem escolha paga, recomenda Gratuito e retira interesse",async()=>{
   const snap=await pc.evaluate(()=>window.FluirPlansOnboarding.snapshot());
   assert.equal(snap.suggestedPlan,"free");
   assert.equal(snap.interest,"later");
   assert.equal(snap.selectedFeatures.length,0);
   assert.equal(await pc.locator("#planSuggestedPrice").innerText(),"R$ 0/mês");
 });
 await pc.locator("#planComparison summary").click();
 await check("Todos os preços de referência correspondem à página de planos",async()=>{
   const str=await pc.locator("#planCards").innerText();
   for(const price of ["R$ 0/mês","R$ 19,90/mês","R$ 39,90/mês"])assert.ok(str.includes(price),price);
 });
 await pc.locator("#nextBtn").click();
 await check("Resumo final mostra indicação gratuita",async()=>{
   assert.equal(await pc.locator('.setup-step[data-step="5"].active').count(),1);
   assert.match(await pc.locator("#reviewBox").innerText(),/Plano indicado: Gratuito/);
 });
 await pc.screenshot({path:path.join(__dirname,"evidencia-planos-resumo.png"),fullPage:true});
 await pc.locator("#backBtn").click();
 if(!(await pc.locator("#planExplore").evaluate(e=>e.open)))
   await pc.locator("#planExplore summary").click();
 await pc.locator('[data-add-feature="reports.simple"]').click();
 await pc.locator('[data-add-feature="ai.insights"]').click();
 await pc.locator("#planSelectedList").screenshot({path:path.join(__dirname,"evidencia-planos-lista.png")});
 await check("Escolhas continuam após voltar do resumo",async()=>{
   assert.equal((await pc.evaluate(()=>window.FluirPlansOnboarding.snapshot())).suggestedPlan,"complete");
 });
 pc.once("dialog",dialog=>dialog.accept());
 await pc.locator("#planRemoveAll").click();
 await check("Retirar tudo faz downgrade gratuito sem manter extras selecionados",async()=>{
   const snap=await pc.evaluate(()=>window.FluirPlansOnboarding.snapshot());
   assert.equal(snap.suggestedPlan,"free");
   assert.equal(snap.selectedFeatures.length,0);
   assert.equal(await pc.locator('.module-option input[value="finances"]').isChecked(),false);
   assert.equal(await pc.locator('.module-option input[value="diary"]').isChecked(),false);
 });
 await check("Telas não executam script estranho",async()=>assert.deepEqual(errors,[]));
 await pc.close();

 const cycle=await browser.newPage({viewport:{width:1200,height:800}});
 await stepThree(cycle,["menstrualCycle"]);
 await cycle.locator("#cycleCountYes").click();
 await cycle.locator("#cycleMode").selectOption("other");
 await cycle.locator("[data-alias]").nth(0).fill("Ana");
 await cycle.locator("[data-alias]").nth(1).fill("Bia");
 await cycle.locator("#nextBtn").click();
 await check("Segundo perfil de terceiro aparece como vaga adicional paga",async()=>{
   const snap=await cycle.evaluate(()=>window.FluirPlansOnboarding.snapshot());
   assert.equal(snap.suggestedPlan,"personal");
   assert.equal(snap.counts.personal,1);
   assert.ok(snap.selectedFeatures.includes("cycle.extra.1"));
 });
 await cycle.locator('[data-remove-feature="cycle.extra.1"]').click();
 await check("Remover vaga extra conserva uma pessoa gratuita",async()=>{
   assert.equal((await cycle.evaluate(()=>window.FluirCycleOnboarding.getState().pessoas)).length,1);
   const snap=await cycle.evaluate(()=>window.FluirPlansOnboarding.snapshot());
   assert.equal(snap.suggestedPlan,"free");
 });
 await cycle.close();

 const free=await browser.newPage({viewport:{width:1200,height:800}});
 await stepThree(free,[]);
 await free.locator("#nextBtn").click();
 await check("Sem selecionar módulos pagos: o fluxo continua gratuito, sem insistência comercial",async()=>{
   assert.equal(await free.locator("#planSuggestedName").innerText(),"Gratuito");
   assert.equal(await free.locator("#planExplore").evaluate(e=>e.open),false);
   assert.equal(await free.locator("#planComparison").evaluate(e=>e.open),false);
   assert.equal(await free.locator('[data-interest="interested"]').count(),0);
 });
 await free.close();
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});
 await stepThree(mobile,["finances","diary"]);
 await mobile.locator("#nextBtn").click();
 await mobile.screenshot({path:path.join(__dirname,"evidencia-planos-mobile.png"),fullPage:true});
 await check("Tela de planos sem deslocamento horizontal em 390px",async()=>{
   const dim=await mobile.evaluate(()=>{
     const wrapper=document.querySelector(".setup-page").getBoundingClientRect();
     const card=document.querySelector(".setup-card").getBoundingClientRect();
     return {scrollWidth:document.documentElement.scrollWidth,width:innerWidth,
       scrollX:window.scrollX,wrapperLeft:wrapper.left,wrapperRight:wrapper.right,
       cardLeft:card.left,cardRight:card.right};
   });
   console.log("MOBILE_DIM",JSON.stringify(dim));
   assert.ok(dim.scrollWidth<=dim.width+1,JSON.stringify(dim));
   assert.equal(dim.scrollX,0,JSON.stringify(dim));
   assert.ok(dim.wrapperLeft>=-2 && dim.wrapperRight<=dim.width+2,JSON.stringify(dim));
   assert.ok(dim.cardLeft>=-2 && dim.cardRight<=dim.width+2,JSON.stringify(dim));
   assert.equal(await mobile.locator("#planSuggestedName").innerText(),"Pessoal");
 });
 await mobile.close();
 await browser.close();
 fs.writeFileSync(path.join(__dirname,"relatorio-planos-qa.txt"),results.join("\n")+"\n"+results.length+" cenários aprovados\n");
 console.log("FINAL",results.length);
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
