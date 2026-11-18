
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
