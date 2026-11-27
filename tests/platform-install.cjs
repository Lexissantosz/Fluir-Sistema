const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,"..");
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,"http://localhost");const file=path.resolve(root,"."+(url.pathname==="/"?"/index.html":url.pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return}
 const types={".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css",".png":"image/png",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"};
 res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream"});fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(5515,"127.0.0.1",r));const browser=await chromium.launch({channel:"chrome",headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on("pageerror",e=>errors.push(e.message));
 const base="http://127.0.0.1:5515";await page.goto(base);
 assert.equal(await page.locator(".version-grid article").count(),4);
 assert.equal(await page.locator(".feature-card").count(),14);
 assert.equal(await page.locator(".hero .tag").count(),0);
 assert.equal(await page.locator(".assistant-feature").count(),1);
 for(const img of await page.locator(".feature-card img").evaluateAll(es=>es.map(e=>e.src))){assert.equal((await page.request.get(img)).status(),200,img);}
 assert.equal((await page.request.get(base+"/html/demo.html")).status(),200);
 assert.equal(await page.locator(".version-grid a").first().getAttribute("href"),"html/login.html");
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:850});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),"page overflow at "+width);
  assert(await page.locator(".hero").evaluate(e=>e.getBoundingClientRect().top)<180,"hero starts too low at "+width);
  const dimensions=await page.locator(".version-grid").evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));
  assert(dimensions.scroll<=dimensions.width+1,"overflow at "+width);
  for(const platform of ["ios","desktop"]){
   await page.locator("[data-install-platform='"+platform+"']").click();
   await page.locator("#platformInstallDialog").waitFor({state:"visible"});
   assert.equal(await page.locator("#platformInstallSteps li").count(),3);
   await page.getByRole("button",{name:"Fechar",exact:true}).click();
   await page.locator("#platformInstallDialog").waitFor({state:"hidden"});
  }
 }
 assert.equal(await page.locator(".version-grid button:disabled").count(),2);
 assert.equal(await page.locator("[data-install-platform=android]").count(),0);
 assert.match(await page.locator(".version-grid article").nth(1).innerText(), /APK/);
 const manifest=await (await page.request.get(base+"/manifest.webmanifest")).json();
 for(const icon of manifest.icons){assert.equal((await page.request.get(base+icon.src)).status(),200);}
 assert.equal(manifest.start_url,"/html/login.html");
 await page.locator(".version-grid a").first().click();await page.waitForURL("**/html/login.html");
 assert.equal(errors.length,0,errors.join("\n"));
 console.log("PASS: platform cards, desktop/mobile widths, all install help dialogs, manifest icons, web login link, unavailable binary buttons.");
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1})