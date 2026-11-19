/* Assistente Fluir: prévia segura, comandos guiados e confirmação de todos os registros. */
(function () {
  "use strict";

  const Core = window.FluirAssistantCore;
  if (!Core) { console.error("O interpretador do assistente não está disponível."); return; }

  const $ = (id) => document.getElementById(id);
  const elements = {
    messages: $("messages"), pending: $("pendingActions"), choices: $("quickChoices"),
    form: $("assistantForm"), input: $("messageInput"), tone: $("communicationTone"),
    toneHint: $("toneHint"), welcome: $("welcomeText"), notice: $("storageNotice"),
    modeLabel: $("experienceLabel"), modeGroup: $("chatModes"), modules: $("modulesNav"),
    ai: $("useGenerativeAI"), login: $("signInLink"), clear: $("clearConversation")
  };

  const params = new URLSearchParams(location.search);
  function readJSON(store, key) {
    try { return JSON.parse(store.getItem(key)||"null"); } catch { return null; }
  }
  const user = readJSON(sessionStorage, "fluir-user");
  const authenticated = Boolean(user && Number.isInteger(Number(user.id)) && user.token && !params.has("demo"));
  const userId = authenticated ? Number(user.id) : null;
  const demo = !authenticated;
  const storageKey = demo ? "fluir-assistente-demo-v1" : "fluir-assistente-usuario-"+userId+"-v1";
  let state = readJSON(localStorage, storageKey);
  if (!state || !Array.isArray(state.messages) || !Array.isArray(state.records)) state = {messages:[],records:[]};
  const pending = new Map();
  let conversationMode = "mixed";
  let tone = "calmo";
  const onboarding = authenticated ? readJSON(localStorage, "fluir-setup") : null;
  if (onboarding && String(onboarding.usuarioId) === String(userId)) {
    const selected = onboarding.user?.communicationTone;
    if (["calmo","direto","motivador","neutro"].includes(selected)) tone = selected;
  } else if(authenticated) {
    const fromServer = readJSON(sessionStorage, "fluir-onboarding")?.tomComunicacao;
    if (["calmo","direto","motivador","neutro"].includes(fromServer)) tone=fromServer;
  }

  function persist() {
    try {
      state.messages=state.messages.slice(-70);
      state.records=state.records.slice(-200);
      localStorage.setItem(storageKey,JSON.stringify(state));
      return true;
    } catch (error) {
      console.warn("Armazenamento do assistente indisponível.",error);
      elements.notice.textContent="Não foi possível guardar o registro neste dispositivo. Verifique o armazenamento.";
      return false;
    }
  }

  function bubble(role,text,source,remember=true) {
    const div=document.createElement("div");
    div.className="bubble from-"+(role==="user"?"user":"assistant");
    const content=document.createElement("span");
    content.textContent=String(text||"").slice(0,3500);
    div.appendChild(content);
    if (source) {
      const info=document.createElement("small");
      info.textContent=source;
      div.appendChild(info);
    }
    elements.messages.appendChild(div);
    elements.messages.scrollTop=elements.messages.scrollHeight;
    if (remember) {
      state.messages.push({role,text:String(text||"").slice(0,1600),source:source||"",at:new Date().toISOString()});
      persist();
    }
  }

  function confirmAction(data) {
    const now=new Date();
    const record={
      id:now.getTime()+"-"+Math.random().toString(36).slice(2,8),
      type:data.type, value:String(data.value).slice(0,500),
      label:String(data.label).slice(0,150), at:now.toISOString(),
      // Preview: registros locais NÃO representam sincronização com backend ou outros módulos.
      syncStatus:"local-preview"
    };
    state.records.push(record);
    if (persist()) {
      bubble("assistant","Registrado nesta versão de avaliação: "+Core.describe(record)+".
Ainda não foi sincronizado com os demais módulos nem com o servidor.","Salvo somente neste dispositivo");
    } else {
      state.records.pop();
      bubble("assistant","Não consegui salvar este registro. Nenhuma alteração foi confirmada.","Falha local");
    }
  }

  function showActions(actions) {
    elements.pending.textContent="";
    pending.clear();
    actions.forEach((item,index)=>{
      const id=Date.now()+"-"+index;
      pending.set(id,item);
      const card=document.createElement("section");
      card.className="action-card";
      const title=document.createElement("strong");
      title.textContent="Confirmar registro";
      const paragraph=document.createElement("p");
      paragraph.textContent=Core.describe(item);
      const controls=document.createElement("div");
      controls.className="action-row";
      const approve=document.createElement("button");
      approve.type="button";approve.textContent="Confirmar e registrar";
      const reject=document.createElement("button");
      reject.type="button";reject.textContent="Descartar";reject.className="discard";
      approve.addEventListener("click",()=>{
        if (!pending.has(id)) return;
        confirmAction(item); pending.delete(id); card.remove();
      });
      reject.addEventListener("click",()=>{pending.delete(id);card.remove();bubble("assistant","Esse registro foi descartado. Nenhum dado foi salvo.","Sem alterações");});
      controls.append(approve,reject);
      card.append(title,paragraph,controls);
      elements.pending.appendChild(card);
    });
  }

  function showReport() {
    const summary=Core.getSummary(state.records);
    return "Resumo dos registros confirmados nesta prévia:\n"+
      "• Tarefas: "+summary.tasks+"\n"+
      "• Diário: "+summary.diary+"\n"+
      "• Humor: "+summary.moods+" (último: "+summary.lastMood+")\n"+
      "• Disposição: "+summary.energy+" (última: "+summary.lastEnergy+").\n"+
      "Esses números se referem apenas aos registros feitos aqui neste dispositivo, não ao banco de dados do Fluir.";
  }

  function helperReply(text) {
    const query=Core.normalize(text);
    if (/(relat[oó]rio|resumo|estat[ií]stica)/.test(query)) return showReport();
    if (/(modulo|modulos|area|funcionalidade)/.test(query)) {
      return "Posso orientar em "+Core.ROUTES.map(item=>item[0]).join(", ")+". Escolha uma área no painel lateral para continuar. Na prévia, a navegação real exige login.";
    }
    if (/(como voce funciona|o que voce faz|ajuda|socorro|ola|oi\b|bom dia|boa tarde)/.test(query)) {
      return Core.messageForTone(tone,"welcome")+" Posso reconhecer pedidos simples em uma mensagem, como humor, disposição e tarefas. Todo registro precisa ser confirmado.";
    }
    return Core.messageForTone(tone,"empty")+
      " Se quiser registrar algo, tente: 'Estou cansado, crie uma tarefa de revisar química'. Em pedidos mais complexos, posso ajudar a organizar os próximos passos, mas esta prévia ainda não interpreta tudo como uma IA generativa.";
  }

  async function tryGenerative(message) {
    if (!elements.ai.checked || demo) return null;
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),18000);
    try {
      const response=await fetch("https://fluir-sistema.onrender.com/api/assistente/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+user.token},
        body:JSON.stringify({mensagem:message}),
        signal:controller.signal
      });
      if(!response.ok) return null;
      const data=await response.json();
      return typeof data.resposta==="string" && data.resposta.trim()?data.resposta.slice(0,2500):null;
    } catch(error) { console.info("IA generativa indisponível. Usando modo guiado."); return null; }
    finally {clearTimeout(timer);}
  }

  async function handleMessage(text) {
    const message=String(text||"").trim();
    if(!message) return;
    bubble("user",message,"");
    elements.input.value="";
    const actions=Core.parseIntent(message);
    if(actions.length) {
      bubble("assistant",Core.messageForTone(tone,"confirm")+" Identifiquei "+actions.length+" item(ns) na mensagem.","Interpretação guiada • requer confirmação");
      showActions(actions);
      return;
    }
    const generated=await tryGenerative(message);
    bubble("assistant",generated||helperReply(message),generated?"IA generativa":"Modo guiado • sem IA externa");
  }

  const quickGroups={
    mood:[
      ["Estou feliz","positive","Leve"],["Estou neutro","neutral","Neutro"],["Estou triste","heavy","Pesado"]
    ],
    energy:[
      ["Estou com pouca energia","low","Baixa"],["Energia média","medium","Média"],["Tenho muita energia","high","Alta"]
    ],
    task:[
      ["Estudar 30 minutos","Estudar 30 minutos","Estudar 30 minutos"],
      ["Organizar meu quarto","Organizar meu quarto","Organizar meu quarto"],
      ["Beber água","Beber água","Beber água"]
    ],
    diary:[
      ["Hoje foi um dia tranquilo","Hoje foi um dia tranquilo","Hoje foi um dia tranquilo"],
      ["Hoje me senti sobrecarregado","Hoje me senti sobrecarregado","Hoje me senti sobrecarregado"],
      ["Hoje consegui cuidar de mim","Hoje consegui cuidar de mim","Hoje consegui cuidar de mim"]
    ]
  };

  function presentChoices(topic) {
    const items=quickGroups[topic];
    if(!items)return;
    const labels={mood:"Como você se sentiu?",energy:"Como está sua disposição?",task:"Qual tarefa deseja registrar?",diary:"Selecione uma frase para o diário."};
    bubble("assistant",labels[topic]+" Vou pedir sua confirmação antes de registrar.","Escolhas guiadas");
    const container=document.createElement("section");
    container.className="action-card";
    const title=document.createElement("strong");title.textContent=labels[topic];
    const row=document.createElement("div");row.className="choice-grid";
    for(const [titleText,value,label] of items){
      const button=document.createElement("button");button.type="button";button.textContent=titleText;
      button.addEventListener("click",()=>{
        container.remove();
        const type=topic;
        showActions([{type,value,label}]);
      });
      row.appendChild(button);
    }
    container.append(title,row);
    elements.pending.replaceChildren(container);
  }

  function handleShortcut(topic) {
    if (quickGroups[topic]) {presentChoices(topic);return;}
    if(topic==="report"){bubble("assistant",showReport(),"Resumo local verificado");return;}
    if(topic==="modules"){bubble("assistant",helperReply("quais módulos existem"),"Catálogo Fluir");return;}
  }

  function showModules(){
    for(const [title,href] of Core.ROUTES){
      const btn=document.createElement("button");
      btn.type="button";btn.textContent=title;
      btn.addEventListener("click",()=>{
        if(demo)bubble("assistant","A área "+title+" faz parte do Fluir. Nesta demonstração, os registros não são sincronizados. Para usar o módulo com sua conta, primeiro conclua o login.","Prévia do módulo");
        else location.href=href;
      });
      elements.modules.appendChild(btn);
    }
  }

  function updateMode(){
    elements.form.classList.toggle("hidden",conversationMode==="guided");
    elements.choices.classList.toggle("hidden",conversationMode==="free");
  }

  elements.form.addEventListener("submit",(event)=>{event.preventDefault();handleMessage(elements.input.value);});
  elements.input.addEventListener("keydown",(event)=>{
    if(event.key==="Enter" && !event.shiftKey){event.preventDefault();handleMessage(elements.input.value);}
  });
  elements.choices.querySelectorAll("[data-action]").forEach(btn=>btn.addEventListener("click",()=>handleShortcut(btn.dataset.action)));
  elements.modeGroup.addEventListener("change",(event)=>{if(event.target.name!=="chatMode")return;conversationMode=event.target.value;updateMode();});
  elements.tone.addEventListener("change",()=>{
    tone=elements.tone.value;
    bubble("assistant","Vou usar o estilo de comunicação selecionado durante esta conversa.","Preferência de comunicação");
  });
  elements.clear.addEventListener("click",()=>{
    if (!window.confirm("Limpar o histórico e os registros desta prévia neste dispositivo?"))return;
    state={messages:[],records:[]};pending.clear();
    elements.pending.replaceChildren();elements.messages.replaceChildren();
    persist();
    bubble("assistant",Core.messageForTone(tone,"welcome"),"Histórico reiniciado");
  });

  elements.modeLabel.textContent=demo?"Demonstração local":"Prévia vinculada à conta";
  elements.notice.textContent=demo?
    "Modo demonstração: use dados fictícios. Nenhum registro será enviado ao servidor.":"Esta versão salva os registros do assistente somente neste dispositivo. Ainda não os envia para os módulos do Fluir.";
  elements.ai.disabled=demo;
  if(demo)elements.ai.closest("label").title="A IA externa requer uma conta autenticada e uma chave configurada no servidor.";
  elements.login.hidden=!demo;
  elements.tone.value=tone;
  elements.welcome.textContent=demo?"Teste o tom, os três modos e os registros guiados antes de conectar contas reais.":"Conte o que precisa. Vou seguir suas preferências do onboarding e pedir confirmação antes de registrar.";
  showModules();
  updateMode();
  if(state.messages.length){
    for(const entry of state.messages.slice(-70))bubble(entry.role,entry.text,entry.source,false);
  } else bubble("assistant",Core.messageForTone(tone,"welcome"),"Prévia do assistente");
})();
