(function(){
 "use strict";
 const tr=value=>window.FluirI18n?.t(value)??value;
 const base="https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api/conta";
 function session(){try{return JSON.parse(sessionStorage.getItem("fluir-user")||"null")}catch{return null}}
 async function call(path,method="GET"){
  const user=session();if(!user?.token)throw Error("Sessão inválida");
  const r=await fetch(base+path,{method,headers:{Authorization:"Bearer "+user.token},cache:"no-store",signal:AbortSignal.timeout(12000)});
  if(!r.ok){const error=Error("HTTP "+r.status);error.status=r.status;throw error}return r.json();
 }
 function clearLocal(){
  for(const key of ["fluir-user","fluir-onboarding","fluir-onboarding-completed"])sessionStorage.removeItem(key);
  window.google?.accounts?.id?.disableAutoSelect?.();
  location.replace("login.html");
 }
 async function logout(){
  try{await call("/logout","POST");clearLocal()}
  catch(error){if(error.status===401){clearLocal();return}if(confirm("Não foi possível encerrar a sessão no servidor. Sair apenas deste navegador?"))clearLocal()}
 }
 function addLogout(container,cls){
  if(!container||container.querySelector("[data-fluir-logout]"))return;
  const btn=document.createElement("button");btn.type="button";btn.className=cls;btn.dataset.fluirLogout="";btn.textContent=tr("Sair da conta");container.append(btn);
 }
 async function refresh(){
  const card=document.getElementById("googleAccountCard"),count=document.getElementById("fluirSessionCount"),list=document.getElementById("fluirSessionList");
  const settingCount=document.getElementById("fluirSettingsSessionCount");
  if(!settingCount&&(!card||!count||!list))return;
  try{
   const data=await call("/seguranca");
   if(settingCount)settingCount.textContent="Sessões ativas: "+(Array.isArray(data.sessoes)?data.sessoes.length:0);
   if(!card||!count||!list)return;
   card.replaceChildren();
   const title=document.createElement("strong");title.textContent=tr(data.google?.vinculado?"Google vinculado":"Google não vinculado");
   const detail=document.createElement("p");detail.textContent=data.google?.vinculado?(data.google.nome+" · "+data.google.email):"Vincule somente a conta com o mesmo e-mail do Fluir.";
   card.append(title,detail);
   if(data.google?.vinculado){const mount=document.getElementById("googleProfileMount");if(mount)mount.hidden=true}
   const sessions=Array.isArray(data.sessoes)?data.sessoes:[];
   count.textContent=sessions.length+" "+(sessions.length===1?"sessão":"sessões");
   list.replaceChildren();
   for(const item of sessions){
    const row=document.createElement("div");row.className="fluir-account-card";
    const title=document.createElement("strong");title.textContent=tr(item.atual?"Sessão atual":"Outra sessão ativa");
    const device=document.createElement("p");device.textContent=item.dispositivo||"Dispositivo não identificado";
    const date=document.createElement("p");date.textContent="Último acesso: "+new Date(item.ultimoAcesso||item.criadoEm).toLocaleString();
    row.append(title,device,date);
    if(!item.atual){const btn=document.createElement("button");btn.type="button";btn.textContent=tr("Encerrar sessão");btn.addEventListener("click",async()=>{if(!confirm("Encerrar esta sessão?"))return;try{await call("/sessoes/"+encodeURIComponent(item.id),"DELETE");refresh()}catch{alert("Não foi possível encerrar a sessão.")}});row.append(btn)}
    list.append(row);
   }
  }catch{if(settingCount)settingCount.textContent=tr("Sessões indisponíveis");if(!card||!count||!list)return;card.textContent=tr("Não foi possível consultar o vínculo Google.");count.textContent=tr("Indisponível");list.replaceChildren()}
 }
 function init(){
  if(!session()?.token)return;
  addLogout(document.querySelector(".profile-dropdown"),"profile-dropdown-row");
  addLogout(document.querySelector(".mobile-drawer-nav"),"mobile-drawer-link");
  document.addEventListener("click",e=>{if(e.target.closest("[data-fluir-logout]")){e.preventDefault();logout()}});
  window.addEventListener("fluir:google-linked",refresh);
  const consentStatus=document.getElementById("fluirAIConsentStatus");
  const revoke=document.getElementById("fluirAIRevoke");
  if(consentStatus&&revoke){
   const update=()=>{const on=FluirStorage.getItem("fluir-ai-consent-v1")==="true";consentStatus.textContent=on?"Autorizado para esta conta neste navegador.":"Não autorizado.";revoke.disabled=!on};
   revoke.addEventListener("click",()=>{FluirStorage.removeItem("fluir-ai-consent-v1");window.dispatchEvent(new Event("fluir:ai-consent"));update()});
   window.addEventListener("fluir:ai-consent",update);
   update();
  }
  refresh();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
 window.addEventListener("pageshow",event=>{if(event.persisted&&!session()?.token)location.replace("login.html")});
})();