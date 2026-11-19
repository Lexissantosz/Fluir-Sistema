/* FLUIR — EXPLORADOR DEMONSTRATIVO
 * A estrutura e os modais vêm do HTML oficial de cada módulo.
 * Scripts de produção nunca são executados nesta página.
 * Dados existem somente em memória e nunca são enviados/salvos.
 */
(() => {
  "use strict";

  const params = new URLSearchParams(location.search);
  const permitted = [
    "timeline", "tasks", "habits", "sleep", "water", "finances",
    "diary", "nutrition", "physicalHealth", "menstrualCycle",
    "attachments", "achievements"
  ];
  const sections = window.FluirSections?.getAll().filter((section) =>
    permitted.includes(section.key)
  ) || [];
  const key = permitted.includes(params.get("module")) ? params.get("module") : "tasks";
  const section = sections.find((item) => item.key === key);
  const theme = params.get("theme") === "dark" ? "dark" : "light";
  const iconFiles = {
    timeline:"history", tasks:"list-check", habits:"repeat-2",
    sleep:"moon-star", water:"droplets", finances:"wallet",
    diary:"notebook-pen", nutrition:"apple", physicalHealth:"dumbbell",
    menstrualCycle:"calendar-heart", attachments:"paperclip",
    achievements:"trophy", dashboard:"layout-dashboard"
  };
  const pageUrl = (mod, selectedTheme = document.body.classList.contains("dark") ? "dark" : "light") =>
    "demo-module.html?module=" + encodeURIComponent(mod) + "&theme=" + selectedTheme;
  const dashboardUrl = () => "dashboard.html?demo=1&theme=" +
    (document.body.classList.contains("dark") ? "dark" : "light");
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const currency = (n) => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

  const entries = {
    tasks: [
      ["Planejar o dia", "Rotina · 08:00", "Concluída", "completed"],
      ["Revisar conteúdo da aula", "Estudos · 10:00", "Concluída", "completed"],
      ["Beber 1,5 L de água", "Saúde · 13:00", "Concluída", "completed"],
      ["Praticar atividade física", "Saúde · 17:30", "Pendente", "pending high"],
      ["Ler por 20 minutos", "Pessoal · 20:00", "Pendente", "pending"]
    ],
    habits: [
      ["Meditar por 10 minutos", "Sequência de 7 dias · Saúde", "Concluído", "completed highStreak"],
      ["Ler diariamente", "Sequência de 5 dias · Estudos", "Concluído", "completed"],
      ["Caminhar 30 minutos", "Sequência de 3 dias · Saúde", "Pendente", "pending"],
      ["Organizar a mochila", "Sequência de 4 dias · Rotina", "Pendente", "pending"]
    ],
    sleep: [
      ["Sono noturno", "22:30 às 06:10 · Boa qualidade", "7h40", "all"],
      ["Sono noturno", "23:00 às 06:45 · Boa qualidade", "7h45", "all"],
      ["Sono noturno", "22:10 às 06:20 · Excelente", "8h10", "all"],
      ["Descanso curto", "14:00 às 14:25 · Relaxante", "25min", "all"]
    ],
    water: [
      ["Primeiro copo", "08:00 · 250 ml", "Registrado", "all"],
      ["Após o café da manhã", "10:20 · 250 ml", "Registrado", "all"],
      ["Meio-dia", "12:00 · 500 ml", "Registrado", "all"],
      ["Durante a tarde", "15:00 · 500 ml", "Registrado", "all"]
    ],
    finances: [
      ["Bolsa de estudos", "Entrada fixa · Hoje", "+ " + currency(1000), "income fixed"],
      ["Trabalho eventual", "Entrada variável · Ontem", "+ " + currency(200), "income variable"],
      ["Compras de mercado", "Saída variável · Hoje", "- " + currency(280), "expense variable"],
      ["Transporte", "Saída variável · Ontem", "- " + currency(100), "expense variable"],
      ["Conta de internet", "Saída fixa · Esta semana", "- " + currency(150), "expense fixed"],
      ["Materiais de estudo", "Saída variável · Esta semana", "- " + currency(350), "expense variable"]
    ],
    diary: [
      ["Dia produtivo", "Hoje · Humor leve", "Consegui organizar as prioridades e reservar um tempo para mim.", "positive today"],
      ["Uma pausa necessária", "Ontem · Humor neutro", "Fiz uma caminhada e procurei descansar mais cedo.", "neutral"],
      ["Novos aprendizados", "Esta semana · Humor leve", "Gostei de perceber meu progresso nos estudos.", "positive"],
      ["Dia cheio", "Esta semana · Humor intenso", "Tive muitas tarefas, mas consegui definir minhas prioridades.", "heavy"]
    ],
    nutrition: [
      ["Café da manhã", "08:00 · Frutas, pão e ovos", "Equilibrada", "breakfast today"],
      ["Almoço", "12:30 · Arroz, feijão e legumes", "Equilibrada", "lunch today"],
      ["Lanche", "16:00 · Iogurte e banana", "Leve", "snack today"],
      ["Jantar", "19:30 · Sopa com legumes", "Planejada", "dinner"]
    ],
    physicalHealth: [
      ["Caminhada", "Ontem · 30 minutos", "Concluída", "training"],
      ["Treino funcional", "Esta semana · 40 minutos", "Concluído", "training"],
      ["Acompanhamento de energia", "Hoje · Disposição boa", "Registrado", "body today"],
      ["Descanso", "Esta semana · Recuperação", "Sem sintomas", "symptom"]
    ],
    menstrualCycle: [
      ["Acompanhamento de ciclo", "Registro fictício · 5 dias", "Finalizado", "period"],
      ["Bem-estar", "Registro fictício · Ontem", "Energia regular", "mood"],
      ["Sintoma leve", "Registro fictício · Esta semana", "Observado", "symptom"]
    ],
    attachments: [
      ["Cronograma de estudos.pdf", "Arquivo · Estudos", "PDF", "file"],
      ["Referência de pesquisa", "Link · Projetos", "Link", "link"],
      ["Imagem de inspiração", "Imagem · Pessoal", "PNG", "image"],
      ["Lista de materiais", "Nota · Organização", "Texto", "note"]
    ],
    timeline: [
      ["Tarefa concluída", "08:30 · Organização do dia", "Finalizada", "tasks"],
      ["Hábito registrado", "09:15 · Meditação", "Concluído", "habits"],
      ["Hidratação", "13:00 · Consumo de 500 ml", "Registrada", "health"],
      ["Lançamento financeiro", "15:00 · Mercado", "- " + currency(280), "finances"],
      ["Reflexão do dia", "19:30 · Diário emocional", "Registrada", "diary"],
      ["Material anexado", "20:10 · Estudos", "Anexado", "attachments"]
    ],
    achievements: [
      ["O primeiro passo", "Concluir o primeiro registro", "Conquistada", "unlocked tasks"],
      ["Rotina em movimento", "Concluir cinco tarefas", "Conquistada", "unlocked tasks"],
      ["Constância diária", "Registrar hábitos por sete dias", "Conquistada", "unlocked habits"],
      ["Hidratação consciente", "Alcançar a meta de água", "Em andamento", "locked water"],
      ["Bons sonhos", "Acompanhar sete noites de sono", "Em andamento", "locked sleep"],
      ["Organização financeira", "Registrar entradas e despesas", "Conquistada", "unlocked finances"],
      ["Autoconhecimento", "Registrar emoções por três dias", "Em andamento", "locked diary"],
      ["Crescer aos poucos", "Manter a rotina por um mês", "Em andamento", "locked habits"]
    ]
  };

  const summaryValues = {
    tasks: ["5","3","2","1"],
    habits: ["4","2","7 dias","50%"],
    sleep: ["7h40","7h52","8h","4"],
    water: ["1.500 ml","75%","500 ml","1.650 ml"],
    finances: [currency(320),currency(1200),currency(880),"73%"],
    diary: ["4","2","1","3"],
    nutrition: ["4","3","1","75%"],
    physicalHealth: ["4","2","1","75%"],
    menstrualCycle: ["3","1","1","7 dias"],
    attachments: ["4","2","1","Estudos"],
    timeline: ["6","3","2","1"],
    achievements: ["8","4","50%","Hidratação"]
  };
  let currentFilter = "all";
  let activeModal = null;
  let previousFocus = null;

  function setTheme(next) {
    document.body.classList.toggle("dark",next === "dark");
    $$("#demoThemeButton").forEach((button) => {
      button.textContent = next === "dark" ? "☀" : "☾";
      button.setAttribute("aria-label",next === "dark" ? "Ativar tema claro" : "Ativar tema escuro");
      button.title = next === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
    });
    // Apenas em memória: a URL transporta a escolha entre páginas demonstrativas.
    $$(".demo-nav-link").forEach((link) => {
      if (link.dataset.dashboard === "true") {
        link.href = "dashboard.html?demo=1&theme=" + next;
      } else if (link.dataset.module) {
        link.href = pageUrl(link.dataset.module,next);
      }
    });
  }

  function gate(message) {
    closeForm();
    const overlay = $("#demoGate");
    if (!overlay) return;
    $("#demoGateMessage").textContent = message ||
      "Você não pode adicionar aqui, pois é apenas uma demonstração. Quer criar sua conta?";
    overlay.hidden = false;
    document.body.classList.add("demo-gate-open");
    $("#demoGateClose")?.focus();
  }
  function closeGate() {
    $("#demoGate").hidden = true;
    document.body.classList.remove("demo-gate-open");
  }

  function addBanner(main) {
    const banner = document.createElement("div");
    banner.className = "demo-banner";
    banner.innerHTML = [
      "<div><strong>Explorando o Fluir</strong>",
      "<small>Dados fictícios · Somente visualização · Nenhum cadastro necessário</small></div>",
      '<div class="demo-banner-actions">',
      '<button type="button" class="demo-theme-toggle" id="demoThemeButton" aria-label="Trocar tema" title="Trocar tema">☾</button>',
      '<a class="demo-back-dashboard demo-nav-link" data-dashboard="true" href="dashboard.html?demo=1">Dashboard</a>',
      "</div>"
    ].join("");
    main.prepend(banner);
    $("#demoThemeButton").addEventListener("click", () => {
      setTheme(document.body.classList.contains("dark") ? "light" : "dark");
    });
  }

  function injectNavigation() {
    const sidebar = $(".sidebar[data-shared-sidebar]");
    if (!sidebar) return;
    const label = (s) => s.label;
    const nav = document.createElement("nav");
    nav.className = "sidebar-nav";
    nav.setAttribute("aria-label","Navegação da demonstração");
    const makeLink = (k,name,url,icon,active) => {
      const a = document.createElement("a");
      a.href = url;
      a.className = "nav-item demo-nav-link" + (active ? " active" : "");
      a.dataset.section = k;
      if (k !== "dashboard") a.dataset.module = k;
      else a.dataset.dashboard = "true";
      if (active) a.setAttribute("aria-current","page");
      const span = document.createElement("span");
      span.setAttribute("aria-hidden","true");
      span.style.setProperty("--icon", 'url("../Assets/icons/navigation/' + icon + '.svg")');
      a.append(span,document.createTextNode(name));
      return a;
    };
    nav.append(makeLink("dashboard","Dashboard",dashboardUrl(),"layout-dashboard",false));
    sections.forEach((s) => nav.append(makeLink(s.key,label(s),pageUrl(s.key),iconFiles[s.key],s.key === key)));
    const brand = document.createElement("div");
    brand.className = "brand";
    brand.innerHTML = '<div class="brand-icon"><img src="../Assets/brand/fluir-symbol.svg" alt="" class="brand-symbol"></div><div><h1>Fluir</h1><p>Sistema de Organização da Vida</p></div>';
    sidebar.prepend(brand,nav);
    const ill = document.createElement("div");
    ill.className = "sidebar-illustration";
    ill.setAttribute("aria-hidden","true");
    ill.innerHTML = '<div class="rain rain-1"></div><div class="rain rain-2"></div><div class="rain rain-3"></div><div class="small-character"><div class="small-umbrella"></div><div class="small-head"><span></span><span></span></div><div class="small-body"></div></div><p>“Pequenas ações constantes constroem mudanças profundas.”</p>';
    nav.after(ill);
    const focus = sidebar.querySelector("[data-sidebar-context]");
    const strong = focus?.querySelector("strong");
    if (strong) strong.textContent = "60%";
    const bar = focus?.querySelector(".focus-bar span");
    if (bar) bar.style.width = "60%";
  }

  function populateSummary() {
    const values = summaryValues[key] || [];
    const cards = $$("main :is(.tasks-summary,.habits-summary,.sleep-summary,.water-summary,.finances-summary,.diary-summary,.nutrition-summary,.health-summary,.cycle-summary,.attachments-summary,.achievement-summary) > article");
    cards.slice(0,4).forEach((card,index) => {
      const strong = card.querySelector("strong");
      if (strong && values[index]) strong.textContent = values[index];
    });
    const circle = $("#waterCircleText");
    if (circle) circle.textContent = "75%";
    const sub = $("#waterCircleSubtext");
    if (sub) sub.textContent = "1500 de 2000 ml";
    const goal = $("#goalText");
    if (goal) goal.textContent = "Meta diária demonstrativa: 2.000 ml.";
    const waterSubtitle = $("#waterSubtitle");
    if (waterSubtitle) waterSubtitle.textContent = "Exemplo: seis copos de 250 ml registrados hoje.";
    const cup = $("#cupsArea");
    if (cup) {
      cup.replaceChildren();
      for(let i=0;i<8;i++) {
        const item=document.createElement("span");
        item.className = "demo-cup" + (i<6 ? " filled" : "");
        item.textContent = i<6 ? "●" : "○";
        item.title = i<6 ? "250 ml registrados" : "250 ml restantes";
        cup.appendChild(item);
      }
    }
    const title = $("#welcomeTitle");
    if(title) title.textContent = "Olá, Visitante";
  }


  // Registros que reproduzem a estrutura dos cards originais de cada módulo.
  // Os eventos de edição são interceptados antes de qualquer alteração.
  function originalStyleCard(row,index) {
    if(!["tasks","habits","finances","sleep"].includes(key))return null;
    const article=document.createElement("article");
    article.className=({
      tasks:"task-card",habits:"habit-card",
      finances:"transaction-card",sleep:"sleep-card"
    })[key]+" demo-real-card";
    article.dataset.filter=row[3]||"all";
    const action=(label,title)=>{
      const button=document.createElement("button");
      button.type="button";
      button.title=title;
      button.textContent=label;
      button.addEventListener("click",(event)=>{
        event.stopPropagation();
        gate("Você não pode alterar registros aqui, pois é apenas uma demonstração. Quer criar sua conta?");
      });
      return button;
    };
    if(key==="tasks") {
      const check=document.createElement("input");
      check.type="checkbox";
      check.checked=row[2]==="Concluída";
      check.setAttribute("aria-label","Marcar tarefa como concluída");
      check.addEventListener("click",(event)=>{
        event.preventDefault();
        gate("Você não pode concluir tarefas nesta demonstração. Quer criar sua conta?");
      });
      const info=document.createElement("div");
      info.className="task-info";
      const name=document.createElement("strong");name.textContent=row[0];
      const desc=document.createElement("p");
      desc.textContent=check.checked?"Tarefa ilustrativa concluída.":"Tarefa ilustrativa pendente.";
      const meta=document.createElement("div");meta.className="task-meta";
      [row[1].split(" · ")[0],row[3]?.includes("high")?"Alta prioridade":"Prioridade normal",row[1].split(" · ")[1]||"Hoje"].forEach((v)=>{
        const span=document.createElement("span");span.textContent=v;meta.append(span);
      });
      info.append(name,desc,meta);
      const actions=document.createElement("div");actions.className="task-actions";
      const del=action("×","Excluir tarefa");del.className="task-action-btn delete-task-btn";
      actions.append(del);
      article.classList.toggle("completed",check.checked);
      article.append(check,info,actions);
    }
    if(key==="habits") {
      const check=action(row[2]==="Concluído"?"✓":"○","Marcar hábito de hoje");
      check.className="habit-check";
      const info=document.createElement("div");info.className="habit-info";
      const name=document.createElement("strong");name.textContent=row[0];
      const desc=document.createElement("p");desc.textContent="Hábito diário demonstrativo";
      const meta=document.createElement("div");meta.className="habit-meta";
      ["Saúde e bem-estar","5/7 na semana",row[1].split(" · ")[0]].forEach((v)=>{
        const span=document.createElement("span");span.textContent=v;meta.append(span);
      });
      const week=document.createElement("div");week.className="habit-week";
      ["✓","✓","✓","✓","✓","○","○"].forEach((v)=>{
        const dot=document.createElement("span");dot.textContent=v;if(v==="✓")dot.className="done";week.append(dot);
      });
      info.append(name,desc,meta,week);
      const actions=document.createElement("div");actions.className="habit-actions";
      const del=action("×","Excluir hábito");del.className="habit-action-btn delete-habit-btn";
      actions.append(del);
      article.classList.toggle("completed-today",row[2]==="Concluído");
      article.append(check,info,actions);
    }
    if(key==="finances") {
      const income=row[3].includes("income");
      const icon=document.createElement("div");
      icon.className="transaction-icon";icon.textContent=income?"+":"−";
      const info=document.createElement("div");info.className="transaction-info";
      const name=document.createElement("strong");name.textContent=row[0];
      const desc=document.createElement("p");desc.textContent="Lançamento fictício · "+row[1].split(" · ").pop();
      const meta=document.createElement("div");meta.className="transaction-meta";
      [income?"Entrada":"Saída",row[3].includes("fixed")?"Fixo":"Variável"].forEach((v)=>{
        const span=document.createElement("span");span.textContent=v;meta.append(span);
      });
      info.append(name,desc,meta);
      const amount=document.createElement("strong");
      amount.className="transaction-value "+(income?"income":"expense");
      amount.textContent=row[2];
      const actions=document.createElement("div");actions.className="transaction-actions";
      const del=action("×","Excluir lançamento");del.className="transaction-action-btn delete-transaction-btn";
      actions.append(del);
      article.append(icon,info,amount,actions);
    }
    if(key==="sleep") {
      const icon=document.createElement("div");
      icon.className="sleep-icon";icon.textContent="☾";
      const info=document.createElement("div");info.className="sleep-info";
      const head=document.createElement("div");head.className="sleep-card-header";
      const duration=document.createElement("strong");duration.textContent=row[2];
      const when=document.createElement("span");when.textContent="Registro de exemplo";
      head.append(duration,when);
      const note=document.createElement("p");note.textContent="Descanso registrado com qualidade.";
      const meta=document.createElement("div");meta.className="sleep-meta";
      ["Sono principal",row[1],"Qualidade boa"].forEach((v)=>{
        const label=document.createElement("span");label.textContent=v;meta.append(label);
      });
      info.append(head,note,meta);
      const del=action("×","Excluir registro de sono");
      del.className="sleep-action-btn delete-sleep-btn";
      article.append(icon,info,del);
    }
    return article;
  }

  function cardFor(row,index) {
    const card=document.createElement("article");
    card.className="demo-record";
    card.dataset.filter = row[3] || "all";
    const mark=document.createElement("span");
    mark.className="demo-record-marker";
    mark.textContent = ["✓","◌","☾","◉","$","✎","☷","♡"][index%8];
    const content=document.createElement("div");
    content.className="demo-record-main";
    const title=document.createElement("strong");
    title.textContent=row[0];
    const description=document.createElement("p");
    description.textContent=row[1];
    const detail=document.createElement("small");
    detail.textContent="Informação ilustrativa do Fluir";
    content.append(title,description,detail);
    const tag=document.createElement("span");
    tag.className="demo-record-tag";
    tag.textContent=row[2];
    card.append(mark,content,tag);
    if(key==="achievements") {
      card.tabIndex=0;
      card.setAttribute("role","button");
      card.setAttribute("aria-label","Visualizar conquista "+row[0]);
      card.addEventListener("click",()=>showAchievement(row));
      card.addEventListener("keydown",(event)=>{
        if(event.key==="Enter"||event.key===" ") {
          event.preventDefault();
          showAchievement(row);
        }
      });
    }
    return card;
  }

  function populateRecords() {
    const selectors = {
      tasks:"#taskList", habits:"#habitList", sleep:"#sleepList",
      finances:"#transactionList", diary:"#entryList", nutrition:"#mealList",
      physicalHealth:"#healthList", menstrualCycle:"#cycleList",
      attachments:"#attachmentList", achievements:"#achievementsGrid",
      timeline:".timeline-panel .event-list",
      water:"#waterMiniTimeline"
    };
    const target=$(selectors[key]);
    if(key==="timeline") {
      // O HTML original possui exemplos fixos com datas antigas.
      // Mantemos apenas registros atuais e inteiramente fictícios.
      $$(".timeline-day").forEach((day,index) => {
        if(index>0)day.remove();
        else {
          const title=day.querySelector("h4");
          if(title)title.textContent="Exemplos de hoje";
        }
      });
    }
    if(target) {
      target.replaceChildren();
      (entries[key]||[]).forEach((row,index)=>target.append(originalStyleCard(row,index)||cardFor(row,index)));
      target.classList.add("demo-populated");
    }
    const featured=$("#featuredTitle");
    if(featured) featured.textContent="O primeiro passo";
    const featuredText=$("#featuredText");
    if(featuredText) featuredText.textContent="A primeira conquista de uma rotina bem organizada.";
    // Substitui painéis originalmente dinâmicos por amostras consistentes.
    [
      "#focusMiniList","#habitMiniTimeline","#taskMiniTimeline","#sleepMiniTimeline",
      "#waterMiniTimeline","#financeMiniTimeline","#diaryMiniTimeline",
      "#nutritionMiniTimeline","#healthMiniTimeline","#cycleMiniTimeline",
      "#attachmentMiniTimeline","#categoryList","#reminderList",
      "#overdueRemindersList"
    ].forEach((selector)=>{
      const el=$(selector);
      if(!el) return;
      el.replaceChildren();
      const sample=(entries[key]||[]).slice(0,3);
      sample.forEach((row)=>{
        const mini=document.createElement("div");
        mini.className="demo-mini-record";
        const title=document.createElement("strong"); title.textContent=row[0];
        const desc=document.createElement("span"); desc.textContent=row[2];
        mini.append(title,desc);
        el.appendChild(mini);
      });
    });
    $$(":is(.week-grid,.habit-table) span[id^='day']").forEach((el,index)=>{
      el.textContent=index<5?"●":"○";
    });
    const empty=$("#emptyState");
    if(empty)empty.hidden=true;
  }

  function filterRecords(filter) {
    currentFilter=filter||"all";
    const records=$$(".demo-populated .demo-record, .demo-populated .demo-real-card");
    const normalized = currentFilter;
    records.forEach((record)=>{
      const tags=(record.dataset.filter||"").split(" ");
      const match=normalized==="all" ||
        (normalized==="today" && tags.includes("today")) ||
        (normalized==="overdue" && tags.includes("pending")) ||
        (normalized==="high" && tags.includes("high")) ||
        tags.includes(normalized);
      record.hidden=!match;
    });
    $$(".filters-area .filter-btn,.achievement-filters .filter-btn").forEach((button)=>{
      button.classList.toggle("active",(button.dataset.filter||"all")===normalized);
    });
    const subtitle=$("[id$='Subtitle']");
    if(subtitle && records.length) subtitle.textContent="Prévia com informações fictícias do Fluir.";
  }

  function findModal() {
    const ids={
      tasks:"#taskModal",habits:"#habitModal",sleep:"#sleepModal",
      water:"#waterGoalModal",finances:"#financeModal",diary:"#diaryModal",
      nutrition:"#nutritionModal",physicalHealth:"#healthModal",
      menstrualCycle:"#cycleModal",attachments:"#attachmentModal",
      timeline:"#eventModal",achievements:"#achievementModal"
    };
    return $(ids[key]);
  }
  function openForm() {
    const modal=findModal();
    if(!modal) {gate();return;}
    previousFocus=document.activeElement;
    activeModal=modal;
    modal.classList.add("demo-modal-visible");
    modal.removeAttribute("hidden");
    modal.style.display="flex";
    const content=modal.querySelector(
      ".task-modal,.habit-modal,.sleep-modal,.water-modal,.finance-modal,.diary-modal,.nutrition-modal,.health-modal,.cycle-modal,.attachment-modal,.event-modal,.achievement-modal-content"
    );
    if(content && !content.querySelector(".demo-form-lock")){
      const note=document.createElement("p");
      note.className="demo-form-lock";
      note.textContent="Prévia do formulário real. Você pode conhecer os campos, mas não salvar dados nesta demonstração.";
      content.appendChild(note);
    }
    modal.querySelector("input,select,textarea,button")?.focus();
  }
  function closeForm(){
    if(!activeModal)return;
    activeModal.classList.remove("demo-modal-visible");
    activeModal.style.removeProperty("display");
    activeModal=null;
    previousFocus?.focus?.();
    previousFocus=null;
  }
  function showAchievement(row) {
    const modal=findModal();
    if(!modal) return;
    const title=$("#modalTitle"); if(title)title.textContent=row[0];
    const description=$("#modalDescription"); if(description)description.textContent=row[1];
    const symbol=$("#modalSymbol");if(symbol)symbol.textContent=row[2]==="Conquistada"?"★":"✧";
    openForm();
  }

  function isCreateButton(button) {
    if(button.matches(".primary-btn,.wide-btn,.empty-state-btn,.small-btn")) {
      const id=(button.id||"").toLowerCase();
      const name=(button.textContent||"").trim().toLowerCase();
      return /(new|add|quick|open.*modal)/i.test(id) ||
        /^(nova|novo|registrar|adicionar|salvar anexo|editar meta|alterar meta)/i.test(name);
    }
    return false;
  }
  function isDestructive(button) {
    const id=(button.id||"").toLowerCase();
    const label=(button.textContent||"").trim().toLowerCase();
    return /(save|delete|remove|reset|clear|confirm|finish|submit)/i.test(id) ||
      /^(salvar|excluir|remover|limpar|reiniciar|concluir|confirmar|finalizar|registrar)/i.test(label);
  }
  function handleInteractions(event) {
    const target=event.target;
    const filter=target.closest?.(".filters-area .filter-btn,.achievement-filters .filter-btn,.period-option");
    if(filter) {
      event.preventDefault();
      const f=filter.dataset.filter||"all";
      filterRecords(f);
      return;
    }
    const button=target.closest?.("button");
    if(!button)return;
    if(button.closest("#demoGate"))return;
    if(button.closest(".mobile-topbar,.mobile-bottom-nav,.mobile-drawer-overlay"))return;
    if(button.id==="demoThemeButton")return;
    if(button.closest(".demo-modal-visible")) {
      event.preventDefault();
      if(isDestructive(button) || button.type==="submit" || /^(salvar|adicionar)/i.test(button.textContent.trim())) {
        gate("Você não pode adicionar ou alterar registros aqui, pois é apenas uma demonstração. Quer criar sua conta?");
      } else if (/^(cancelar|fechar|voltar)/i.test(button.textContent.trim()) ||
                 /close/i.test(button.id)) {
        closeForm();
      } else {
        // Os outros botões de formulário servem apenas para exibir seus campos.
      }
      return;
    }
    if(key==="water" &&
       (button.matches("[data-water-amount]") ||
        /^(addCup|removeCup|resetWater)/.test(button.id))) {
      event.preventDefault();
      gate("Você não pode adicionar ou retirar água aqui, pois é apenas uma demonstração. Quer criar sua conta?");
      return;
    }
    if(isCreateButton(button)) {
      event.preventDefault();
      openForm();
      return;
    }
    if(isDestructive(button)) {
      event.preventDefault();
      gate("Essa ação só está disponível depois de criar uma conta no Fluir. Quer começar agora?");
      return;
    }
    const label=(button.textContent||"").trim().toLowerCase();
    if(label.includes("ver todos")||label.includes("ver mais")) {
      event.preventDefault();
      $(".demo-populated")?.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }

  function setupMobileNavigation(){
    const nav=[
      ["dashboard","Início","dashboard.html?demo=1","layout-dashboard"],
      ["timeline","Timeline",pageUrl("timeline"),"history"],
      ["tasks","Tarefas",pageUrl("tasks"),"list-check"],
      ["habits","Hábitos",pageUrl("habits"),"repeat-2"]
    ];
    const top=document.createElement("header");
    top.className="mobile-topbar";
    top.innerHTML='<a class="mobile-brand demo-nav-link" data-dashboard="true" href="'+dashboardUrl()+'"><span class="mobile-brand-icon"><img src="../Assets/brand/fluir-symbol.svg" alt=""></span><span class="mobile-brand-meta"><strong>Fluir</strong><span class="mobile-brand-subtitle">Modo demonstração</span></span></a><button class="mobile-menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false"></button>';
    document.body.prepend(top);
    const overlay=document.createElement("div");
    overlay.className="mobile-drawer-overlay";
    overlay.innerHTML='<aside class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Módulos do Fluir"><div class="mobile-drawer-head"><div><strong>Explorar módulos</strong><span>Dados fictícios e somente leitura</span></div><button class="mobile-drawer-close" aria-label="Fechar menu" type="button"></button></div><nav class="mobile-drawer-nav"></nav></aside>';
    const list=overlay.querySelector(".mobile-drawer-nav");
    nav.slice(0,1).concat(sections.map((s)=>[s.key,s.label,pageUrl(s.key),iconFiles[s.key]])).forEach((item)=>{
      const a=document.createElement("a");
      a.className="mobile-drawer-link demo-nav-link"+(item[0]===key?" active":"");
      a.href=item[2];
      a.dataset.module=item[0]==="dashboard"?"":item[0];
      if(item[0]==="dashboard")a.dataset.dashboard="true";
      const icon=document.createElement("i");
      icon.setAttribute("aria-hidden","true");
      icon.style.setProperty("--icon",'url("../Assets/icons/navigation/'+item[3]+'.svg")');
      const label=document.createElement("span");label.textContent=item[1];
      a.append(icon,label);
      list.append(a);
    });
    document.body.append(overlay);
    const bottom=document.createElement("nav");
    bottom.className="mobile-bottom-nav";
    bottom.setAttribute("aria-label","Navegação da demonstração");
    nav.forEach((item)=>{
      const a=document.createElement("a");
      a.className="mobile-nav-link demo-nav-link"+(item[0]===key?" active":"");
      a.href=item[0]==="dashboard"?dashboardUrl():pageUrl(item[0]);
      if(item[0]==="dashboard")a.dataset.dashboard="true";
      else a.dataset.module=item[0];
      const icon=document.createElement("i");
      icon.setAttribute("aria-hidden","true");
      icon.style.setProperty("--icon",'url("../Assets/icons/navigation/'+item[3]+'.svg")');
      const label=document.createElement("span");label.textContent=item[1];
      a.append(icon,label);
      bottom.appendChild(a);
    });
    const more=document.createElement("button");
    more.type="button";
    more.className="mobile-more-btn";
    more.innerHTML="<i></i><span>Mais</span>";
    bottom.appendChild(more);
    document.body.appendChild(bottom);
    const menu=top.querySelector(".mobile-menu-btn");
    const open=()=>{document.body.classList.add("mobile-drawer-open");menu.setAttribute("aria-expanded","true");};
    const close=()=>{document.body.classList.remove("mobile-drawer-open");menu.setAttribute("aria-expanded","false");};
    menu.addEventListener("click",()=>document.body.classList.contains("mobile-drawer-open")?close():open());
    more.addEventListener("click",open);
    overlay.addEventListener("click",(event)=>{if(event.target===overlay)close();});
    overlay.querySelector(".mobile-drawer-close").addEventListener("click",close);
    document.body.classList.add("mobile-ui-ready");
    document.addEventListener("keydown",(event)=>{if(event.key==="Escape")close();});
  }

  function setupEvents() {
    document.addEventListener("click",handleInteractions);
    document.addEventListener("submit",(event)=>{
      event.preventDefault();
      gate("Você não pode adicionar aqui, pois é apenas uma demonstração. Quer criar sua conta?");
    },true);
    $("#demoGateClose").addEventListener("click",closeGate);
    $("#demoGate").addEventListener("click",(event)=>{
      if(event.target===$("#demoGate"))closeGate();
    });
    document.addEventListener("keydown",(event)=>{
      if(event.key==="Escape") {
        if(!$("#demoGate").hidden)closeGate();
        else closeForm();
      }
    });
    // Nenhum campo demonstração deve disparar upload ou modificar o navegador.
    $$("input[type='file']").forEach((input)=>{input.disabled=true;});
  }

  async function mount() {
    if(!section) throw new Error("Módulo não encontrado");
    const response=await fetch(section.href,{cache:"no-store",credentials:"omit"});
    if(!response.ok)throw new Error("Falha ao carregar interface do módulo: "+response.status);
    const source=new DOMParser().parseFromString(await response.text(),"text/html");
    const main=source.querySelector("main");
    if(!main)throw new Error("A página do módulo não tem elemento main");
    // Nada de scripts / iframes / fontes de dados ativos do projeto real.
    main.querySelectorAll("script,iframe,object,embed").forEach((element)=>element.remove());
    main.querySelectorAll("[onload],[onclick],[onchange],[onsubmit]").forEach((element)=>{
      [...element.attributes].forEach((a)=>{if(a.name.startsWith("on"))element.removeAttribute(a.name);});
    });
    // Formulários do módulo também ficam disponíveis para exploração.
    const modals=[...source.querySelectorAll("body > [id$='Modal'],body > [class*='modal-overlay'],body > [class*='modal-content']")];
    const mount=$("#demoMount");
    mount.replaceChildren(main);
    modals.forEach((modal)=>mount.appendChild(modal));
    $("#demoModuleStylesheet").href="../css/"+section.href.replace(".html",".css");
    document.title="Fluir | "+section.label+" · Demonstração";
    main.querySelectorAll(".header-actions,.notif-wrapper,.profile-wrapper").forEach((node)=>node.remove());
    $$("input[type='file']").forEach((node)=>node.disabled=true);
    injectNavigation();
    // Links originais dos HTMLs nunca podem abrir uma área autenticada.
    // Só os módulos permitidos recebem rotas do explorador demonstrativo.
    const pageToKey = new Map(sections.map((item) => [item.href, item.key]));
    $$("#demoMount a[href]").forEach((link) => {
      if (link.classList.contains("demo-nav-link")) return;
      const raw = link.getAttribute("href") || "";
      const destination = raw.split("?")[0].split("#")[0];
      if (pageToKey.has(destination)) {
        const moduleKey = pageToKey.get(destination);
        link.href = pageUrl(moduleKey);
        link.classList.add("demo-nav-link");
        link.dataset.module = moduleKey;
      } else if (destination === "dashboard.html") {
        link.href = dashboardUrl();
        link.classList.add("demo-nav-link");
        link.dataset.dashboard = "true";
      } else if (!raw.startsWith("#")) {
        link.removeAttribute("href");
        link.tabIndex = 0;
        link.setAttribute("role", "button");
        link.title = "Disponível depois de criar uma conta";
        link.addEventListener("click", (event) => {
          event.preventDefault();
          gate("Esta funcionalidade fica disponível após criar sua conta no Fluir. Quer começar agora?");
        });
        link.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            gate("Esta funcionalidade fica disponível após criar sua conta no Fluir. Quer começar agora?");
          }
        });
      }
    });
    const content=main.querySelector("[class$='-main']") || main;
    addBanner(content);
    populateSummary();
    populateRecords();
    setupMobileNavigation();
    setupEvents();
    setTheme(theme);
    if(params.get("open")==="1")openForm();
    // Identifica de forma honesta os dados demonstrativos.
    document.body.dataset.demoModule=key;
    console.info("Fluir: explorador visual isolado, módulo",key);
  }

  mount().catch((error)=>{
    console.error("Erro ao preparar demonstração:",error);
    const area=$("#demoMount");
    area.textContent="";
    const main=document.createElement("main");
    main.className="demo-loading";
    main.innerHTML='<div class="demo-loading-card"><strong>Não foi possível abrir este módulo.</strong><p>Verifique o servidor local e tente novamente.</p><a href="dashboard.html?demo=1">Voltar ao Dashboard</a></div>';
    area.appendChild(main);
  });
})();
