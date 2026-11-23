"use strict";
const assert=require("node:assert/strict");
const {chromium}=require("playwright");
const BASE="http://127.0.0.1:5500";
const API="https://fluir-sistema.onrender.com/api/assistente/chat";
const token="QA_FAKE_TOKEN_FOR_UI_TEST_ONLY_0123456789";
(async()=>{
 let passed=0;
 const check=async(label,fn)=>{await fn();passed++;console.log("PASS",label)};
 const browser=await chromium.launch({headless:true});
 try{
  const demo=await browser.newPage({viewport:{width:1280,height:800}});
  let externalCalls=0;
  await demo.goto(BASE+"/html/login.html");
  await demo.route("**/api/assistente/**",route=>{externalCalls++;return route.abort()});
  await demo.getByRole("link",{name:/Explorar demonstração/i}).click();
  await check("Demonstração não solicita onboarding",async()=>{
    await demo.waitForURL("**/html/demo.html");
    assert.equal(await demo.locator("body").getAttribute("data-fluir-demo"),"true");
    assert.equal(await demo.locator("#demoHeading").innerText(),"Olá, visitante");
    assert.equal(await demo.evaluate(()=>sessionStorage.getItem("fluir-user")),null);
  });
  await demo.locator('.demo-sidebar [data-demo-view="tasks"]').click();
  await check("Navegação demo muda módulos sem criar conta",async()=>{
    assert.equal(await demo.locator("#demoHeading").innerText(),"Tarefas");
    assert.equal(externalCalls,0);
    assert.equal(await demo.evaluate(()=>localStorage.getItem("fluir-setup")),null);
  });
  await demo.locator("#fluirAssistantButton").click();
  await demo.locator('.fluir-assistant-form textarea').fill("Como posso organizar estudos?");
  await demo.locator(".fluir-assistant-consent input").check();
  await demo.locator(".fluir-assistant-send").click();
  await check("Assistente da demonstração é claramente simulado e offline",async()=>{
    assert.match(await demo.locator(".fluir-assistant-messages").innerText(),/Exemplo ilustrativo/i);
    assert.equal(externalCalls,0);
    assert.equal(await demo.locator("#fluirAssistantWindow").isVisible(),true);
  });
  await demo.reload();
  await check("Demonstração não salva dados fictícios",async()=>{
    assert.equal(await demo.locator("#demoHeading").innerText(),"Olá, visitante");
    assert.equal(await demo.evaluate(()=>localStorage.getItem("fluir-mvp-state-v1")),null);
  });
  await demo.close();

  const user=await browser.newPage({viewport:{width:1180,height:850}});
  await user.addInitScript(t=>{
    sessionStorage.setItem("fluir-user",JSON.stringify({id:901,nome:"QA",email:"qa@example.invalid",token:t}));
    sessionStorage.setItem("fluir-onboarding-completed","true");
  },token);
  let posts=0;
  let serverStatus=200;
  let serverText="Resposta Gemini simulada APENAS PELO TESTE DE UI";
  await user.route(API,async route=>{
    const request=route.request();
    const headers={"access-control-allow-origin":BASE,"access-control-allow-headers":"content-type,authorization","access-control-allow-methods":"POST,OPTIONS"};
    if(request.method()==="OPTIONS")return route.fulfill({status:204,headers});
    posts++;
    assert.equal(request.headers().authorization,"Bearer "+token);
    assert.equal(request.postDataJSON().mensagem,"Organize minha rotina hoje");
    return route.fulfill({status:serverStatus,contentType:"application/json",headers,
      body:JSON.stringify(serverStatus===200?{resposta:serverText,geradoPorIA:true}:{mensagem:"Provedor indisponível em QA"})});
  });
  await user.goto(BASE+"/html/dashboard.html",{waitUntil:"domcontentloaded"});
  await check("Dashboard autenticado carrega FAB real",async()=>{
    assert.equal(await user.locator("#fluirAssistantButton").count(),1);
    assert.equal(await user.locator("#fluirAssistantWindow").isVisible(),false);
    assert.equal(await user.evaluate(()=>window.FluirAssistant?.isDemo),false);
  });
  await user.locator("#fluirAssistantButton").click();
  await user.locator(".fluir-assistant-form textarea").fill("Organize minha rotina hoje");
  await user.locator(".fluir-assistant-send").click();
  await check("Não envia mensagem sem consentimento",async()=>{assert.equal(posts,0)});
  await user.locator(".fluir-assistant-consent input").check();
  await user.locator(".fluir-assistant-send").click();
  await user.getByText("Resposta Gemini simulada APENAS PELO TESTE DE UI").waitFor();
  await check("Assistente autenticado chama rota correta com Bearer, sem expor token",async()=>{
    assert.equal(posts,1);
    assert.equal(await user.locator(".fluir-assistant-consent input").isChecked(),false);
    assert.equal(await user.locator(".fluir-assistant-messages").innerText().then(s=>s.includes(token)),false);
  });
  serverStatus=503;
  await user.locator(".fluir-assistant-form textarea").fill("Organize minha rotina hoje");
  await user.locator(".fluir-assistant-consent input").check();
  await user.locator(".fluir-assistant-send").click();
  await user.getByText("Provedor indisponível em QA").waitFor();
  await check("Falha do provedor não destrói sessão e restaura envio",async()=>{
    assert.equal(posts,2);
    assert.equal(await user.locator(".fluir-assistant-send").isEnabled(),true);
    assert.equal(await user.evaluate(()=>JSON.parse(sessionStorage.getItem("fluir-user")).id),901);
  });
  await user.close();
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
  await mobile.goto(BASE+"/html/demo.html");
  await mobile.locator("#fluirAssistantButton").click();
  await check("Assistente é responsivo em 390px",async()=>{
    const dimensions=await mobile.locator("#fluirAssistantWindow").evaluate(el=>{
      const rect=el.getBoundingClientRect();
      return {left:rect.left,right:rect.right,visible:rect.height>0,width:window.innerWidth};
    });
    assert.ok(dimensions.left>=0&&dimensions.right<=dimensions.width+1,JSON.stringify(dimensions));
    assert.ok(dimensions.visible);
  });
  await mobile.close();
  console.log("TOTAL",passed,"TESTES DE UI");
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
