"use strict";
const { chromium } = require("playwright");
const BASE=process.env.FLUIR_WEB_BASE || "http://127.0.0.1:5500/html/";
(async()=>{
 const browser=await chromium.launch({channel:"chrome",headless:true});
 let passed=0,failed=0;
 const run=async(name,fn)=>{
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  await ctx.addInitScript(()=>{
   const setup={user:{id:998,name:"QA",nickname:"QA",email:"qa@example.invalid"},usuarioId:998,onboardingConcluido:true,
      modules:{tasks:true,habits:true,water:true,menstrualCycle:true,finances:true,attachments:true,diary:true},
      preferences:{water:{dailyGoal:2000}}};
   localStorage.setItem("fluir:account:"+setup.usuarioId+":fluir-setup",JSON.stringify(setup));
   sessionStorage.setItem("fluir-user",JSON.stringify({id:998,token:"local_qa_token_01234567890123456"}));
   sessionStorage.setItem("fluir-onboarding-completed","true");
  });
  const page=await ctx.newPage();
  await page.route("https://fluir-sistema.onrender.com/**",r=>r.fulfill({
    status:200,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},body:"[]"}));
  try{await fn(page);console.log("PASS: "+name);passed++}
  catch(e){console.error("FAIL: "+name+" | "+e.message);failed++}
  finally{await ctx.close()}
 };
 try{
  await run("Dashboard com links reais",async p=>{
   await p.goto(BASE+"dashboard.html");
   if(await p.locator('a[href="tasks.html?novo=1"]').count()!==1)throw Error("Nova tarefa sem link");
   if(await p.locator('.recent-events a[href="timeline.html"]').count()!==1)throw Error("Eventos sem link");
   if(await p.locator('.habits-panel a[href="habits.html"]').count()!==1)throw Error("Hábitos sem link");
  });
  await run("Dashboard abre modal real de nova tarefa",async p=>{
   await p.goto(BASE+"tasks.html?novo=1");
   await p.locator("#taskModal.active").waitFor({timeout:12000});
  });
  await run("Ciclo mostra campos coerentes por tipo",async p=>{
   await p.goto(BASE+"menstrual-cycle.html");
   await p.locator("#newCycleBtn").click();
   await p.selectOption("#cycleTypeSelect","mood");
   if(await p.locator("#cycleIntensityField").isVisible())throw Error("Fluxo no humor");
   if(!await p.locator("#cyclePresetField").isVisible())throw Error("Sem humor");
   await p.selectOption("#cycleTypeSelect","symptom");
   if(await p.locator("#cycleIntensityField").isVisible())throw Error("Fluxo em sintoma");
   await p.selectOption("#cycleTypeSelect","period");
   if(!await p.locator("#cycleIntensityField").isVisible())throw Error("Sem fluxo em menstruação");
  });
  await run("Configurações uma coluna e drawer após scroll",async p=>{
   await p.goto(BASE+"settings.html");
   const cols=await p.locator(".settings-grid").first().evaluate(e=>getComputedStyle(e).gridTemplateColumns);
   if(cols.split(" ").length>1)throw Error("Mais de uma coluna: "+cols);
   await p.locator(".mobile-menu-btn").click();
   await p.waitForTimeout(500);
   await p.locator(".mobile-drawer").evaluate(el=>{el.scrollTop=el.scrollHeight;});
   await p.waitForTimeout(130);
   const b=await p.locator(".mobile-drawer").boundingBox();
   if(!b||b.x<0||b.x+b.width>391)throw Error("Drawer fora da largura: "+JSON.stringify(b));
   if(!await p.locator("body.mobile-drawer-open").count())throw Error("Drawer fechado sozinho");
   await p.locator(".mobile-drawer-close").click();
   if(await p.locator("body.mobile-drawer-open").count())throw Error("Drawer não fecha");
  });
  for(const [name,btn,overlay,box] of [
   ["attachments.html","#newAttachmentBtn","#attachmentModal",".attachment-modal"],
   ["finances.html","#newTransactionBtn","#financeModal",".finance-modal"]
  ]){
   await run(name+" com modal rolável",async p=>{
    await p.goto(BASE+name);
    await p.locator(btn).click();
    await p.locator(overlay+".active").waitFor({timeout:6000});
    const b=await p.locator(box).boundingBox();
    if(!b||b.y<0||b.y+b.height>855)throw Error("Modal fora da tela: "+JSON.stringify(b));
    const overflow=await p.locator(box).evaluate(e=>getComputedStyle(e).overflowY);
    if(overflow!=="auto")throw Error("Modal sem rolagem própria");
    if(!await p.locator("body.mobile-modal-open").count())throw Error("Fundo não travado");
   });
  }
  await run("IA aparece acima da navegação no telefone",async p=>{
   await p.goto(BASE+"dashboard.html");
   const fab=p.locator("#fluirAssistantButton");
   await fab.waitFor();
   if(!await fab.isVisible())throw Error("FAB de IA oculto");
   const b=await fab.boundingBox();
   if(!b||b.y+b.height>758)throw Error("IA sobre barra de navegação");
  });
  await run("Demonstração informa bloqueio sem criar tarefa",async p=>{
   await p.goto(BASE+"demo.html");
   await p.getByRole("button",{name:"Nova tarefa"}).first().click();
   await p.locator("#demoTaskPreview").waitFor();
   if(await p.locator("#fluirDemoGate").count())throw Error("Demo bloqueou antes de salvar");
   await p.locator("#demoTaskForm input[name=title]").fill("QA tarefa");
   await p.getByRole("button",{name:"Salvar tarefa",exact:true}).click();
   await p.locator("#fluirDemoGate").waitFor();
   if(!await p.locator("#fluirDemoGate").getByText("Apenas demonstração").isVisible())throw Error("Aviso não aparece");
   if(await p.evaluate(()=>localStorage.getItem("fluir-dashboard-demo-tasks"))!==null)throw Error("Demo gravou tarefa");
  });
  for(const name of ["finances.html","attachments.html"]){
   await run("Hoje filtra "+name,async p=>{
    await p.goto(BASE+name);
    await p.locator(".date-btn").click();
    if(!await p.locator('.filter-btn[data-filter="today"]').evaluate(el=>el.classList.contains("active")))throw Error("Hoje não ativa filtro");
   });
  }
  await run("Sono alterna registros de hoje e visão completa",async p=>{
   await p.goto(BASE+"sleep.html");
   const period=p.locator("#sleepPeriodBtn");
   await period.click();
   if(await period.getAttribute("aria-pressed")!=="true")throw Error("Modo hoje não ativado");
   await period.click();
   if(await period.getAttribute("aria-pressed")!=="false")throw Error("Modo semana não restaurado");
  });
  await run("Hábitos filtram pendentes hoje e retornam",async p=>{
   await p.goto(BASE+"habits.html");
   const period=p.locator("#habitsPeriodBtn");
   await period.click();
   if(await p.locator('.filter-btn[data-filter="pending"]').getAttribute("class").then(x=>x.includes("active"))!==true)throw Error("Pendentes hoje não ativados");
   await period.click();
   if(!await p.locator('.filter-btn[data-filter="all"]').evaluate(el=>el.classList.contains("active")))throw Error("Filtro original não restaurado");
  });
  await run("Água foca os registros do dia",async p=>{
   await p.goto(BASE+"water.html");
   await p.locator("#waterTodayBtn").click();
   if(!await p.locator(".water-summary").evaluate(el=>el.classList.contains("fluir-today-focus")))throw Error("Resumo de hoje não destacado");
  });
  await run("Timeline mostra somente eventos reais da data de hoje",async p=>{
   await p.goto(BASE+"timeline.html");
   await p.locator("#timelinePeriodBtn").click();
   if(await p.locator("#timelinePeriodBtn").getAttribute("aria-pressed")!=="true")throw Error("Hoje não ativado");
   if(await p.locator('.timeline-day:not(.user-created-day):visible').count()>0)throw Error("Evento ilustrativo mostrado como hoje");
   if(!await p.locator(".fluir-today-empty").isVisible())throw Error("Sem aviso para dia vazio");
   await p.locator("#timelinePeriodBtn").click();
   if(await p.locator(".fluir-today-empty").isVisible())throw Error("Aviso não desaparece após restauração");
  });
  for(const viewport of [320,430]){
   await run("Modais móveis em "+viewport+"px sem corte horizontal",async p=>{
    await p.setViewportSize({width:viewport,height:760});
    await p.goto(BASE+"finances.html");
    await p.locator("#newTransactionBtn").click();
    await p.locator("#financeModal.active").waitFor();
    const box=await p.locator(".finance-modal").boundingBox();
    if(!box||box.x<0||box.x+box.width>viewport+1)throw Error("Modal fora da tela em "+viewport+"px: "+JSON.stringify(box));
    const pos=await p.locator(".finance-modal").evaluate(el=>({scroll:el.scrollHeight,client:el.clientHeight}));
    if(pos.scroll<=pos.client)throw Error("Formulário não apresenta rolagem interna em "+viewport+"px");
   });
  }
  console.log("QA WEB ANDROID: "+passed+" APROVADOS / "+failed+" FALHAS");
  if(failed)process.exitCode=1;
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
