const {chromium}=(()=>{try{return require("playwright")}catch{return require(require("node:path").join(process.env.TEMP,"fluir-browser-qa-2211","node_modules","playwright"))}})();
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const base="http://127.0.0.1:5505";
const tests=[];
async function run(label,fn){await fn();tests.push("PASS "+label);console.log("PASS",label)}
(async()=>{
 let browser;
 try { browser=await chromium.launch({channel:"msedge",headless:true,args:["--no-sandbox"]}); }
 catch(e){ console.error("EDGE_UNAVAILABLE: "+e.message.slice(0,220));process.exitCode=2;return; }
 try {
  const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(base+"/html/login.html",{waitUntil:"load"});
  await run("Edge carrega login do Fluir",async()=>assert.match(await page.title(),/Fluir/i));
  await run("Edge reconhece manifesto instalável e ícones",async()=>{
    const m=await context.request.get(base+"/manifest.webmanifest");
    assert.equal(m.status(),200);
    const json=await m.json();
    assert.equal(json.display,"standalone");
    assert.equal(json.start_url,"/html/login.html");
    for(const v of json.icons.filter(icon=>icon.type==="image/png")){
      const r=await context.request.get(base+v.src);
      assert.equal(r.status(),200,v.src);
    }
  });
  await run("Edge ativa Service Worker sem credenciais",async()=>{
    await page.waitForFunction(async()=>Boolean((await navigator.serviceWorker.getRegistration("/"))?.active),null,{timeout:12000});
  });
  for(const width of [1440,1024,768]){
    await page.setViewportSize({width,height:900});
    await run("Login não extrapola a largura em "+width+" px",async()=>{
      const dims=await page.evaluate(()=>({innerWidth,scroll:document.documentElement.scrollWidth}));
      assert.ok(dims.scroll<=dims.innerWidth+1,JSON.stringify(dims));
    });
  }
  await page.goto(base+"/html/setup.html?qa=1",{waitUntil:"domcontentloaded"});
  await run("Edge abre onboarding original em modo QA",async()=>{
    assert.equal(await page.locator(".setup-step").count(),5);
    assert.ok((await page.locator("#setupSessionNotice").innerText()).includes("dados não salvos"));
  });
  await page.screenshot({path:path.join(__dirname,"evidencia-edge-desktop-23-11.png"),fullPage:false});
  await run("Edge não registra exceções JavaScript nessas telas",async()=>assert.equal(errors.length,0,errors.join(";")));
  await context.close();
 } finally { await browser.close(); }
 fs.writeFileSync(path.join(__dirname,"relatorio-edge-desktop-23-11.txt"),[
   "Fluir PWA no Microsoft Edge desktop: teste automatizado, não é instalação real",
   ...tests,tests.length+" verificações aprovadas"
 ].join("\n")+"\n");
})().catch(e=>{console.error("EDGE_QA_FAILED "+e.stack);process.exitCode=1});
