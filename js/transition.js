(function () {
  "use strict";
  const ID="fluirTransition";
  let panel=null;
  let mainTitle=null;
  let subtitle=null;
  let busyRoot=null;
  function ensure() {
    if(panel) return panel;
    panel=document.createElement("section");
    panel.id=ID;
    panel.className="fluir-transition";
    panel.hidden=true;
    panel.setAttribute("role","status");
    panel.setAttribute("aria-live","polite");
    panel.setAttribute("aria-atomic","true");
    const content=document.createElement("div");
    content.className="fluir-transition__panel";
    const mark=document.createElement("div");
    mark.className="fluir-transition__brand";
    const logo=document.createElement("img");
    logo.src="/Assets/brand/fluir-symbol.svg";
    logo.alt="";
    mark.appendChild(logo);
    const brand=document.createElement("span");
    brand.className="fluir-transition__name";
    brand.textContent="Fluir";
    const spinner=document.createElement("div");
    spinner.className="fluir-transition__spinner";
    spinner.setAttribute("aria-hidden","true");
    mainTitle=document.createElement("h2");
    mainTitle.className="fluir-transition__title";
    subtitle=document.createElement("p");
    subtitle.className="fluir-transition__message";
    content.append(mark,brand,spinner,mainTitle,subtitle);
    panel.append(content);
    document.body.append(panel);
    return panel;
  }
  function update(title,message) {
    ensure();
    mainTitle.textContent=String(title || "Preparando seu espaço...");
    subtitle.textContent=String(message || "Estamos concluindo esta etapa com segurança.");
  }
  function show(title,message) {
    update(title,message);
    panel.hidden=false;
    // Mantém o aria-live fora do container busy para leitores de tela
    // anunciarem o andamento em vez de reterem a mensagem.
    busyRoot=document.querySelector("main.setup-page,main.page");
    busyRoot?.setAttribute("aria-busy","true");
  }
  function hide() {
    if(panel)panel.hidden=true;
    busyRoot?.removeAttribute("aria-busy");
    busyRoot=null;
  }
  function navigate(destination,title,message) {
    show(title || "Tudo pronto!",message || "Abrindo seu espaço no Fluir...");
    window.location.assign(destination);
  }
  window.FluirTransition=Object.freeze({show,update,hide,navigate});
})();
