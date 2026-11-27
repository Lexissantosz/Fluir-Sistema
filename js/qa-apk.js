(async function(){
  const button=document.getElementById("qaApkDownload");
  if(!button)return;
  try{
    const r=await fetch("/api/qa-apk",{method:"HEAD",cache:"no-store",signal:AbortSignal.timeout(6000)});
    if(r.status!==204)return;
    button.disabled=false;button.textContent="Baixar APK de testes";
    const description=document.getElementById("qaApkDescription");
    if(description)description.textContent="Baixe o APK nativo de homologação diretamente aqui. Disponível temporariamente para testadores.";
    button.addEventListener("click",()=>location.assign("/api/qa-apk"));
  }catch{/* Offline or production: leave disabled. */}
})();
