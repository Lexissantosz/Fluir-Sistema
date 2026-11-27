"use strict";
const {chromium}=require("playwright"),assert=require("node:assert/strict"),http=require("node:http"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,"."+new URL(req.url,"http://localhost").pathname);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return}
 res.writeHead(200,{"Content-Type":{".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css",".svg":"image/svg+xml"}[path.extname(file)]||"application/octet-stream"});fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(5524,"127.0.0.1",r));
 const browser=await chromium.launch({channel:"chrome",headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});let requests=0,confirmations=0,status=503;
  await page.route("**/fluir-api/usuarios/senha/solicitar",route=>{
   requests++;assert.equal(route.request().postDataJSON().email,"qa@example.invalid");
   return route.fulfill({status,contentType:"application/json",body:JSON.stringify({mensagem:status===503?"O envio de recuperação ainda não está disponível.":"Se houver uma conta elegível, enviaremos um código."})});
  });
  await page.route("**/fluir-api/usuarios/senha/redefinir",route=>{
   confirmations++;const b=route.request().postDataJSON();assert.equal(b.email,"qa@example.invalid");assert.equal(b.codigo,"ABCDEFGHIJKLMNOP");
   return route.fulfill({status:confirmations===1?400:200,contentType:"application/json",body:JSON.stringify({mensagem:confirmations===1?"Código inválido, expirado ou já utilizado.":"Senha redefinida. Entre novamente com sua nova senha."})});
  });
  await page.goto("http://127.0.0.1:5524/html/login.html");
  await page.getByRole("link",{name:"Esqueci minha senha",exact:true}).click();
  await page.waitForURL("**/recuperar-senha.html");
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  await page.locator("#email").fill("qa@example.invalid");
  await page.getByRole("button",{name:"Enviar código"}).click();
  await page.locator("#message").getByText(/ainda não está disponível/).waitFor();
  assert.equal(await page.locator("#resetForm").isVisible(),false);
  status=202;await page.getByRole("button",{name:"Enviar código"}).click();
  await page.locator("#resetForm").waitFor();
  assert.equal(requests,2);
  await page.locator("#code").fill("ABCDEFGHIJKLMNOP");
  await page.locator("#password").fill("qa-new-12345");
  await page.locator("#confirm").fill("qa-wrong-12345");
  await page.getByRole("button",{name:"Redefinir senha",exact:true}).click();
  await page.locator("#message").getByText("As senhas não coincidem.").waitFor();
  assert.equal(confirmations,0);
  await page.locator("#confirm").fill("qa-new-12345");
  await page.getByRole("button",{name:"Redefinir senha",exact:true}).click();
  await page.locator("#message").getByText(/Código inválido/).waitFor();
  await page.getByRole("button",{name:"Redefinir senha",exact:true}).click();
  await page.getByRole("heading",{name:"Senha redefinida",exact:true}).waitFor();
  assert.equal(await page.locator("#resetForm").isVisible(),false);
  assert.equal(confirmations,2);assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}).includes("qa-new-12345")),false);
  await page.getByRole("link",{name:"Voltar ao login"}).click();await page.waitForURL("**/login.html");
  console.log("PASS: recovery navigation, four widths, provider unavailable, request code, confirmation mismatch, invalid code, success, return to login; mocked API");
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
