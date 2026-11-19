/* FLUIR — DASHBOARD DEMONSTRATIVO
 * Interface do dashboard oficial com dados inteiramente fictícios.
 * Nenhum módulo autenticado ou script que persiste registros é carregado.
 */
(() => {
  "use strict";
  if(new URLSearchParams(location.search).get("demo")!=="1")return;
  const params=new URLSearchParams(location.search);
  const $=(s)=>document.querySelector(s);
  const $$=(s)=>[...document.querySelectorAll(s)];
  const icons={
    dashboard:"layout-dashboard",timeline:"history",tasks:"list-check",
    habits:"repeat-2",sleep:"moon-star",water:"droplets",
    finances:"wallet",diary:"notebook-pen",nutrition:"apple",
    physicalHealth:"dumbbell",menstrualCycle:"calendar-heart",
    attachments:"paperclip",achievements:"trophy"
  };
  const modules=window.FluirSections?.getAll().filter((s)=>icons[s.key]&&s.key!=="dashboard")||[];
  let currentTheme=params.get("theme")==="dark"?"dark":"light";
  const moduleUrl=(key,extra="")=>
    "demo-module.html?module="+encodeURIComponent(key)+"&theme="+currentTheme+extra;
  const dashboardUrl=()=> "dashboard.html?demo=1&theme="+currentTheme;

  function style(){
    const css=document.createElement("style");
    css.textContent=[
      "body.demo-mode .demo-banner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-bottom:20px;padding:15px 18px;border:1px solid var(--border);border-radius:18px;background:var(--input-bg);box-shadow:var(--shadow-soft);color:var(--text)}",
      "body.demo-mode .demo-banner strong{display:block;font-size:13px;font-weight:850}",
      "body.demo-mode .demo-banner small{display:block;margin-top:4px;color:var(--muted);font-size:12px}",
      "body.demo-mode .demo-banner-actions{display:flex;align-items:center;gap:9px;flex-wrap:wrap}",
      "body.demo-mode .demo-theme-toggle{display:grid;place-items:center;width:40px;height:40px;border:1px solid var(--border-strong);border-radius:50%;background:var(--card-bg);color:var(--text);font-size:21px;cursor:pointer}",
      "body.demo-mode .demo-exit{display:inline-flex;align-items:center;min-height:40px;padding:9px 14px;border:1px solid var(--border);border-radius:11px;background:var(--card-bg);color:var(--text);font-size:12px;font-weight:800;text-decoration:none}",
      "body.demo-mode .dashboard-main{min-width:0}",
      "body.demo-mode .summary-card{cursor:pointer}",
      "body.demo-mode .summary-card:hover{border-color:var(--border-strong)}",
      "body.demo-mode .task-item input{cursor:pointer}",
      "body.demo-mode .sidebar-nav .nav-item{cursor:pointer}",
      "body.demo-mode .demo-banner button:disabled{opacity:1}",
      "body.demo-mode .focus-card strong{font-variant-numeric:tabular-nums}",
      "body.demo-mode .demo-modal-overlay[hidden]{display:none!important}",
      "body.demo-mode .demo-modal-overlay{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.62);backdrop-filter:blur(5px)}",
      "body.demo-mode .demo-modal{max-width:460px;width:100%;padding:28px;border:1px solid var(--border);border-radius:22px;background:var(--bg);box-shadow:0 25px 80px rgba(0,0,0,.22);text-align:center}",
      "body.demo-mode .demo-modal h2{font-size:20px;margin-bottom:12px}",
      "body.demo-mode .demo-modal p{font-size:13px;line-height:1.65;color:var(--muted)}",
      "body.demo-mode .demo-modal-actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:center;margin-top:20px}",
      "body.demo-mode .demo-modal-actions>*{padding:11px 14px;border-radius:11px;border:1px solid var(--border-strong);font-size:12px;font-weight:800;background:var(--card-bg);color:var(--text)}",
      "body.demo-mode .demo-modal-actions a{background:var(--button-bg);color:var(--button-text)}",
      "@media(max-width:760px){body.demo-mode .demo-banner{padding:12px 14px}body.demo-mode .demo-banner-actions{width:100%}}"
    ].join("\n");
    document.head.appendChild(css);
  }

  function text(sel,value){const el=$(sel);if(el)el.textContent=value;}
  function card(key,value,subtitle,pct){
    const el=$('[data-module-card="'+key+'"]');
    if(!el)return;
    const strong=el.querySelector("strong"),small=el.querySelector("small"),bar=el.querySelector(".mini-progress span");
    if(strong)strong.textContent=value;
    if(small)small.textContent=subtitle;
    if(bar&&pct!=null)bar.style.width=pct+"%";
  }
  function theme(next){
    currentTheme=next;
    document.body.classList.toggle("dark",next==="dark");
    const button=$("#demoThemeButton");
    if(button){
      button.textContent=next==="dark"?"☀":"☾";
      button.title=next==="dark"?"Ativar tema claro":"Ativar tema escuro";
      button.setAttribute("aria-label",button.title);
    }
    $$(".demo-module-link").forEach((link)=>{
      link.href=moduleUrl(link.dataset.demoModule);
    });
    const url=new URL(location.href);
    url.searchParams.set("theme",next);
    history.replaceState(null,"",url);
  }

  function banner(){
    const main=$(".dashboard-main");if(!main)return;
    const div=document.createElement("div");
    div.className="demo-banner";
    div.innerHTML='<div><strong>Explorando o Fluir</strong><small>Dados fictícios · Navegação pelos módulos · Nenhuma alteração é salva</small></div><div class="demo-banner-actions"><button id="demoThemeButton" class="demo-theme-toggle" type="button" aria-label="Trocar tema">☾</button><a class="demo-exit" href="login.html">Criar conta / Entrar</a></div>';
    main.prepend(div);
    $("#demoThemeButton").addEventListener("click",()=>theme(currentTheme==="dark"?"light":"dark"));
    $(".header-actions")?.remove();
  }

  function sidebar(){
    const aside=$(".sidebar[data-shared-sidebar]");if(!aside)return;
    const brand=document.createElement("div");
    brand.className="brand";
    brand.innerHTML='<div class="brand-icon"><img src="../Assets/brand/fluir-symbol.svg" class="brand-symbol" alt=""></div><div><h1>Fluir</h1><p>Sistema de Organização da Vida</p></div>';
    const nav=document.createElement("nav");
    nav.className="sidebar-nav";
    nav.setAttribute("aria-label","Navegação dos módulos demonstrativos");
    const choices=[{key:"dashboard",label:"Dashboard"},...modules];
    choices.forEach((s)=>{
      const link=document.createElement("a");
      link.className="nav-item"+(s.key==="dashboard"?" active demo-dashboard-link":" demo-module-link");
      link.href=s.key==="dashboard"?"#summaryGrid":moduleUrl(s.key);
      link.dataset.demoModule=s.key==="dashboard"?"":s.key;
      link.dataset.section=s.key;
      if(s.key==="dashboard")link.setAttribute("aria-current","page");
      const icon=document.createElement("span");
      icon.setAttribute("aria-hidden","true");
      icon.style.setProperty("--icon",'url("../Assets/icons/navigation/'+icons[s.key]+'.svg")');
      link.append(icon,document.createTextNode(s.label));
      nav.appendChild(link);
    });
    aside.prepend(brand,nav);
    const ill=document.createElement("div");
    ill.className="sidebar-illustration";
    ill.setAttribute("aria-hidden","true");
    ill.innerHTML='<div class="rain rain-1"></div><div class="rain rain-2"></div><div class="rain rain-3"></div><div class="small-character"><div class="small-umbrella"></div><div class="small-head"><span></span><span></span></div><div class="small-body"></div></div><p>“Pequenas ações constantes constroem mudanças profundas.”</p>';
    nav.after(ill);
  }

  function data(){
    text("#welcomeTitle","Olá, Visitante");
    text("#welcomeSubtitle","Conheça uma rotina organizada e explore cada módulo do Fluir.");
    card("tasks","3","3 de 5 concluídas",60);
    card("habits","2","2 de 4 concluídos",50);
    card("sleep","7h40min","Meta de 8 horas");
    card("water","1500ml","de 2000ml");
    card("finances","R$ 320,00","Saldo de exemplo");
    card("diary","1","registro ilustrativo");
    text("#focusPercent","60%");
    const focus=$(".focus-bar span");if(focus)focus.style.width="60%";
    $$("[data-module-panel='sleep'] strong").forEach((el)=>el.textContent="7h40min");
    text('[data-module-panel="sleep"] p',"Meta de descanso: 8 horas");
    text('[data-module-panel="water"] strong',"1500ml");
    text('[data-module-panel="water"] p',"de 2000ml");
    text('[data-module-panel="finances"] strong',"R$ 320,00");
    text('[data-module-panel="diary"] p',"Hoje organizei minhas prioridades e descansei melhor.");
    const money=$('[data-module-panel="finances"]');
    const notes=money?.querySelectorAll("small")||[];
    if(notes[0])notes[0].textContent="Entrada R$ 1.200,00";
    if(notes[1])notes[1].textContent="Saída - R$ 880,00";
    $$(".water-dots").forEach((parent)=>{
      parent.querySelectorAll("span").forEach((dot,i)=>dot.classList.toggle("filled",i<6));
    });
    const list=$("#dashboardTaskList");
    if(list){
      const tasks=[
        ["Planejar o dia","Rotina","08:30",true],
        ["Revisar conteúdo da aula","Estudos","10:00",true],
        ["Beber água","Saúde","13:00",true],
        ["Fazer exercícios","Saúde","17:30",false],
        ["Ler por 20 minutos","Pessoal","20:00",false]
      ];
      list.replaceChildren();
      tasks.forEach((t)=>{
        const div=document.createElement("div");
        div.className="task-item"+(t[3]?" task-done":"");
        const checkbox=document.createElement("input");
        checkbox.type="checkbox";checkbox.checked=t[3];
        checkbox.setAttribute("aria-label",t[0]);
        checkbox.addEventListener("click",(event)=>{
          event.preventDefault();
          checkbox.checked=t[3];
          go("tasks","&open=1");
        });
        const title=document.createElement("span");title.textContent=t[0];
        const category=document.createElement("small");category.textContent=t[1];
        const time=document.createElement("time");time.textContent=t[2];
        div.append(checkbox,title,category,time);
        div.addEventListener("click",(event)=>{
          if(event.target===checkbox)return;
          go("tasks");
        });
        list.appendChild(div);
      });
    }
    const timeline=$(".timeline-list");
    if(timeline){
      timeline.replaceChildren();
      [
        ["08:30","Planejamento","Primeira tarefa concluída"],
        ["10:00","Estudos","Revisão realizada"],
        ["13:00","Hidratação","Consumo acumulado de 1500 ml"],
        ["17:30","Atividade física","Próxima tarefa programada"]
      ].forEach((t)=>{
        const item=document.createElement("div");item.className="timeline-item";
        const time=document.createElement("time");time.textContent=t[0];
        const desc=document.createElement("div");
        const title=document.createElement("strong");title.textContent=t[1];
        const note=document.createElement("p");note.textContent=t[2];
        desc.append(title,note);item.append(time,desc);timeline.append(item);
      });
    }
    const habits=$(".habits-panel");
    if(habits)habits.id="demoHabits";
    const events=$(".recent-events");
    if(events)events.id="demoEvents";
    const eventList=$(".recent-events .event-list");
    if(eventList){
      eventList.replaceChildren();
      [
        ["Hoje · 08:30","Tarefa concluída","Planejamento do dia"],
        ["Hoje · 10:00","Estudos realizados","Revisão da aula"],
        ["Hoje · 13:00","Água registrada","Meta diária em 75%"],
        ["Ontem · 22:30","Sono registrado","7 horas e 40 minutos"]
      ].forEach((t)=>{
        const item=document.createElement("article");
        const when=document.createElement("span");when.textContent=t[0];
        const title=document.createElement("strong");title.textContent=t[1];
        const desc=document.createElement("p");desc.textContent=t[2];
        item.append(when,title,desc);eventList.appendChild(item);
      });
    }
  }

  function go(key,extra=""){location.href=moduleUrl(key,extra);}
  function interactions(){
    $$("[data-module-card]").forEach((card)=>{
      if(!icons[card.dataset.moduleCard])return;
      card.tabIndex=0;
      card.setAttribute("role","link");
      const to=()=>go(card.dataset.moduleCard);
      card.addEventListener("click",to);
      card.addEventListener("keydown",(event)=>{
        if(event.key==="Enter"){event.preventDefault();to();}
      });
    });
    $$("[data-module-panel]").forEach((panel)=>{
      const key=panel.dataset.modulePanel;if(!icons[key])return;
      panel.querySelectorAll("a[href]").forEach((link)=>{
        link.href=moduleUrl(key);link.classList.add("demo-module-link");
        link.dataset.demoModule=key;
      });
    });
    $$(".panel-link[href]").forEach((link)=>{
      const old=link.getAttribute("href");
      const key=modules.find((item)=>item.href===old)?.key;
      if(key){link.href=moduleUrl(key);link.classList.add("demo-module-link");link.dataset.demoModule=key;}
    });
    $$(".dashboard-page button:not(#demoThemeButton)").forEach((button)=>{
      // Ações de criação abrem o formulário real do módulo escolhido.
      button.disabled=false;
      button.addEventListener("click",()=>{
        if(button.closest('[data-module-panel="tasks"]'))go("tasks","&open=1");
        else if(button.closest(".recent-events"))go("timeline");
        else if(button.closest(".habits-panel"))go("habits");
      });
    });
  }

  function mobile(){
    const top=document.createElement("header");top.className="mobile-topbar";
    top.innerHTML='<a class="mobile-brand" href="#summaryGrid"><span class="mobile-brand-icon"><img src="../Assets/brand/fluir-symbol.svg" alt=""></span><span class="mobile-brand-meta"><strong>Fluir</strong><span class="mobile-brand-subtitle">Explorar demonstração</span></span></a><button class="mobile-menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false"></button>';
    document.body.prepend(top);
    const overlay=document.createElement("div");overlay.className="mobile-drawer-overlay";
    overlay.innerHTML='<aside class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Explorar módulos"><div class="mobile-drawer-head"><div><strong>Módulos do Fluir</strong><span>Dados fictícios · Somente visualização</span></div><button type="button" class="mobile-drawer-close" aria-label="Fechar menu"></button></div><nav class="mobile-drawer-nav"></nav></aside>';
    const nav=overlay.querySelector(".mobile-drawer-nav");
    [{key:"dashboard",label:"Dashboard"},...modules].forEach((s)=>{
      const a=document.createElement("a");
      a.className="mobile-drawer-link"+(s.key==="dashboard"?" active":" demo-module-link");
      a.href=s.key==="dashboard"?"#summaryGrid":moduleUrl(s.key);
      if(s.key!=="dashboard")a.dataset.demoModule=s.key;
      const icon=document.createElement("i");
      icon.setAttribute("aria-hidden","true");
      icon.style.setProperty("--icon",'url("../Assets/icons/navigation/'+icons[s.key]+'.svg")');
      const label=document.createElement("span");label.textContent=s.label;
      a.append(icon,label);nav.appendChild(a);
    });
    document.body.append(overlay);
    const bottom=document.createElement("nav");bottom.className="mobile-bottom-nav";
    bottom.setAttribute("aria-label","Navegação do Fluir");
    [
      ["dashboard","#summaryGrid","Início"],
      ["tasks",moduleUrl("tasks"),"Tarefas"],
      ["habits",moduleUrl("habits"),"Hábitos"],
      ["timeline",moduleUrl("timeline"),"Timeline"]
    ].forEach((t,index)=>{
      const a=document.createElement("a");
      a.href=t[1];a.className="mobile-nav-link"+(index===0?" active":" demo-module-link");
      if(index!==0)a.dataset.demoModule=t[0];
      const icon=document.createElement("i");icon.setAttribute("aria-hidden","true");
      icon.style.setProperty("--icon",'url("../Assets/icons/navigation/'+icons[t[0]]+'.svg")');
      const title=document.createElement("span");title.textContent=t[2];
      a.append(icon,title);bottom.appendChild(a);
    });
    const more=document.createElement("button");more.type="button";more.className="mobile-more-btn";
    more.innerHTML="<i></i><span>Mais</span>";bottom.appendChild(more);
    document.body.append(bottom);
    const button=top.querySelector(".mobile-menu-btn");
    const close=()=>{document.body.classList.remove("mobile-drawer-open");button.setAttribute("aria-expanded","false");};
    const open=()=>{document.body.classList.add("mobile-drawer-open");button.setAttribute("aria-expanded","true");};
    button.addEventListener("click",()=>document.body.classList.contains("mobile-drawer-open")?close():open());
    more.addEventListener("click",open);
    overlay.querySelector(".mobile-drawer-close").addEventListener("click",close);
    overlay.addEventListener("click",(event)=>{if(event.target===overlay)close();});
    document.addEventListener("keydown",(event)=>{if(event.key==="Escape")close();});
    document.body.classList.add("mobile-ui-ready");
  }

  document.body.classList.add("demo-mode");
  style();banner();sidebar();data();interactions();mobile();theme(currentTheme);
  console.info("Fluir: dashboard de demonstração navegável carregado, sem dados reais.");
})();
