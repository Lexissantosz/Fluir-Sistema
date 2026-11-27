/* Assistente Fluir: UI flutuante. Nunca persiste prompts ou envia dados sem consentimento. */
(function(){
  "use strict";
 const tr=value=>window.FluirI18n?.t(value)??value;
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
  title.textContent=tr("Assistente Fluir");
  const sub=document.createElement("small");
  sub.textContent=demo?"Simulação interativa":"IA generativa · acesso autenticado";
  heading.append(title,sub);
  const close=document.createElement("button");
  close.type="button";
  close.className="fluir-assistant-close";
  close.setAttribute("aria-label","Fechar assistente");
  close.textContent=tr("✕");
  const reset=document.createElement("button");
  reset.type="button";
  reset.className="fluir-assistant-reset";
  reset.setAttribute("aria-label","Limpar conversa e contexto da IA");
  reset.textContent=tr("Limpar");
  header.append(heading,reset,close);
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
  input.placeholder=tr("Ex.: Como organizar meus estudos hoje?");
  const consent=document.createElement("label");
  consent.className="fluir-assistant-consent";
  const consentInput=document.createElement("input");
  consentInput.type="checkbox";
  const consentKey="fluir-ai-consent-v1";
  let demoConsent=false;
  const consentAllowed=()=>demo ? demoConsent : window.FluirStorage?.getItem(consentKey)==="true";
  function syncConsent(){consent.hidden=consentAllowed();consentInput.checked=consentAllowed();consentInput.required=!consentAllowed();}
  const consentText=document.createElement("span");
  consentText.textContent=demo?"Entendi que esta resposta é simulada.":"Autorizo o envio de mensagens e do contexto recente da conversa à API do Fluir e ao Gemini. Posso revogar esta autorização nas configurações.";
  consent.append(consentInput,consentText);
  const send=document.createElement("button");
  send.type="submit";
  send.className="fluir-assistant-send";
  send.textContent=tr("Enviar mensagem");
  form.append(input,consent,send);
  syncConsent();
  window.addEventListener("fluir:ai-consent",syncConsent);
  panel.append(header,note,feed,form);
  document.body.append(button,panel);
  let busy=false;
  let controller=null;
  let history=[]; // Somente na memória da página; nunca no localStorage.
  function say(message,author){
    const bubble=document.createElement("div");
    bubble.className="fluir-assistant-bubble";
    bubble.dataset.author=author||"assistant";
    bubble.textContent=String(message);
    feed.appendChild(bubble);
    feed.scrollTop=feed.scrollHeight;
  }
  function currentAccount(){try{return JSON.parse(sessionStorage.getItem("fluir-user")||"null")}catch{return null}}
  function localDate(){
    const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
  }
  function localTime(){return new Date().toTimeString().slice(0,5)}
  function readList(key){const data=JSON.parse(FluirStorage.getItem(key)||"[]");if(!Array.isArray(data))throw Error("Invalid records");return data}
  function appendLocal(key,record){const list=readList(key);list.unshift(record);FluirStorage.setItem(key,JSON.stringify(list))}
  function recordEvent(category,title,description){
    try{appendLocal("fluir-timeline-events",{id:Date.now(),title,category,description,date:localDate(),time:localTime(),createdAt:new Date().toISOString()})}catch{}
  }
  function refreshModule(type){
    try{
      if(type==="habito"&&typeof loadHabits==="function"&&typeof renderHabits==="function"){loadHabits();renderHabits()}
      if(type==="diario"&&typeof loadDiaryEntries==="function"&&typeof renderDiary==="function"){loadDiaryEntries();renderDiary()}
      if(type==="tarefa"&&typeof loadTasks==="function"&&typeof renderTasks==="function")loadTasks().then(renderTasks);
      if(typeof updateDashboardRealData==="function"){updateDashboardRealData();if(typeof loadDashboardTasks==="function")loadDashboardTasks();if(typeof renderDashboardTimeline==="function")renderDashboardTimeline()}
      if(typeof reloadTimelineEvents==="function"){reloadTimelineEvents();if(typeof applyTimelineVisibility==="function")applyTimelineVisibility()}
    }catch{}
  }
  async function executeAction(action,account){
    if(demo||!account?.token||currentAccount()?.token!==account.token)throw Error("Sessão alterada.");
    const id=Date.now(),createdAt=new Date().toISOString(),date=localDate();
    if(action.tipo==="tarefa"){
      const res=await fetch(API.replace(/\/assistente\/chat$/,"/tarefas"),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+account.token},
       body:JSON.stringify({usuarioId:account.id,titulo:action.titulo,descricao:action.texto||"",categoria:"Pessoal",prioridade:"low",horario:action.hora||"",dataTarefa:action.data||date,concluida:false}),signal:AbortSignal.timeout(15000)});
      if(!res.ok)throw Error("Não foi possível salvar a tarefa.");
      const saved=await res.json();
      if(!saved?.id)throw Error("O servidor não confirmou o registro.");
      recordEvent("tasks","Tarefa criada",action.titulo);
    }else if(action.tipo==="habito"){
      const dias=action.dias;
      if(!Array.isArray(dias)||!dias.length||dias.some(d=>!Number.isInteger(d)||d<0||d>6))throw Error("Frequência inválida.");
      const weekDays=[...new Set(dias)].sort();
      appendLocal("fluir-habits",{id,title:action.titulo,description:action.texto||"",category:"Pessoal",weeklyGoal:weekDays.length,weekDays,streak:0,completedDates:[],createdAt});
      recordEvent("habits","Hábito criado",action.titulo);
    }else if(action.tipo==="diario"){
      if(typeof action.texto!=="string"||action.texto.trim().length<5)throw Error("Entrada inválida.");
      appendLocal("fluir-diary",{id,title:action.titulo,mood:"neutral",tag:"Outros",text:action.texto,date,createdTime:localTime(),createdAt});
      recordEvent("diary","Entrada no diário",action.titulo);
    }else throw Error("Ação não suportada.");
    refreshModule(action.tipo);
  }
  function proposeAction(action,account){
    if(demo||!action||!["tarefa","habito","diario"].includes(action.tipo)||typeof action.titulo!=="string"||!action.titulo.trim())return;
    const box=document.createElement("div");box.className="fluir-assistant-bubble";box.dataset.author="assistant";
    const heading=document.createElement("strong");heading.textContent=({tarefa:"Nova tarefa",habito:"Novo hábito",diario:"Nova entrada no diário"})[action.tipo]+": "+action.titulo;
    const info=document.createElement("p");
    const names=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
    info.textContent=action.tipo==="habito"?(action.dias||[]).map(d=>names[d]).join(", "):action.tipo==="tarefa"?[action.data||localDate(),action.hora||"",action.texto||""].filter(Boolean).join(" · "):action.texto||"";
    const save=document.createElement("button");save.type="button";save.className="fluir-assistant-send";save.textContent=tr("Confirmar e salvar");
    const cancel=document.createElement("button");cancel.type="button";cancel.className="fluir-assistant-reset";cancel.textContent=tr("Cancelar");
    cancel.addEventListener("click",()=>{save.remove();cancel.remove();info.textContent=tr("Ação cancelada.")});
    save.addEventListener("click",async()=>{
      save.disabled=true;cancel.disabled=true;
      try{await executeAction(action,account);save.remove();cancel.remove();const status=document.createElement("p");status.textContent=tr("Registro salvo com sucesso.");box.append(status)}
      catch(e){save.disabled=false;cancel.disabled=false;say(e.message||"Não foi possível salvar.","error")}
    });
    box.append(heading,info,save,cancel);feed.append(box);feed.scrollTop=feed.scrollHeight;
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
    syncConsent();
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
  reset.addEventListener("click",()=>{
    if(busy)return;
    history=[];
    feed.replaceChildren();
    input.value="";
    syncConsent();
    say("Conversa limpa. As próximas mensagens não enviarão o contexto anterior.");
    input.focus();
  });
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)hide()});
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(busy)return;
    const message=input.value.trim();
    if(!message||(!consentAllowed()&&!consentInput.checked))return;
    if(!consentAllowed()){if(demo)demoConsent=true;else window.FluirStorage.setItem(consentKey,"true");}
    syncConsent();
    window.dispatchEvent(new Event("fluir:ai-consent"));
    say(message,"user");
    input.value="";
    syncConsent();
    if(demo){say(fakeAnswer(message));return}
    const account=currentAccount();
    const token=getToken();
    if(!token){say("Para usar a IA real, entre em uma conta de testes primeiro. A demonstração não autentica usuários.","error");return}
    busy=true;send.disabled=true;reset.disabled=true;send.textContent=tr("Respondendo...");
    controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),25000);
    try{
      const response=await fetch(API,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},
        body:JSON.stringify({mensagem:message,consentimento:true,historico:history}),
        cache:"no-store",
        signal:controller.signal
      });
      const data=await response.json().catch(()=>({}));
      if(response.ok&&typeof data.resposta==="string"&&data.resposta.trim()){
        if(currentAccount()?.token!==account?.token)return;
        say(data.resposta);
        if(data.acao)proposeAction(data.acao,account);
        history=[...history,{role:"user",text:message.slice(0,800)},{role:"model",text:data.resposta.slice(0,800)}].slice(-6);
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
      clearTimeout(timer);controller=null;busy=false;send.disabled=false;reset.disabled=false;send.textContent=tr("Enviar mensagem");
    }
  });
  window.FluirAssistant={isDemo:demo};
})();
