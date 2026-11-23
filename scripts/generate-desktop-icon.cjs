"use strict";
const fs=require("node:fs"),path=require("node:path");
const {chromium}=(()=>{
  try{return require("playwright")}catch{
    return require(path.join(process.env.TEMP,"fluir-browser-qa-2211","node_modules","playwright"));
  }
})();
(async()=>{
 const root=path.join(__dirname,"..");
 const svg=fs.readFileSync(path.join(root,"Assets","brand","fluir-symbol.svg"),"utf8");
 const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",args:["--no-sandbox"]});
 const page=await browser.newPage();
 const sizes=[16,24,32,48,64,128,256];
 const imgs=[];
 try{
 for(const size of sizes){
  const b64=await page.evaluate(async ({size,svg})=>{
   const icon=new Image();
   icon.src="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
   await icon.decode();
   const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
   const ctx=canvas.getContext("2d");
   ctx.fillStyle="#faf8fd";ctx.fillRect(0,0,size,size);
   const dim=Math.floor(size*.76),offset=(size-dim)/2;
   ctx.drawImage(icon,offset,offset,dim,dim);
   return canvas.toDataURL("image/png").split(",")[1];
  },{size,svg});
  imgs.push(Buffer.from(b64,"base64"));
 }
 }finally{await page.close();await browser.close()}
 const dir=Buffer.alloc(6+imgs.length*16);dir.writeUInt16LE(0,0);dir.writeUInt16LE(1,2);dir.writeUInt16LE(imgs.length,4);
 let offset=dir.length;
 imgs.forEach((png,i)=>{
  const pos=6+i*16,size=sizes[i];
  dir.writeUInt8(size===256?0:size,pos);
  dir.writeUInt8(size===256?0:size,pos+1);
  dir.writeUInt8(0,pos+2);dir.writeUInt8(0,pos+3);
  dir.writeUInt16LE(1,pos+4);dir.writeUInt16LE(32,pos+6);
  dir.writeUInt32LE(png.length,pos+8);dir.writeUInt32LE(offset,pos+12);
  offset+=png.length;
 });
 const dest=path.join(root,"desktop","build","icon.ico");
 fs.writeFileSync(dest,Buffer.concat([dir,...imgs]));
 console.log("ICON_OK",dest,offset+" bytes",sizes.join(","));
})().catch(e=>{console.error(e);process.exitCode=1});
