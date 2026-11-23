const assert=require("node:assert/strict");
const path=require("node:path");
const {chromium}=require(path.join(process.env.TEMP||process.env.TMP,"fluir-browser-qa-2211","node_modules","playwright"));
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",args:["--no-sandbox"]});
 const page=await browser.newPage({viewport:{width:1200,height:800}});
 await page.addInitScript(()=>sessionStorage.setItem("fluir-user",
   JSON.stringify({id:3,nome:"Conta Teste",token:"TOKEN_FICTICIO_QA_SEM_CREDENCIAL_123456789"})));
 let calls=0;
 await page.route("https://fluir-sistema.onrender.com/api/onboarding/salvar",async route=>{
   calls++;await route.fulfill({status:401,contentType:"application/json",body:'{"mensagem":"Sessão ausente ou expirada."}'});
 });
 await page.goto("http://127.0.0.1:5505/html/setup.html",{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#setupForm").evaluate(el=>el.inert),false);
 await page.locator("#userName").fill("Teste Sessao");
 await page.locator("#userNickname").fill("QA");
 for(const id of ["sexAtBirth","userPronouns","communicationTone"]){
  const opts=await page.locator("#"+id+" option").evaluateAll(v=>v.map(o=>o.value).filter(Boolean));
  await page.locator("#"+id).selectOption(opts[0]);
 }
 await page.locator("#userAge").fill("22");
 async function advance(){
  await page.locator("#nextBtn").click();
  console.log("STEP",await page.locator(".setup-step.active").getAttribute("data-step"),
    "MESSAGE",await page.locator("#formMessage").innerText());
 }
 await advance();
 await page.locator('.module-option input[value="menstrualCycle"]').check();
 await advance();
 await advance();
 await advance();
 await advance();
 await page.locator("#formMessage.show").waitFor({timeout:8000});
 console.log("HTTP_POST_COUNT",calls);
 console.log("STATUS",await page.locator("#formMessage").innerText());
 assert.equal(calls,1);
 assert.match(await page.locator("#formMessage").innerText(),/Sua sessão de 12 horas terminou/);
 await browser.close(); console.log("PASS authenticated session status 401 displayed correctly");
})().catch(e=>{console.error(e);process.exit(1)});
