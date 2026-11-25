/* Assistente Fluir: UI flutuante. Nunca persiste prompts ou envia dados sem consentimento. */
(function(){
  "use strict";
  if(document.getElementById("fluirAssistantButton"))return;
  const demo=document.body.dataset.fluirDemo==="true";
  const API="https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api/assistente/chat";
  const button=document.createElement("button");
  button.id="fluirAssistantButton";
  button.className="fluir-assistant-fab";
  button.type="button";
  button.setAttribute("aria-label","Abrir assistente de IA Fluir");
  button.setAttribute("aria-expanded","false");
  button.setAttribute("aria-controls","fluirAssistantWindow");
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 14 9l5.5 2-5.5 2-2 5.5L10 13l-5.5-2L10 9z"/><path d="m19 17 .8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/></svg><span class="fluir-assistant-fab-label">Assistente Fluir</span>';
  const panel=document.createElement("section");
  panel.id="fluirAssistantWindow";
  panel.className="fluir-assistant-window";
  panel.hidden=true;
  panel.setAttribute("aria-label","Conversa com assistente Fluir");
  const header=document.createElement("header");
  header.className="fluir-assistant-top";
  const heading=document.createElement("div");
  const title=document.createElement("strong");
  title.textContent="Assistente Fluir";
  const sub=document.createElement("small");
  sub.textContent=demo?"Simulação interativa":"IA generativa · acesso autenticado";
  heading.append(title,sub);
  const close=document.createElement("button");
  close.type="button";
  close.className="fluir-assistant-close";
  close.setAttribute("aria-label","Fechar assistente");
  close.textContent="✕";
  header.append(heading,close);
  const note=document.createElement("p");
  note.className="fluir-assistant-note";
  note.textContent=demo?"Esta é uma demonstração com respostas ilustrativas. Não utiliza Gemini nem envia mensagens.":"Ao confirmar, sua mensagem será enviada à API do Fluir e ao provedor Gemini. Não compartilhe dados sensíveis.";
  const feed=document.createElement("div");
  feed.className="fluir-assistant-messages";
  feed.setAttribute("role","log");
  feed.setAttribute("aria-live","polite");
  const form=document.createElement("form");
  form.className="fluir-assistant-form";
  const input=document.createElement("textarea");
  input.rows=3;
  input.maxLength=1200;
  input.required=true;
  input.setAttribute("aria-label","Escreva uma mensagem para o assistente");
  input.placeholder="Ex.: Como organizar meus estudos hoje?";
  const consent=document.createElement("label");
  consent.className="fluir-assistant-consent";
  const consentInput=document.createElement("input");
  consentInput.type="checkbox";
  consentInput.required=true;
  const consentText=document.createElement("span");
  consentText.textContent=demo?"Entendi que esta resposta é simulada.":"Autorizo o envio desta mensagem à API e ao serviço de IA.";
  consent.append(consentInput,consentText);
  const send=document.createElement("button");
  send.type="submit";
  send.className="fluir-assistant-send";
  send.textContent="Enviar mensagem";
  form.append(input,consent,send);
  panel.append(header,note,feed,form);
  document.body.append(button,panel);
  let busy=false;
  let controller=null;
  function say(message,author){
    const bubble=document.createElement("div");
    bubble.className="fluir-assistant-bubble";
    bubble.dataset.author=author||"assistant";
    bubble.textContent=String(message);
    feed.appendChild(bubble);
    feed.scrollTop=feed.scrollHeight;
  }
  function fakeAnswer(message){
    const m=message.toLocaleLowerCase("pt-BR");
    if(/tarefa|estud|trabalho/.test(m))return "Exemplo ilustrativo: escolha uma tarefa pequena, reserve 20 minutos e marque quando concluir.";
    if(/[aá]gua|hidrata/.test(m))return "Exemplo ilustrativo: deixe uma garrafa por perto e registre apenas a quantidade que realmente bebeu.";
    if(/h[aá]bito|rotina/.test(m))return "Exemplo ilustrativo: comece com um hábito simples e acompanhe sua constância sem cobranças.";
    return "Exemplo ilustrativo: organize seu dia por prioridades e escolha uma próxima ação possível.";
  }
  function getToken(){
    try{
      const user=JSON.parse(sessionStorage.getItem("fluir-user")||"null");
      return typeof user?.token==="string"&&user.token.trim().length>=20?user.token.trim():null;
    }catch{return null}
  }
  function open(){
    panel.hidden=false;
    button.setAttribute("aria-expanded","true");
    if(!feed.childElementCount)say(demo?"Bem-vindo à demonstração do assistente. Envie uma pergunta fictícia.":"Olá! Posso ajudar a organizar sua rotina. As respostas dependem da conexão e configuração da IA no servidor.");
    input.focus();
  }
  function hide(){
    panel.hidden=true;
    button.setAttribute("aria-expanded","false");
    button.focus();
  }
  button.addEventListener("click",()=>panel.hidden?open():hide());
  close.addEventListener("click",hide);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)hide()});
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(busy)return;
    const message=input.value.trim();
    if(!message||!consentInput.checked)return;
    say(message,"user");
    input.value="";
    consentInput.checked=false;
    if(demo){say(fakeAnswer(message));return}
    const token=getToken();
    if(!token){say("Para usar a IA real, entre em uma conta de testes primeiro. A demonstração não autentica usuários.","error");return}
    busy=true;send.disabled=true;send.textContent="Respondendo...";
    controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),25000);
    try{
      const response=await fetch(API,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},
        body:JSON.stringify({mensagem:message,consentimento:true}),
        cache:"no-store",
        signal:controller.signal
      });
      const data=await response.json().catch(()=>({}));
      if(response.ok&&typeof data.resposta==="string"&&data.resposta.trim()){
        say(data.resposta);
      }else if(response.status===401){
        say("O servidor não reconheceu a sessão. Faça login novamente. Seus dados não foram apagados.","error");
      }else if(response.status===403){
        say("O servidor recusou esta operação. Confira a permissão e o ambiente de testes.","error");
      }else if(response.status===429){
        say(data.mensagem||"O assistente atingiu o limite de mensagens por enquanto. Tente mais tarde.","error");
      }else if(response.status===503){
        say(data.mensagem||"A IA generativa ainda não está configurada ou está indisponível neste ambiente.","error");
      }else{
        say(data.mensagem||"Não foi possível obter uma resposta da IA. Tente novamente.","error");
      }
    }catch(err){
      const info=err?.name==="AbortError"?"A IA demorou para responder.":"Falha de conexão com a API. Verifique a rede e a liberação de CORS da prévia.";
      say(info,"error");
    }finally{
      clearTimeout(timer);controller=null;busy=false;send.disabled=false;send.textContent="Enviar mensagem";
    }
  });
  window.FluirAssistant={isDemo:demo};
})();
