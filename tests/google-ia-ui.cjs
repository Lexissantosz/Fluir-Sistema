"use strict";
const { chromium } = require("playwright");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname,"..");
const MIME = {".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".png":"image/png"};
const server = http.createServer((req,res)=>{
  const filepath = path.resolve(root,"."+decodeURI(new URL(req.url,"http://localhost").pathname));
  if(!filepath.startsWith(root+path.sep) || !fs.existsSync(filepath) || fs.statSync(filepath).isDirectory()){
    res.writeHead(404);res.end("Not found");return;
  }
  res.writeHead(200,{"Content-Type":MIME[path.extname(filepath)]||"application/octet-stream"});
  fs.createReadStream(filepath).pipe(res);
});
const api = "https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api";
const googleMock =
  "window.google={accounts:{id:{initialize(opts){window.__googleCallback=opts.callback},"+
  "renderButton(mount,opts){const b=document.createElement('button');b.textContent='Google QA';b.dataset.googleText=opts.text;b.style.width=opts.width+'px';mount.append(b);}}}};";
async function routeGoogle(page,enabled){
  await page.route(api+"/usuarios/google/config",route=>route.fulfill({
    status:200,contentType:"application/json",body:JSON.stringify({
      habilitado:enabled,clientId:enabled?"12345-test.apps.googleusercontent.com":""
    })
  }));
  await page.route("https://accounts.google.com/gsi/client",route=>route.fulfill({
    status:200,contentType:"text/javascript",body:googleMock
  }));
}
(async()=>{
  await new Promise(resolve=>server.listen(5509,"127.0.0.1",resolve));
  const browser=await chromium.launch({channel:"chrome",headless:true});
  try{
    const url="http://127.0.0.1:5509";
    let page=await browser.newPage();
    await routeGoogle(page,false);
    await page.goto(url+"/html/login.html",{waitUntil:"domcontentloaded"});
    await page.waitForTimeout(350);
    assert.equal(await page.locator("#googleLoginMount").isVisible(),false);
    assert.equal(await page.locator("#googleRegisterMount").isVisible(),false);
    console.log("PASS: Google oculto quando não configurado");
    await page.close();

    page=await browser.newPage();
    await routeGoogle(page,true);
    await page.route(api+"/usuarios/google",route=>route.fulfill({
      status:401,contentType:"application/json",body:JSON.stringify({mensagem:"Token Google inválido"})
    }));
    await page.goto(url+"/html/login.html",{waitUntil:"domcontentloaded"});
    await page.locator("#googleLoginMount button").waitFor();
    assert.equal(await page.locator("#googleRegisterMount button").count(),1);
    assert.equal(await page.locator("#googleLoginMount button").getAttribute("data-google-text"),"signin_with");
    await page.locator("#showRegister").click();
    await page.locator("#googleRegisterMount button").waitFor();
    assert.equal(await page.locator("#googleRegisterMount button").getAttribute("data-google-text"),"signup_with");
    for (const width of [390,1280]) {
      await page.setViewportSize({width,height:844});
      await page.waitForFunction(()=> {
        const m=document.querySelector("#googleRegisterMount");
        return m.firstElementChild?.style.width === Math.min(400,m.clientWidth)+"px";
      });
    }
    await page.locator("#showLogin").click();
    await page.evaluate(()=>window.__googleCallback({credential:"token-google-invalido"}));
    await page.locator("#loginMessage").getByText("Token Google inválido").waitFor();
    assert.equal(await page.evaluate(()=>sessionStorage.getItem("fluir-user")),null);
    console.log("PASS: Google disponível quando configurado e token inválido rejeitado");
    await page.close();

    page=await browser.newPage();
    await page.addInitScript(()=>{
      sessionStorage.setItem("fluir-user",JSON.stringify({id:777,nome:"Fluir QA",email:"qa@example.invalid",token:"abc12345678901234567890123456789012345678"}));
      localStorage.setItem("fluir-setup",JSON.stringify({usuarioId:777,user:{name:"Fluir QA",email:"qa@example.invalid"},modules:{tasks:true}}));
    });
    await routeGoogle(page,true);
    await page.route(api+"/usuarios/google/vincular",route=>route.fulfill({
      status:409,contentType:"application/json",body:JSON.stringify({mensagem:"Conta Google já vinculada a outro usuário."})
    }));
    await page.goto(url+"/html/profile.html",{waitUntil:"domcontentloaded"});
    await page.locator("#googleProfileMount button").waitFor();
    await page.evaluate(()=>window.__googleCallback({credential:"token-falso"}));
    await page.locator("#googleLinkMessage").getByText("Conta Google já vinculada a outro usuário.").waitFor();
    console.log("PASS: Conta Google duplicada não é vinculada no perfil");
    await page.close();

    page=await browser.newPage({viewport:{width:1200,height:850}});
    await page.addInitScript(()=>{
      sessionStorage.setItem("fluir-user",JSON.stringify({id:777,nome:"Fluir QA",email:"qa@example.invalid",token:"abc12345678901234567890123456789012345678"}));
      localStorage.setItem("fluir-setup",JSON.stringify({usuarioId:777,onboardingConcluido:true,user:{name:"Fluir QA",email:"qa@example.invalid"},modules:{tasks:true}}));
    });
    let sent=null;
    await page.route(api+"/assistente/chat",async route=>{
      sent=JSON.parse(route.request().postData());
      await route.fulfill({status:503,contentType:"application/json",body:JSON.stringify({mensagem:"Gemini ainda não configurado no Supabase."})});
    });
    await page.goto(url+"/html/dashboard.html",{waitUntil:"domcontentloaded"});
    await page.locator("#fluirAssistantButton").click();
    await page.locator(".fluir-assistant-form textarea").fill("Como organizar meu dia?");
    await page.locator(".fluir-assistant-form button[type=submit]").click();
    assert.equal(sent,null,"Não pode enviar sem consentimento");
    await page.locator(".fluir-assistant-consent input").check();
    await page.locator(".fluir-assistant-form button[type=submit]").click();
    await page.locator(".fluir-assistant-bubble[data-author=error]").getByText("Gemini ainda não configurado no Supabase.").waitFor();
    assert.equal(sent.consentimento,true);
    assert.equal(sent.mensagem,"Como organizar meu dia?");
    console.log("PASS: Consentimento explícito enviado à API e erro de IA visível");
    await page.close();

    // Conversa real: o histórico somente acompanha mensagens autorizadas nesta aba.
    page=await browser.newPage({viewport:{width:390,height:844}});
    await page.addInitScript(()=>{
      sessionStorage.setItem("fluir-user",JSON.stringify({id:777,nome:"Fluir QA",email:"qa@example.invalid",token:"abc12345678901234567890123456789012345678"}));
      localStorage.setItem("fluir-setup",JSON.stringify({usuarioId:777,onboardingConcluido:true,user:{name:"Fluir QA",email:"qa@example.invalid"},modules:{tasks:true}}));
    });
    const requests=[];
    await page.route(api+"/assistente/chat",route=>{
      requests.push(JSON.parse(route.request().postData()));
      return route.fulfill({status:200,contentType:"application/json",
        body:JSON.stringify({resposta:requests.length===1?"Vamos estudar matemática.":"Vamos começar com um exemplo."})});
    });
    await page.goto(url+"/html/dashboard.html",{waitUntil:"domcontentloaded"});
    await page.locator("#fluirAssistantButton").click();
    async function ask(msg){
      await page.locator(".fluir-assistant-form textarea").fill(msg);
      await page.locator(".fluir-assistant-consent input").check();
      await page.locator(".fluir-assistant-form button[type=submit]").click();
      await page.waitForFunction(()=>document.querySelector(".fluir-assistant-send").disabled===false);
    }
    await ask("Quero estudar matemática.");
    assert.deepEqual(requests[0].historico,[]);
    await ask("Me dá um exemplo disso.");
    assert.equal(requests[1].historico.length,2);
    assert.equal(requests[1].historico[0].text,"Quero estudar matemática.");
    assert.equal(requests[1].historico[1].text,"Vamos estudar matemática.");
    await page.locator(".fluir-assistant-reset").click();
    await ask("Agora quero falar de água.");
    assert.deepEqual(requests[2].historico,[]);
    console.log("PASS: Histórico curto, consentimento e limpeza da conversa no celular");
    await page.close();
    console.log("5 cenários Google e IA aprovados no Chrome");
  } finally {
    await browser.close(); server.close();
  }
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
