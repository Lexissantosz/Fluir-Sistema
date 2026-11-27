const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,"..");
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,"http://localhost");const file=path.resolve(root,"."+(url.pathname==="/"?"/index.html":url.pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return}
 const types={".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css",".svg":"image/svg+xml",".png":"image/png"};
 res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream"});fs.createReadStream(file).pipe(res)
});
(async()=>{
 await new Promise(r=>server.listen(5516,"127.0.0.1",r));const browser=await chromium.launch({channel:"chrome",headless:true});
 try{
 const page=await browser.newPage();const base="http://127.0.0.1:5516";const errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 await page.goto(base);
 const primary=await page.locator(".version-action-primary").first().evaluate(e=>getComputedStyle(e).backgroundColor);
 const cta=await page.locator(".hero .primary-button").first().evaluate(e=>getComputedStyle(e).backgroundColor);
 assert.equal(primary,"rgb(23, 23, 23)");assert.equal(primary,cta);
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const [name,title] of [["privacidade","Política de Privacidade"],["termos","Termos de Uso"],["contato","Contato"]]){
   const response=await page.goto(base+"/html/"+name+".html");assert.equal(response.status(),200);
   assert.equal(await page.locator("h1").textContent(),title);
   assert.equal(await page.locator(".brand-icon img").evaluate(e=>e.complete&&e.naturalWidth>0),true);
   assert.equal(await page.locator(".legal-nav [aria-current=page]").count(),1);
   assert.equal(await page.locator(".nav-button").evaluate(e=>getComputedStyle(e).backgroundColor),primary);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+" overflow "+width);
   for(const link of await page.locator(".legal-page a[href]").evaluateAll(es=>es.map(e=>e.href).filter(h=>h.startsWith(location.origin)))){
    assert.equal((await page.request.get(link)).status(),200,link)
   }
   if(name==="contato"){
    assert.equal(await page.locator(".contact-email").textContent(),"fluirsistema@gmail.com");
    assert.equal(await page.locator(".contact-send").getAttribute("href"),"mailto:fluirsistema@gmail.com?subject=Contato%20-%20Fluir");
   }
  }
 }
 await page.goto(base);await page.locator("footer a",{hasText:"Contato"}).click();await page.waitForURL("**/html/contato.html");
 await page.goto(base+"/html/login.html");await page.locator("footer a",{hasText:"Contato"}).click();await page.waitForURL("**/html/contato.html");
 assert.equal(errors.length,0,errors.join("\n"));
 console.log("PASS: matching neutral primary color, 12 responsive legal page loads, original brand, all internal links, email links, landing and login footer navigation.");
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});