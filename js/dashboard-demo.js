
(() => {
  "use strict";

  // Demonstração isolada: não usa API nem armazenamento pessoal.
  const $ = (selector) => document.querySelector(selector);

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
  }

  function setCard(module, value, detail, percent) {
    const card = $(`[data-module-card="${module}"]`);
    if (!card) return;

    const strong = card.querySelector("strong");
    const small = card.querySelector("small");
    const progress = card.querySelector(".mini-progress span");

    if (strong) strong.textContent = value;
    if (small) small.textContent = detail;
    if (progress && percent != null) {
      progress.style.width = `${percent}%`;
    }
  }

  document.body.classList.add("demo-mode");

  // Ocultar notificações e perfil apenas na demonstração.
  const headerActions = document.querySelector(".header-actions");

  if (headerActions) {
    headerActions.remove();
  }


  // Identificação clara do modo demonstração.
  const style = document.createElement("style");
  style.textContent = `
    .demo-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding: 16px;
      margin-bottom: 20px;
      border: 1px solid #b8dcd0;
      border-radius: 14px;
      background: #e7f6ef;
      color: #244d3d;
    }
    .demo-banner a {
      color: #244d3d;
      font-weight: 700;
    }
    .demo-mode .dashboard-main {
      min-width: 0;
    }
  `;
  document.head.appendChild(style);

  const main = $(".dashboard-main");

  if (main) {
    const banner = document.createElement("div");
    banner.className = "demo-banner";
    banner.innerHTML = `
      <div>
        <strong>Modo demonstração</strong>
        <div>Dados fictícios • Somente visualização</div>
      </div>
      <a class="demo-exit" href="login.html">Voltar ao login</a>
    `;
    main.prepend(banner);
  }

  // Menu lateral demonstrativo.
  const sidebar = $(".sidebar[data-shared-sidebar]");

  if (sidebar) {
    sidebar.insertAdjacentHTML("afterbegin", `
      <div class="brand">
        <div class="brand-icon">
          <img src="../Assets/brand/fluir-symbol.svg"
               alt="" class="brand-symbol">
        </div>
        <div>
          <h1>Fluir</h1>
          <p>Sistema de Organização da Vida</p>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="Demonstração">
        <a class="nav-item active" href="#summaryGrid">Dashboard</a>
        <a class="nav-item" href="#dashboardTaskList">Tarefas</a>
        <a class="nav-item" href="#demoHabits">Hábitos</a>
        <a class="nav-item" href="#demoEvents">Eventos</a>
      </nav>
    `);


    // Reutiliza o catálogo oficial de módulos do Fluir.
    const demoNav = sidebar.querySelector(".sidebar-nav");

    if (demoNav && window.FluirSections) {
      demoNav.innerHTML = window.FluirSections.getAll()
        .map((section) => {
          const classes = ["nav-item"];

          if (section.type === window.FluirSections.TYPES.MODULE) {
            classes.push("module-link");
          }

          if (section.key === "dashboard") {
            classes.push("active");
          }

          return `
            <a
              href="${section.href}"
              class="${classes.join(" ")}"
              data-section="${section.key}"
            >
              <span aria-hidden="true"></span>
              ${section.label}
            </a>
          `;
        })
        .join("");
    }

  }

  // Perfil fictício.
  setText("#welcomeTitle", "Olá, Visitante");
  setText(
    "#welcomeSubtitle",
    "Conheça como o Fluir ajuda a organizar sua rotina."
  );
  setText("#avatarBtnInitial", "D");
  setText("#headerProfileInitial", "D");
  setText("#headerProfileName", "Visitante");
  setText("#headerProfileEmail", "Conta demonstrativa");

  // Resumo com informações fictícias.
  setCard("tasks", "3", "3 de 5 concluídas", 60);
  setCard("habits", "2", "2 de 4 concluídos", 50);
  setCard("sleep", "7h 40min", "Última noite");
  setCard("water", "1500ml", "de 2000ml");
  setCard("finances", "R$ 320,00", "Saldo de exemplo");
  setCard("diary", "1", "entrada fictícia");

  setText("#focusPercent", "60%");

  const focusBar = $(".focus-bar span");
  if (focusBar) focusBar.style.width = "60%";

  // Tarefas demonstrativas: sem edição.
  const taskList = $("#dashboardTaskList");

  if (taskList) {
    const tasks = [
      ["Organizar as prioridades", "Pessoal", "08:30", true],
      ["Estudar programação", "Estudos", "10:00", true],
      ["Beber água", "Saúde", "13:00", true],
      ["Fazer exercícios", "Saúde", "17:00", false],
      ["Ler um livro", "Pessoal", "20:00", false]
    ];

    taskList.innerHTML = tasks.map((task) => `
      <div class="task-item ${task[3] ? "task-done" : ""}">
        <input type="checkbox" ${task[3] ? "checked" : ""} disabled>
        <span>${task[0]}</span>
        <small>${task[1]}</small>
        <time>${task[2]}</time>
      </div>
    `).join("");
  }

  // Painéis inferiores, também fictícios.
  setText(
    '[data-module-panel="sleep"] strong',
    "7h 40min"
  );
  setText(
    '[data-module-panel="sleep"] p',
    "Sono registrado como exemplo"
  );
  setText(
    '[data-module-panel="water"] strong',
    "1500ml"
  );
  setText(
    '[data-module-panel="finances"] strong',
    "R$ 320,00"
  );
  setText(
    '[data-module-panel="diary"] p',
    "Hoje foi um dia produtivo e tranquilo."
  );

  const habits = $(".habits-panel");
  const events = $(".recent-events");

  if (habits) habits.id = "demoHabits";
  if (events) events.id = "demoEvents";


  // Eventos recentes fictícios.
  const eventList = document.querySelector(
    ".recent-events .event-list"
  );

  if (eventList) {
    eventList.innerHTML = `
      <article>
        <span>Hoje, 08:30</span>
        <strong>Tarefa concluída</strong>
        <p>Organizar as prioridades do dia.</p>
      </article>

      <article>
        <span>Hoje, 10:00</span>
        <strong>Estudos realizados</strong>
        <p>Uma sessão de programação concluída.</p>
      </article>

      <article>
        <span>Hoje, 13:00</span>
        <strong>Hidratação registrada</strong>
        <p>Mais um copo de água consumido.</p>
      </article>

      <article>
        <span>Ontem, 22:30</span>
        <strong>Registro de sono</strong>
        <p>7 horas e 40 minutos de descanso.</p>
      </article>
    `;
  }

  // Nenhuma interação pode alterar dados.
  document.querySelectorAll("button, input").forEach((element) => {
    element.disabled = true;
  });

  // Links dos módulos reais não serão abertos na demonstração.
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (link.classList.contains("demo-exit")) return;
    if (href && href.startsWith("#")) return;

    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  console.info("Fluir: demonstração somente leitura carregada.");
})();

