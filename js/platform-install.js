(function(){
 "use strict";
 let installEvent=null;
 window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();installEvent=event});
 const help={
  ios:["Instalar no iPhone","A versão instalável funciona pelo Safari.",["Abra o Fluir no Safari.","Toque em Compartilhar.","Escolha Adicionar à Tela de Início e confirme."]],
  desktop:["Instalar no computador","Instale a versão web em uma janela própria.",["Abra o Fluir no Chrome ou Microsoft Edge.","No menu do navegador, procure Instalar página como app ou Apps.","Confirme a instalação do Fluir."]]
 };
 document.querySelectorAll("[data-install-platform]").forEach(button=>button.addEventListener("click",async()=>{
  const platform=button.dataset.installPlatform;
  if(platform!=="ios"&&installEvent){
   try{await installEvent.prompt();installEvent=null;return}catch{installEvent=null}
  }
  const data=help[platform],dialog=document.getElementById("platformInstallDialog");
  document.getElementById("platformInstallTitle").textContent=data[0];
  document.getElementById("platformInstallDescription").textContent=data[1];
  const steps=document.getElementById("platformInstallSteps");
  steps.replaceChildren(...data[2].map(step=>{const li=document.createElement("li");li.textContent=step;return li}));
  if(!dialog.open)dialog.showModal();
 }));
})();