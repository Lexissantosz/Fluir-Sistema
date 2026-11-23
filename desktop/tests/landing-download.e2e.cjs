const { chromium }=require(require("node:path").join(process.env.TEMP,"fluir-browser-qa-2211","node_modules","playwright"));
const assert=require("node:assert/strict");
const path=require("node:path");
const destination="http://127.0.0.1:5505/index.html";
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",args:["--no-sandbox"]});
 try {
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:820}});
   const response=await page.goto(destination,{waitUntil:"domcontentloaded"});
   assert.equal(response.status(),200);
   const hero=page.locator("#windowsDownload");
   const card=page.locator(".version-download");
   assert.equal(await hero.count(),1);assert.equal(await card.count(),1);
   assert.equal(await hero.getAttribute("href"),await card.getAttribute("href"));
   assert.ok((await hero.getAttribute("href")).endsWith("/Fluir-Windows-Setup.exe"));
   assert.equal(await hero.isVisible(),true);
   const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=width+1,JSON.stringify(size));
   await page.screenshot({path:path.join(__dirname,"..","qa",`landing-${width}.png`),fullPage:true});
   console.log("PASS landing",width,"px sem rolagem lateral, botão visível");
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
