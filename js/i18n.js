/* Translate known interface labels only. Never send user records to a translator. */
(function(){
 "use strict";
 const demo=document.body.dataset.fluirDemo==="true";
 const rows=window.FluirLocaleRows||[];
 const catalog=new Map();
 for(const row of rows){
   const previous=catalog.get(row[0])||[];
   catalog.set(row[0],Array.from({length:5},(_,i)=>row[i]||previous[i]));
 }
 const indices={"en-US":1,es:2,de:3,it:4};
 const allowed=demo?["pt-BR","en-US","es","de","it"]:["pt-BR","en-US","es"];
 const url=new URL(location.href);
 const selected=demo?url.searchParams.get("lang"):(window.FluirStorage?.getItem("fluir-language")||sessionStorage.getItem("fluir-guest-locale"));
 const language=allowed.includes(selected)?selected:"pt-BR";
 function t(value){
   if(typeof value!=="string"||language==="pt-BR")return value;
   const key=value.trim().replace(/\s+/g," ");
   const row=catalog.get(key);
   const translated=row?.[indices[language]];
   return translated?value.replace(value.trim(),translated):value;
 }
 function fmt(value,params={}){
   return t(value).replace(/\{([a-zA-Z]+)\}/g,(match,key)=>Object.hasOwn(params,key)?String(params[key]):match);
 }
 function translateTree(root){
   if(language==="pt-BR"||!root)return;
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   let node;
   while(node=walker.nextNode()){
     if(node.parentElement?.closest("script,style,svg,textarea,[contenteditable=true],[data-no-translate],.fluir-assistant-messages"))continue;
     if(node.parentElement?.tagName==="OPTION"&&!node.parentElement.hasAttribute("value"))node.parentElement.value=node.parentElement.textContent;
     const text=t(node.nodeValue);
     if(text!==node.nodeValue)node.nodeValue=text;
   }
   const attrSelector="[placeholder],[aria-label],[title],[alt]";
   const elements=[...(root.matches?.(attrSelector)?[root]:[]),...(root.querySelectorAll?.(attrSelector)||[])];
   for(const e of elements){
     if(e.closest("[data-no-translate],.fluir-assistant-messages"))continue;
     for(const a of ["placeholder","aria-label","title","alt"])if(e.hasAttribute(a)){
       const value=e.getAttribute(a),translated=t(value);
       if(value!==translated)e.setAttribute(a,translated);
     }
   }
 }
 function setLanguage(value){
   if(!allowed.includes(value))return;
   if(demo){url.searchParams.set("lang",value);location.replace(url.href);return}
   if(window.FluirStorage?.accountId())FluirStorage.setItem("fluir-language",value);
   else sessionStorage.setItem("fluir-guest-locale",value);
   location.reload();
 }
 document.documentElement.lang=language;
 document.title=t(document.title);
 window.FluirI18n=Object.freeze({language,t,fmt,translateTree,setLanguage});
 // This script loads before application renderers: only static authored markup is here.
 translateTree(document.body);
 const labels={"pt-BR":"Português (Brasil)","en-US":"English",es:"Español",de:"Deutsch (Demo)",it:"Italiano (Demo)"};
 function selector(){
   const select=document.getElementById("languageSelect");
   if(select){
     select.value=language;
     select.addEventListener("change",()=>setLanguage(select.value));
     return;
   }
   if(!demo&&!/\/(login|setup|recuperar-senha)\.html$/.test(location.pathname))return;
   const container=document.createElement("label");
   container.className="fluir-language-picker";
   const label=document.createElement("span");label.textContent=t("Idioma");
   const picker=document.createElement("select");picker.setAttribute("aria-label",t("Idioma"));
   for(const lang of allowed){const opt=document.createElement("option");opt.value=lang;opt.textContent=labels[lang];picker.append(opt)}
   picker.value=language;picker.addEventListener("change",()=>setLanguage(picker.value));container.append(label,picker);
   const target=demo?document.querySelector(".demo-top-actions"):document.querySelector(".fluir-legal-links")||document.querySelector(".recovery")||document.body;
   target.append(container);
 }
 selector();
 if(language!=="pt-BR"){
   // Shared navigation and UI chrome are generated after the static document.
   // Only known system-owned containers are translated, never lists of real records.
   const chrome=()=>{for(const sel of [".sidebar-nav",".mobile-drawer-nav",".mobile-drawer-head",".mobile-bottom-nav",".fluir-assistant-top",".fluir-assistant-note",".fluir-assistant-form","#fluirAssistantButton"])document.querySelectorAll(sel).forEach(translateTree)};
   document.addEventListener("DOMContentLoaded",chrome);
   if(demo){
     let queued=false;
     const observer=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;observer.disconnect();translateTree(document.getElementById("demoScreen"));translateTree(document.querySelector(".demo-top"));translateTree(document.getElementById("fluirDemoGate"));translateTree(document.getElementById("demoTaskPreview"));observer.observe(document.body,{subtree:true,childList:true,characterData:true})})});
     observer.observe(document.body,{subtree:true,childList:true,characterData:true});
   }
 }
})();