// FLUIR_DEMO_REFINEMENT_2026
// Complementos exclusivamente visuais. Não carrega contas, APIs nem armazenamento.
(() => {
  "use strict";
  if (new URLSearchParams(window.location.search).get("demo") !== "1") return;

  const $ = (selector) => document.querySelector(selector);
  const icons = {
    dashboard: "layout-dashboard", timeline: "history", tasks: "list-check",
    habits: "repeat-2", sleep: "moon-star", water: "droplets",
    finances: "wallet", diary: "notebook-pen", nutrition: "apple",
    physicalHealth: "dumbbell", menstrualCycle: "calendar-heart",
    attachments: "paperclip", achievements: "trophy", settings: "settings",
    profile: "circle-user-round", plans: "crown"
  };
  const iconUrl = (key) =>
    'url("../Assets/icons/navigation/' + (icons[key] || "layout-dashboard") + '.svg")';
  const sections = window.FluirSections ? window.FluirSections.getAll() : [];

  // Acabamento visual coerente com o CSS original do Fluir.
  const polish = document.createElement("style");
  polish.textContent = [
    "body.demo-mode .demo-banner{background:var(--input-bg);color:var(--text);border-color:var(--border);padding:15px 18px;border-radius:18px;box-shadow:var(--shadow-soft)}",
    "body.demo-mode .demo-banner strong{font-size:13px;font-weight:850;letter-spacing:-.02em;color:var(--text)}",
    "body.demo-mode .demo-banner div div{margin-top:4px;font-size:12px;color:var(--muted);line-height:1.55}",
    "body.demo-mode .demo-banner .demo-exit{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:9px 15px;border:1px solid var(--border-strong);border-radius:11px;background:var(--card-bg);color:var(--text);font-size:12px;text-decoration:none}",
    "body.demo-mode .summary-card{cursor:default}",
    "body.demo-mode .summary-card:hover{transform:none;border-color:var(--border);box-shadow:var(--shadow-soft)}",
    "body.demo-mode .summary-card:after{display:none}",
    "body.demo-mode .panel-link[aria-disabled='true']{opacity:.55;cursor:default}",
    "body.demo-mode .panel-link[aria-disabled='true']:hover{transform:none}",
    "body.demo-mode .sidebar-nav .nav-item:not(.active){cursor:default}",
    "body.demo-mode .dashboard-page button:disabled{cursor:default;opacity:.58}",
    "body.demo-mode .dashboard-page input:disabled{cursor:default}",
    "body.demo-mode .dashboard-main{min-width:0}",
    "@media(max-width:760px){body.demo-mode .demo-banner{padding:13px 14px;gap:10px;margin:0 0 18px}body.demo-mode .demo-exit{width:100%}}"
  ].join("\n");
  document.head.appendChild(polish);

  // Demonstração não tem dados de conta, notificações nem foto de perfil.
  const headerActions = $(".header-actions");
  if (headerActions) headerActions.remove();
  const banner = $(".demo-banner");
  if (banner) {
    const heading = banner.querySelector("strong");
    const hint = banner.querySelector("div > div");
    if (heading) heading.textContent = "Você está explorando o Fluir";
    if (hint) hint.textContent = "Dados ilustrativos · Somente visualização · Sem conta";
  }

  // Mesma ordem, tipografia, ícones e ilustração da navegação real,
  // mas sem links para telas que exigem autenticação.
  const sidebarNav = $(".sidebar-nav");
  if (sidebarNav) {
    sidebarNav.querySelectorAll("a.nav-item").forEach((link) => {
      const key = link.dataset.section || "";
      const item = document.createElement("span");
      item.className = link.className;
      item.dataset.section = key;
      item.dataset.module = key;
      item.title = "Área disponível na versão completa";
      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      icon.style.setProperty("--icon", iconUrl(key));
      item.append(icon, document.createTextNode(link.textContent.trim()));
      link.replaceWith(item);
    });
    if (!$(".sidebar-illustration")) {
      const illustration = document.createElement("div");
      illustration.className = "sidebar-illustration";
      illustration.setAttribute("aria-hidden", "true");
      illustration.innerHTML = [
        '<div class="rain rain-1"></div><div class="rain rain-2"></div><div class="rain rain-3"></div>',
        '<div class="small-character"><div class="small-umbrella"></div>',
        '<div class="small-head"><span></span><span></span></div>',
        '<div class="small-body"></div></div>',
        '<p>“Pequenas ações constantes constroem mudanças profundas.”</p>'
      ].join("");
      sidebarNav.after(illustration);
    }
  }

  // Números consistentes: 1.500/2.000 ml = seis de oito copos.
  document.querySelectorAll(".water-dots").forEach((group) => {
    group.querySelectorAll("span").forEach((dot, index) => {
      dot.classList.toggle("filled", index < 6);
    });
  });
  const financePanel = $('[data-module-panel="finances"]');
  if (financePanel) {
    const details = financePanel.querySelectorAll("small");
    if (details[0]) details[0].textContent = "Entrada R$ 1.200,00";
    if (details[1]) details[1].textContent = "Saída - R$ 880,00";
    const balance = financePanel.querySelector("strong");
    if (balance) balance.textContent = "R$ 320,00";
  }
  const sleepPanel = $('[data-module-panel="sleep"]');
  if (sleepPanel) {
    const subtitle = sleepPanel.querySelector("p");
    if (subtitle) subtitle.textContent = "Meta de descanso: 8 horas";
  }

  // Timeline e eventos contam a mesma história que os cartões do resumo.
  const timeline = $(".timeline-list");
  if (timeline) {
    const entries = [
      ["08:30", "Prioridades organizadas", "Primeira tarefa do dia concluída."],
      ["10:00", "Estudo de programação", "Sessão de estudos finalizada."],
      ["13:00", "Hidratação registrada", "Consumo acumulado: 1.500 ml."],
      ["17:00", "Atividade física", "Próxima tarefa programada."],
      ["20:00", "Leitura", "Momento de descanso planejado."]
    ];
    timeline.replaceChildren();
    entries.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "timeline-item";
      const time = document.createElement("time");
      time.textContent = entry[0];
      const detail = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = entry[1];
      const description = document.createElement("p");
      description.textContent = entry[2];
      detail.append(title, description);
      row.append(time, detail);
      timeline.appendChild(row);
    });
  }

  // Retira navegação para módulos reais; a saída da demonstração continua ativa.
  document.querySelectorAll(".dashboard-page a[href]").forEach((link) => {
    if (link.classList.contains("demo-exit")) return;
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.tabIndex = -1;
    link.title = "Disponível depois de criar uma conta";
  });

  // Experiência móvel com a estrutura visual oficial, sem ler preferências reais.
  function initMobileDemo() {
    if ($(".mobile-topbar")) return;
    const top = document.createElement("header");
    top.className = "mobile-topbar";
    top.innerHTML = [
      '<div class="mobile-brand">',
      '<span class="mobile-brand-icon"><img src="../Assets/brand/fluir-symbol.svg" alt=""></span>',
      '<span class="mobile-brand-meta"><strong>Fluir</strong>',
      '<span class="mobile-brand-subtitle">Modo demonstração</span></span></div>',
      '<button type="button" class="mobile-menu-btn" aria-label="Abrir menu" aria-expanded="false"></button>'
    ].join("");
    document.body.prepend(top);

    const overlay = document.createElement("div");
    overlay.className = "mobile-drawer-overlay";
    overlay.innerHTML = [
      '<aside class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Módulos do Fluir">',
      '<div class="mobile-drawer-head"><div><strong>Módulos do Fluir</strong>',
      '<span>Prévia somente para visualização</span></div>',
      '<button type="button" class="mobile-drawer-close" aria-label="Fechar menu"></button>',
      '</div><nav class="mobile-drawer-nav" aria-label="Áreas disponíveis"></nav></aside>'
    ].join("");

    const drawerNav = overlay.querySelector(".mobile-drawer-nav");
    sections.forEach((section) => {
      const item = document.createElement("span");
      item.className = "mobile-drawer-link" + (section.key === "dashboard" ? " active" : "");
      item.title = "Área apresentada na versão completa";
      const icon = document.createElement("i");
      icon.setAttribute("aria-hidden", "true");
      icon.style.setProperty("--icon", iconUrl(section.key));
      const label = document.createElement("span");
      label.textContent = section.label;
      item.append(icon, label);
      drawerNav.appendChild(item);
    });
    document.body.appendChild(overlay);

    const bottom = document.createElement("nav");
    bottom.className = "mobile-bottom-nav";
    bottom.setAttribute("aria-label", "Seções desta demonstração");
    const previews = [
      ["summaryGrid", "Início", "dashboard"],
      ["dashboardTaskList", "Tarefas", "tasks"],
      ["demoHabits", "Hábitos", "habits"],
      ["demoEvents", "Eventos", "timeline"]
    ];
    previews.forEach((preview, index) => {
      const link = document.createElement("a");
      link.href = "#" + preview[0];
      link.className = "mobile-nav-link" + (index === 0 ? " active" : "");
      const icon = document.createElement("i");
      icon.setAttribute("aria-hidden", "true");
      icon.style.setProperty("--icon", iconUrl(preview[2]));
      const label = document.createElement("span");
      label.textContent = preview[1];
      link.append(icon, label);
      link.addEventListener("click", () => {
        bottom.querySelectorAll(".mobile-nav-link").forEach((navLink) => {
          navLink.classList.toggle("active", navLink === link);
        });
      });
      bottom.appendChild(link);
    });

    const more = document.createElement("button");
    more.className = "mobile-more-btn";
    more.type = "button";
    const moreIcon = document.createElement("i");
    moreIcon.setAttribute("aria-hidden", "true");
    const moreLabel = document.createElement("span");
    moreLabel.textContent = "Mais";
    more.append(moreIcon, moreLabel);
    bottom.appendChild(more);
    document.body.appendChild(bottom);

    const menu = top.querySelector(".mobile-menu-btn");
    const close = () => {
      document.body.classList.remove("mobile-drawer-open");
      menu.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      document.body.classList.add("mobile-drawer-open");
      menu.setAttribute("aria-expanded", "true");
    };
    menu.addEventListener("click", () => {
      if (document.body.classList.contains("mobile-drawer-open")) close();
      else open();
    });
    more.addEventListener("click", open);
    overlay.querySelector(".mobile-drawer-close").addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    document.body.classList.add("mobile-ui-ready");
  }

  initMobileDemo();
  console.info("Fluir: prévia visual refinada, sem acesso a contas.");
})();
