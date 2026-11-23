"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const playwright=require(path.join(process.env.TEMP,"fluir-browser-qa-2211","node_modules","playwright"));
const { _electron }=playwright;
const root=path.join(__dirname,"..");
const devBinary=path.join(root,"node_modules","electron","dist","electron.exe");
const packagedBinary=path.join(root,"dist","win-unpacked","Fluir.exe");
const executable=fs.existsSync(devBinary)?devBinary:packagedBinary;
const args=executable===packagedBinary?[]:[root];
(async()=>{
 const electron=await _electron.launch({executablePath:executable,args,timeout:45000});
 try{
  const page=await electron.firstWindow();
  await page.waitForURL(url=>url.href.startsWith("https://fluir-sistema.vercel.app") || url.href.startsWith("file:"),{timeout:30000});
  await page.waitForLoadState("domcontentloaded",{timeout:30000});
  const url=page.url();
  assert.ok(url.startsWith("https://fluir-sistema.vercel.app"),"Wrong app origin: "+url);
  const prefs=await electron.evaluate(({BrowserWindow})=>{
   const win=BrowserWindow.getAllWindows()[0];
   return win.webContents.getLastWebPreferences();
  });
  assert.equal(prefs.nodeIntegration,false);
  assert.equal(prefs.contextIsolation,true);
  assert.equal(prefs.sandbox,true);
  assert.equal(await page.evaluate(()=>typeof window.require),"undefined");
  console.log("PASS desktop runtime URL",url);
  console.log("PASS contextIsolation, sandbox, nodeIntegration disabled");
  console.log("PASS window.require unavailable to website");
  fs.mkdirSync(path.join(root,"qa"),{recursive:true});
  await page.screenshot({path:path.join(root,"qa","desktop-windows-login.png")});
 }finally{await electron.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
