console.log("dashboard.js carregou");

/* =====================================================
   FLUIR — DASHBOARD PRINCIPAL
   Controle da tela inicial interna do sistema
===================================================== */


/* =====================================================
   1. ELEMENTOS PRINCIPAIS
===================================================== */

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");
const avatarBtn = document.getElementById("avatarBtn");

const notifBtn = document.getElementById("notifBtn");
const notifDropdown = document.getElementById("notifDropdown");

const profileDropdown = document.getElementById("profileDropdown");
const headerProfilePhoto = document.getElementById("headerProfilePhoto");
const headerProfileInitial = document.getElementById("headerProfileInitial");
const headerProfileImage = document.getElementById("headerProfileImage");
const headerProfileName = document.getElementById("headerProfileName");
const headerProfileEmail = document.getElementById("headerProfileEmail");
const headerPhotoInput = document.getElementById("headerPhotoInput");

const navItems = document.querySelectorAll(".nav-item");
const moduleCards = document.querySelectorAll(".module-card");
const modulePanels = document.querySelectorAll(".module-panel");

const focusPercent = document.getElementById("focusPercent");

function dashboardT(key, fallback = "", variables = {}) {
  if (window.FluirI18n) {
    return window.FluirI18n.t(key, fallback, variables);
  }

  return String(fallback).replace(/\{(\w+)\}/g, (match, variableName) => {
    if (Object.prototype.hasOwnProperty.call(variables, variableName)) {
      return String(variables[variableName]);
    }

    return match;
  });
}

function dashboardLocale() {
  return window.FluirI18n
    ? window.FluirI18n.getLocale()
    : "pt-BR";
}


/* =====================================================
   2. CONFIGURAÇÕES PADRÃO
   Usadas quando ainda não existe setup salvo.
===================================================== */

const defaultSetup = {
  user: {
    name: "Você",
    nickname: "Você",
    sexAtBirth: "",
    pronouns: "",
    customPronouns: "",
    age: "",
    communicationTone: "calmo"
  },

  modules: {
    timeline: true,
    tasks: true,
    habits: true,
    sleep: true,
    water: true,
    finances: true,
    diary: true,
    nutrition: false,
    physicalHealth: false,
    menstrualCycle: false,
    attachments: true
  },

  preferences: {}
};


/* =====================================================
   3. FUNÇÕES DE APOIO
   Coisinhas pequenas para evitar repetição e dor de cabeça.
===================================================== */

  function isOnboardingCompleted() {
  try {
    const onboardingCompleted =
      sessionStorage.getItem("fluir-onboarding-completed");

    if (onboardingCompleted === "true" || onboardingCompleted === "false") {
      return onboardingCompleted === "true";
    }

    const setup = localStorage.getItem("fluir-setup");

    if (!setup) {
      return false;
    }

    const setupData = JSON.parse(setup);

    return setupData.onboardingConcluido === true;
  } catch (error) {
    console.warn("Erro ao verificar onboarding:", error);
    return false;
  }
}

function protectDashboardAccess() {
  const completed = isOnboardingCompleted();

  if (!completed) {
    window.location.href = "setup.html";
    return false;
  }

  return true;
}

function getStorageJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.warn(`Erro ao ler ${key}:`, error);
    return fallback;
  }
}

function setStorageJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatCurrency(value) {
  const numberValue = Number(value);
  const safeValue = Number.isNaN(numberValue) ? 0 : numberValue;

  return safeValue.toLocaleString(dashboardLocale(), {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  });
}

function getTodayKey() {
  const today = new Date();

  return toLocalDateKey(today);
}


/* =====================================================
   4. SETUP SALVO
   Aqui lemos o que veio da tela de configuração inicial.
===================================================== */

function getSavedSetup() {
  function readJSON(storage, key) {
    try {
      return JSON.parse(storage.getItem(key) || "null");
    } catch (error) {
      console.warn(`Erro ao ler ${key}:`, error);
      return null;
    }
  }

  const usuario = readJSON(sessionStorage, "fluir-user");
  const onboarding = readJSON(sessionStorage, "fluir-onboarding");
  const salvo = readJSON(localStorage, "fluir-setup");

  const pertenceAoUsuario = (dados) =>
    usuario?.id != null &&
    dados?.usuarioId != null &&
    String(dados.usuarioId) === String(usuario.id);

  const local =
    pertenceAoUsuario(salvo) ||
    (salvo && salvo.usuarioId == null)
      ? salvo
      : {};
  const backend = pertenceAoUsuario(onboarding) ? onboarding : null;

  const preferences = { ...(local.preferences || {}) };

  if (backend) {
  if (backend.tarefas) {
    preferences.tasks = backend.tarefas;
  }

  if (backend.habitos) {
    preferences.habits = backend.habitos;
  }

  if (backend.sono) {
    preferences.sleep = backend.sono;
  }

  if (backend.agua) {
    preferences.water = {
      ...(preferences.water || {}),
      dailyGoal:
        backend.agua.dailyGoal ||
        backend.agua.metaFinalMl ||
        "",
      unit: backend.agua.unit || "",
      reminders: backend.agua.reminders || "",
      reminderFrequency: backend.agua.reminderFrequency || ""
    };
  }

  if (backend.financas) {
    preferences.finances = backend.financas;
  }

  if (backend.diario) {
    preferences.diary = backend.diario;
  }

  if (backend.alimentacao) {
    preferences.nutrition = backend.alimentacao;
  }

  if (backend.saudeFisica) {
    preferences.physicalHealth = backend.saudeFisica;
  }

  if (backend.cicloMenstrual) {
    preferences.menstrualCycle = backend.cicloMenstrual;
  }

  if (backend.anexos) {
    preferences.attachments = backend.anexos;
  }
}

  return {
    usuarioId: usuario?.id,
    onboardingConcluido:
      backend?.onboardingConcluido ??
      local.onboardingConcluido ??
      false,
    user: {
      ...(local.user || {}),
      name: backend
        ? backend.nome || usuario?.nome || "Você"
        : local.user?.name || usuario?.nome || "Você",
      nickname: backend
        ? backend.apelido || ""
        : local.user?.nickname || "",
      pronouns: backend
        ? backend.pronomes || ""
        : local.user?.pronouns || "",
      sexAtBirth: backend
        ? backend.generoNascimento || ""
        : local.user?.sexAtBirth || "",
      age: backend
        ? backend.idade ?? ""
        : local.user?.age ?? "",

      communicationTone: backend
        ? backend.tomComunicacao || "calmo"
        : local.user?.communicationTone || "calmo",

      energy: backend
        ? backend.energiaAtual || ""
        : local.user?.energy || "",

      email: usuario?.email || ""
    },

      modules: backend
        ? backend.modulos || {}
        : local.modules || {},
    preferences
  };
}

const setupData = getSavedSetup();

/* =====================================================
   5. TEMA CLARO / ESCURO
===================================================== */

function applySavedTheme() {
  const savedTheme = localStorage.getItem("fluir-theme");

  if (savedTheme === "dark") {
    body.classList.add("dark");

    if (themeBtn) {
      themeBtn.innerHTML = `<span>☼</span> ${dashboardT("common.light", "Claro")}`;
    }
  } else {
    body.classList.remove("dark");

    if (themeBtn) {
      themeBtn.innerHTML = `<span>☾</span> ${dashboardT("common.dark", "Escuro")}`;
    }
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDarkMode = body.classList.contains("dark");

    themeBtn.innerHTML = isDarkMode
      ? `<span>☼</span> ${dashboardT("common.light", "Claro")}`
      : `<span>☾</span> ${dashboardT("common.dark", "Escuro")}`;

    localStorage.setItem("fluir-theme", isDarkMode ? "dark" : "light");
  });
}


/* =====================================================
   6. SAUDAÇÃO DO USUÁRIO
===================================================== */

function updateWelcomeArea() {
  const nickname = setupData.user?.nickname?.trim();
  const name = setupData.user?.name?.trim();

  const rawDisplayName = nickname || name || "";
  const displayName =
    !rawDisplayName || rawDisplayName === "Você"
      ? dashboardT("common.you", "Você")
      : rawDisplayName;

  if (welcomeTitle) {
    welcomeTitle.textContent = window.FluirI18n
      ? window.FluirI18n.t(
          "dashboard.welcome",
          "Olá, {name}",
          { name: displayName }
        )
      : `Olá, ${displayName}`;
  }

  if (avatarBtn) {
    const avatarBtnInitialEl = document.getElementById("avatarBtnInitial");
if (avatarBtnInitialEl) {
  avatarBtnInitialEl.textContent = getInitial(displayName);
}
  }

  if (welcomeSubtitle) {
    welcomeSubtitle.textContent = getSubtitleByTone(setupData.user?.communicationTone);
  }
}

function getInitial(name) {
  if (!name) {
    return "F";
  }

  return name.trim().charAt(0).toUpperCase();
}

function getSubtitleByTone(tone) {
  const subtitles = {
    calmo: [
      "dashboard.subtitle.calm",
      "Respire fundo. Um dia de cada vez, no seu ritmo."
    ],
    direto: [
      "dashboard.subtitle.direct",
      "Veja suas prioridades e siga para o próximo passo."
    ],
    motivador: [
      "dashboard.subtitle.motivating",
      "Você está construindo constância. Continue avançando."
    ],
    delicado: [
      "dashboard.subtitle.gentle",
      "Com calma e leveza, hoje também pode fluir."
    ],
    neutro: [
      "dashboard.subtitle.neutral",
      "Acompanhe sua rotina, seus registros e seus próximos passos."
    ]
  };

  const [key, fallback] = subtitles[tone] || subtitles.calmo;
  return dashboardT(key, fallback);
}


/* =====================================================
   7. MÓDULOS ESCOLHIDOS
   Esconde áreas que o usuário não ativou no setup.
===================================================== */

function applySelectedModules() {
  const modules = setupData.modules || defaultSetup.modules;

  moduleCards.forEach((card) => {
    const moduleName = card.dataset.moduleCard;

    if (!moduleName) {
      return;
    }

    if (modules[moduleName]) {
      card.classList.remove("module-hidden");
    } else {
      card.classList.add("module-hidden");
    }
  });

  modulePanels.forEach((panel) => {
    const moduleName = panel.dataset.modulePanel;

    if (!moduleName) {
      return;
    }

    if (modules[moduleName]) {
      panel.classList.remove("module-hidden");
    } else {
      panel.classList.add("module-hidden");
    }
  });

  updateDashboardLayoutAfterHiddenModules();
}

function updateDashboardLayoutAfterHiddenModules() {
  const summaryGrid = document.getElementById("summaryGrid");
  const contentGrid = document.querySelector(".content-grid");
  const bottomGrid = document.querySelector(".bottom-grid");
  const sidePanels = document.querySelector(".side-panels");
  const dashboardMain = document.querySelector(".dashboard-main");

  const visibleSummaryCards = document.querySelectorAll(
    ".summary-card:not(.module-hidden)"
  );

  const visibleContentPanels = document.querySelectorAll(
    ".content-grid .panel:not(.module-hidden)"
  );

  const visibleBottomPanels = document.querySelectorAll(
    ".bottom-grid .panel:not(.module-hidden)"
  );

  const visibleSidePanels = document.querySelectorAll(
    ".side-panels .small-panel:not(.module-hidden)"
  );

  const modules = setupData.modules || defaultSetup.modules;
  const activeModulesCount = Object.values(modules).filter((value) => value === true).length;

  const existingNote = document.querySelector(".empty-dashboard-note");
  const noteDismissalKey = "fluir-dashboard-note:" + Object.keys(modules)
    .filter((key) => modules[key] === true).sort().join(",");
  let noteDismissed = false;
  try { noteDismissed = sessionStorage.getItem(noteDismissalKey) === "dismissed"; } catch (_) {}


  if (summaryGrid) {
    summaryGrid.classList.remove(
      "compact-summary",
      "one-card-summary",
      "two-card-summary"
    );

    if (visibleSummaryCards.length === 1) {
      summaryGrid.classList.add("one-card-summary");
    }

    if (visibleSummaryCards.length === 2) {
      summaryGrid.classList.add("two-card-summary");
    }

    if (visibleSummaryCards.length > 0 && visibleSummaryCards.length <= 3) {
      summaryGrid.classList.add("compact-summary");
    }
  }

  if (contentGrid) {
    contentGrid.classList.remove("single-content-panel");

    if (visibleContentPanels.length <= 1) {
      contentGrid.classList.add("single-content-panel");
    }
  }

  if (bottomGrid) {
    bottomGrid.classList.remove("compact-bottom");

    if (visibleBottomPanels.length <= 2) {
      bottomGrid.classList.add("compact-bottom");
    }
  }

  if (sidePanels) {
    sidePanels.classList.remove("compact-side-panels");

    if (visibleSidePanels.length <= 2) {
      sidePanels.classList.add("compact-side-panels");
    }
  }

  const habitsPanel = document.querySelector('[data-module-panel="habits"]');

  if (habitsPanel) {
    habitsPanel.classList.remove("only-panel");

    if (
      !habitsPanel.classList.contains("module-hidden") &&
      visibleBottomPanels.length <= 1
    ) {
      habitsPanel.classList.add("only-panel");
    }
  }

  if (activeModulesCount <= 1 && dashboardMain && !existingNote && !noteDismissed) {
    const note = document.createElement("section");

    note.className = "empty-dashboard-note";

    note.innerHTML = `
<button class="dashboard-note-close" type="button" aria-label="Fechar aviso">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
      <strong>${dashboardT(
        "dashboard.empty.title",
        "Seu início está mais leve por enquanto."
      )}</strong>
      <p>${dashboardT(
        "dashboard.empty.description",
        "Você escolheu poucas funcionalidades, então o Fluir deixou a tela mais simples. Quando quiser, vá em Configurações para ativar novas áreas como tarefas, sono, água, finanças, diário, alimentação ou saúde."
      )}</p>
    `;
    note.querySelector(".dashboard-note-close").addEventListener("click", () => {
      try { sessionStorage.setItem(noteDismissalKey, "dismissed"); } catch (_) {}
      note.remove();
    });

    const recentEvents = document.querySelector(".recent-events");

    if (recentEvents) {
      dashboardMain.insertBefore(note, recentEvents);
    } else {
      dashboardMain.appendChild(note);
    }
  }

  if ((activeModulesCount > 1 || noteDismissed) && existingNote) {
    existingNote.remove();
  }
}


/* =====================================================
   8. MENU ATIVO
===================================================== */

function setupNavigation() {
  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const href = item.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();
      }

      navItems.forEach((nav) => {
        nav.classList.remove("active");
      });

      item.classList.add("active");
    });
  });
}


/* =====================================================
   9. CARDS DO DASHBOARD CLICÁVEIS
===================================================== */

function setupDashboardCardLinks() {
  const cardRoutes = {
    tasks: "tasks.html",
    habits: "habits.html",
    sleep: "sleep.html",
    water: "water.html",
    finances: "finances.html",
    diary: "diary.html"
  };

  const dashboardCards = document.querySelectorAll("[data-module-card]");

  dashboardCards.forEach((card) => {
    const moduleName = card.getAttribute("data-module-card");
    const route = cardRoutes[moduleName];

    if (!route) {
      return;
    }

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", () => {
      window.location.href = route;
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = route;
      }
    });
  });
}


/* =====================================================
   10. DADOS GERAIS DO DASHBOARD
===================================================== */

function updateDashboardRealData() {
  updateTasksDashboardData();
  updateHabitsDashboardData();
  updateSleepDashboardData();
  updateWaterDashboardData();
  updateFinancesDashboardData();
  updateDiaryDashboardData();
  updateAchievementsDashboardData();
  updatePlanDashboardData();
  updateRecentEventsDashboardData();
}


/* =====================================================
   11. TAREFAS DO DASHBOARD
   Aqui fica a parte do quadradinho que finalmente funciona.
===================================================== */

function getDefaultDashboardTasks() {
  return [
    {
      id: "demo-task-1",
      title: dashboardT("dashboard.demoTask.project", "Revisar proposta do projeto"),
      category: dashboardT("dashboard.category.work", "Trabalho"),
      time: "09:00",
      completed: false
    },
    {
      id: "demo-task-2",
      title: dashboardT("dashboard.demoTask.emails", "Responder e-mails importantes"),
      category: dashboardT("dashboard.category.work", "Trabalho"),
      time: "11:00",
      completed: false
    },
    {
      id: "demo-task-3",
      title: dashboardT("dashboard.demoTask.chapter", "Estudar capítulo 4"),
      category: dashboardT("dashboard.category.study", "Estudos"),
      time: "14:00",
      completed: false
    },
    {
      id: "demo-task-4",
      title: dashboardT("dashboard.demoTask.workout", "Treino de força"),
      category: dashboardT("dashboard.category.health", "Saúde"),
      time: "18:00",
      completed: true
    },
    {
      id: "demo-task-5",
      title: dashboardT("dashboard.demoTask.read", "Ler 20 páginas"),
      category: dashboardT("dashboard.category.personal", "Pessoal"),
      time: "20:30",
      completed: true
    }
  ];
}

function getDashboardTasks() {
  const realTasks = getStorageJSON("fluir-tasks", []);

  if (Array.isArray(realTasks) && realTasks.length) {
    return {
      source: "real",
      tasks: realTasks.slice(0, 5).map((task, index) => {
        return {
          id: task.id || `real-task-${index}`,
          title: task.title || dashboardT("dashboard.untitledTask", "Tarefa sem título"),
          category: task.category || task.type || dashboardT("dashboard.task", "Tarefa"),
          time: task.time || task.hour || "",
          completed: Boolean(task.completed)
        };
      })
    };
  }

  const savedDemoTasks = getStorageJSON("fluir-dashboard-demo-tasks", null);

  return {
    source: "demo",
    tasks: (() => {
      const defaults = getDefaultDashboardTasks();

      if (!Array.isArray(savedDemoTasks) || !savedDemoTasks.length) {
        return defaults;
      }

      const savedById = new Map(
        savedDemoTasks.map((task) => [String(task.id), task])
      );

      return defaults.map((task) => {
        const saved = savedById.get(String(task.id));

        return saved
          ? { ...task, completed: Boolean(saved.completed) }
          : task;
      });
    })()
  };
}

function updateTasksDashboardData() {
  const tasksPanel = document.getElementById("dashboardTaskList");

  if (!tasksPanel) {
    return;
  }

  const dashboardTasks = getDashboardTasks();

  if (!dashboardTasks.tasks.length) {
    tasksPanel.innerHTML = `
      <div class="empty-dashboard-mini">
        <strong>${dashboardT("dashboard.noTasks.title", "Nenhuma tarefa ainda")}</strong>
        <p>${dashboardT(
          "dashboard.noTasks.description",
          "Crie uma tarefa para começar a organizar o dia."
        )}</p>
      </div>
    `;

    updateTasksSummary();
    updateFocusProgress();
    return;
  }

  tasksPanel.innerHTML = dashboardTasks.tasks.map((task) => {
    const checked = task.completed ? "checked" : "";
    const doneClass = task.completed ? "task-done" : "";

    return `
      <div
        class="task-item ${doneClass}"
        data-task-id="${escapeAttribute(task.id)}"
        data-task-source="${escapeAttribute(dashboardTasks.source)}"
      >
        <input type="checkbox" ${checked}>
        <span>${escapeHTML(task.title)}</span>
        <small>${escapeHTML(task.category || dashboardT("dashboard.task", "Tarefa"))}</small>
        <time>${escapeHTML(task.time || "")}</time>
      </div>
    `;
  }).join("");

  setupTasksInteraction();
  updateTasksSummary();
  updateFocusProgress();
}

function setupTasksInteraction() {
  const taskList = document.getElementById("dashboardTaskList");

  if (!taskList) {
    return;
  }

  taskList.addEventListener("click", (event) => {
    const taskItem = event.target.closest(".task-item");

    if (!taskItem || !taskList.contains(taskItem)) {
      return;
    }

    const checkbox = taskItem.querySelector('input[type="checkbox"]');

    if (!checkbox) {
      return;
    }

    const clickedCheckbox = event.target.matches('input[type="checkbox"]');

    /*
      Se o clique foi no quadradinho, o navegador já alternou o estado.
      Se foi no resto da tarefa, a gente alterna manualmente.
    */
    if (!clickedCheckbox) {
      checkbox.checked = !checkbox.checked;
    }

    applyTaskVisual(taskItem);
    saveTaskChange(taskItem);
    updateTasksSummary();
    updateFocusProgress();
  });
}

function applyTaskVisual(taskItem) {
  const checkbox = taskItem.querySelector('input[type="checkbox"]');

  if (!checkbox) {
    return;
  }

  taskItem.classList.toggle("task-done", checkbox.checked);
}

function saveTaskChange(taskItem) {
  const checkbox = taskItem.querySelector('input[type="checkbox"]');
  const text = taskItem.querySelector("span");

  if (!checkbox || !text) {
    return;
  }

  const taskId = taskItem.dataset.taskId;
  const taskSource = taskItem.dataset.taskSource;

  if (taskSource === "real") {
    const tasks = getStorageJSON("fluir-tasks", []);

    const updatedTasks = tasks.map((task, index) => {
      const currentId = task.id || `real-task-${index}`;

      if (String(currentId) === String(taskId) || task.title === text.textContent.trim()) {
        return {
          ...task,
          completed: checkbox.checked
        };
      }

      return task;
    });

    setStorageJSON("fluir-tasks", updatedTasks);
    return;
  }

  const demoTasks = [];

  document.querySelectorAll("#dashboardTaskList .task-item").forEach((item) => {
    const itemCheckbox = item.querySelector('input[type="checkbox"]');
    const itemTitle = item.querySelector("span");
    const itemCategory = item.querySelector("small");
    const itemTime = item.querySelector("time");

    if (!itemCheckbox || !itemTitle) {
      return;
    }

    demoTasks.push({
      id: item.dataset.taskId,
      title: itemTitle.textContent.trim(),
      category: itemCategory ? itemCategory.textContent.trim() : "Tarefa",
      time: itemTime ? itemTime.textContent.trim() : "",
      completed: itemCheckbox.checked
    });
  });

  setStorageJSON("fluir-dashboard-demo-tasks", demoTasks);
}

function updateTasksSummary() {
  const checkboxes = document.querySelectorAll("#dashboardTaskList .task-item input[type='checkbox']");
  const tasksCard = document.querySelector("[data-module-card='tasks']");

  if (!tasksCard) {
    return;
  }

  const total = checkboxes.length;
  const completed = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;
  const pending = total - completed;

  const numberElement = tasksCard.querySelector("strong");
  const textElement = tasksCard.querySelector("small");
  const progressElement = tasksCard.querySelector(".mini-progress span");

  if (numberElement) {
    numberElement.textContent = String(pending);
  }

  if (textElement) {
    textElement.textContent = dashboardT(
      "dashboard.tasksCompleted",
      "{completed} de {total} concluídas",
      { completed, total }
    );
  }

  if (progressElement) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    progressElement.style.width = `${percentage}%`;
  }
}


/* =====================================================
   12. FOCO DO DIA
===================================================== */

function updateFocusProgress() {
  const taskCheckboxes = document.querySelectorAll("#dashboardTaskList .task-item input[type='checkbox']");

  if (!taskCheckboxes.length) {
    if (focusPercent) {
      focusPercent.textContent = "0%";
    }

    const focusBar = document.querySelector(".focus-bar span");

    if (focusBar) {
      focusBar.style.width = "0%";
    }

    return;
  }

  const totalTasks = taskCheckboxes.length;

  const completedTasks = Array.from(taskCheckboxes).filter((checkbox) => {
    return checkbox.checked;
  }).length;

  const percent = Math.round((completedTasks / totalTasks) * 100);

  if (focusPercent) {
    focusPercent.textContent = `${percent}%`;
  }

  const focusBar = document.querySelector(".focus-bar span");

  if (focusBar) {
    focusBar.style.width = `${percent}%`;
  }
}


/* =====================================================
   13. HÁBITOS
===================================================== */

function updateHabitsDashboardData() {
  const habits = getStorageJSON("fluir-habits", []);
  const todayKey = getTodayKey();

  const total = Array.isArray(habits) ? habits.length : 0;

  const completedToday = Array.isArray(habits)
    ? habits.filter((habit) => {
        return Array.isArray(habit.completedDates) && habit.completedDates.includes(todayKey);
      }).length
    : 0;

  const percent = total ? Math.round((completedToday / total) * 100) : 0;

  const card = document.querySelector('[data-module-card="habits"]');

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");
    const progress = card.querySelector(".mini-progress span");

    if (strong) strong.textContent = String(completedToday);
    if (small) {
      small.textContent = dashboardT(
        "dashboard.habitsCompleted",
        "{completed} de {total} concluídos",
        { completed: completedToday, total }
      );
    }
    if (progress) progress.style.width = `${percent}%`;
  }
}


/* =====================================================
   14. SONO
===================================================== */

function updateSleepDashboardData() {
  const sleepEntries = getStorageJSON("fluir-sleep", []);
  const card = document.querySelector('[data-module-card="sleep"]');
  const panel = document.querySelector('[data-module-panel="sleep"]');

  const lastEntry = Array.isArray(sleepEntries) && sleepEntries.length
    ? sleepEntries[sleepEntries.length - 1]
    : null;

  const sleepText = lastEntry?.duration || lastEntry?.hours || "0h";
  const sleepSmall = lastEntry
    ? dashboardT("dashboard.lastRecord", "último registro")
    : dashboardT("dashboard.noRecord", "sem registro");

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");

    if (strong) strong.textContent = sleepText;
    if (small) small.textContent = sleepSmall;
  }

  if (panel) {
    const strong = panel.querySelector("strong");
    const p = panel.querySelector("p");

    if (strong) strong.textContent = sleepText;
    if (p) p.textContent = sleepSmall;
  }
}

function applySleepPreferences() {
  const sleepGoal = setupData.preferences?.sleep?.sleepGoal;

  if (!sleepGoal) {
    return;
  }

  const sleepCards = document.querySelectorAll('[data-module-card="sleep"] small');

  sleepCards.forEach((item) => {
    item.textContent = dashboardT(
      "dashboard.goal",
      "meta {goal}",
      { goal: sleepGoal }
    );
  });
}


/* =====================================================
   15. ÁGUA
===================================================== */

function updateWaterDashboardData() {
  const waterEntries = getStorageJSON("fluir-water", []);
  const waterGoal = setupData.preferences?.water?.dailyGoal || 2000;

  const total = Array.isArray(waterEntries)
    ? waterEntries.reduce((sum, entry) => {
        return sum + Number(entry.amount || entry.ml || 0);
      }, 0)
    : 0;

  const card = document.querySelector('[data-module-card="water"]');
  const panel = document.querySelector('[data-module-panel="water"]');

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");
    const dots = card.querySelectorAll(".water-dots span");

    if (strong) strong.textContent = `${total}ml`;
    if (small) {
      small.textContent = dashboardT(
        "dashboard.ofGoalMl",
        "de {goal} ml",
        { goal: Number(waterGoal).toLocaleString(dashboardLocale()) }
      );
    }

    updateWaterDots(dots, total, waterGoal);
  }

  if (panel) {
    const strong = panel.querySelector("strong");
    const p = panel.querySelector("p");
    const dots = panel.querySelectorAll(".water-dots span");

    if (strong) strong.textContent = `${total}ml`;
    if (p) {
      p.textContent = dashboardT(
        "dashboard.ofGoalMl",
        "de {goal} ml",
        { goal: Number(waterGoal).toLocaleString(dashboardLocale()) }
      );
    }

    updateWaterDots(dots, total, waterGoal);
  }
}

function updateWaterDots(dots, total, goal) {
  if (!dots.length) {
    return;
  }

  const percentage = goal > 0 ? total / goal : 0;
  const filledDots = Math.min(dots.length, Math.round(percentage * dots.length));

  dots.forEach((dot, index) => {
    if (index < filledDots) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  });
}

function applyWaterPreferences() {
  const waterGoal = setupData.preferences?.water?.dailyGoal;

  if (!waterGoal) {
    return;
  }

  const waterCards = document.querySelectorAll('[data-module-card="water"] small');

  waterCards.forEach((item) => {
    item.textContent = dashboardT(
      "dashboard.goal",
      "meta {goal}",
      { goal: Number(waterGoal).toLocaleString(dashboardLocale()) }
    );
  });
}


/* =====================================================
   16. FINANÇAS
===================================================== */

function updateFinancesDashboardData() {
  const finances = getStorageJSON("fluir-finances", []);

  const entries = Array.isArray(finances) ? finances : [];

  const income = entries
    .filter((item) => item.type === "entrada" || item.type === "income")
    .reduce((sum, item) => sum + Number(item.value || item.amount || 0), 0);

  const expense = entries
    .filter((item) => item.type === "saida" || item.type === "expense")
    .reduce((sum, item) => sum + Number(item.value || item.amount || 0), 0);

  const balance = income - expense;

  const card = document.querySelector('[data-module-card="finances"]');
  const panel = document.querySelector('[data-module-panel="finances"]');

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");

    if (strong) strong.textContent = formatCurrency(balance);
    if (small) small.textContent = dashboardT("dashboard.currentBalance", "saldo atual");
  }

  if (panel) {
    const strong = panel.querySelector("strong");
    const p = panel.querySelector("p");
    const smallItems = panel.querySelectorAll("small");

    if (strong) strong.textContent = formatCurrency(balance);
    if (p) p.textContent = dashboardT("dashboard.currentBalance", "saldo atual");

    if (smallItems[0]) {
      smallItems[0].textContent = dashboardT(
        "dashboard.income",
        "Entrada {value}",
        { value: formatCurrency(income) }
      );
    }
    if (smallItems[1]) {
      smallItems[1].textContent = dashboardT(
        "dashboard.expense",
        "Saída - {value}",
        { value: formatCurrency(expense) }
      );
    }
  }
}

function applyFinancePreferences() {
  const income = setupData.preferences?.finances?.monthlyIncome;

  if (!income) {
    return;
  }

  const financeCards = document.querySelectorAll('[data-module-card="finances"] strong');

  financeCards.forEach((item) => {
    item.textContent = formatCurrency(Number(income));
  });
}


/* =====================================================
   17. DIÁRIO
===================================================== */

function updateDiaryDashboardData() {
  const diaryEntries = getStorageJSON("fluir-diary", []);

  const entries = Array.isArray(diaryEntries) ? diaryEntries : [];
  const todayKey = getTodayKey();

  const todayEntries = entries.filter((entry) => {
    return String(entry.date || "").startsWith(todayKey);
  });

  const card = document.querySelector('[data-module-card="diary"]');
  const panel = document.querySelector('[data-module-panel="diary"]');

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");

    if (strong) strong.textContent = String(todayEntries.length);
    if (small) {
      small.textContent = todayEntries.length === 1
        ? dashboardT("dashboard.entryToday", "entrada hoje")
        : dashboardT("dashboard.entriesToday", "entradas hoje");
    }
  }

  if (panel) {
    const p = panel.querySelector("p");

    if (p) {
      p.textContent = entries.length
        ? entries[entries.length - 1].text ||
          entries[entries.length - 1].content ||
          dashboardT("dashboard.lastDiaryEntry", "Última entrada registrada.")
        : dashboardT("dashboard.noDiaryEntries", "Nenhuma entrada no diário ainda.");
    }
  }
}


/* =====================================================
   18. CONQUISTAS, PLANOS E EVENTOS
   Por enquanto, são leituras simples para não quebrar o painel.
===================================================== */

function updateAchievementsDashboardData() {
  // Área preparada para quando conquistas tiverem dados próprios.
}

function updatePlanDashboardData() {
  // Área preparada para quando planos tiverem integração.
}

function updateRecentEventsDashboardData() {
  const eventList = document.querySelector(".event-list");

  if (!eventList) {
    return;
  }

  const events = getStorageJSON("fluir-events", []);

  if (!Array.isArray(events) || !events.length) {
    eventList.innerHTML = `
      <article>
        <span>${dashboardT("dashboard.today", "Hoje")}</span>
        <strong>${dashboardT("dashboard.noRecentEvents", "Nenhum evento recente")}</strong>
        <p>${dashboardT(
          "dashboard.moduleRecordsHere",
          "Os registros dos módulos aparecerão aqui."
        )}</p>
      </article>
    `;

    return;
  }

  eventList.innerHTML = events.slice(0, 4).map((event) => {
    return `
      <article>
        <span>${escapeHTML(event.date || dashboardT("dashboard.today", "Hoje"))}</span>
        <strong>${escapeHTML(event.title || dashboardT("dashboard.event", "Evento"))}</strong>
        <p>${escapeHTML(event.description || "")}</p>
      </article>
    `;
  }).join("");
}


/* =====================================================
   19. AVISO DE SETUP
===================================================== */

function showSetupNoticeIfNeeded() {
  const savedSetup = localStorage.getItem("fluir-setup");

  if (savedSetup) {
    return;
  }

  console.info(
    "Nenhuma configuração inicial encontrada. O dashboard está usando dados padrão."
  );
}


/* =====================================================
   20. INICIALIZAÇÃO
===================================================== */

function initDashboard() {
  console.log("initDashboard rodou");

  applySavedTheme();
  updateWelcomeArea();
  applySelectedModules();
  setupNavigation();

  updateDashboardRealData();
  setupDashboardCardLinks();

  applyFinancePreferences();
  applySleepPreferences();
  applyWaterPreferences();

  showSetupNoticeIfNeeded();
}

if (protectDashboardAccess()) {
  initDashboard();
}

// =====================================================
// 21. DROPDOWNS DO CABEÇALHO (NOTIFICAÇÕES E PERFIL)
// =====================================================

function closeAllHeaderDropdowns() {
  if (notifDropdown) notifDropdown.classList.remove("open");
  if (profileDropdown) profileDropdown.classList.remove("open");
}

if (notifBtn && notifDropdown) {
  notifBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !notifDropdown.classList.contains("open");
    closeAllHeaderDropdowns();
    if (willOpen) notifDropdown.classList.add("open");
  });
}

if (avatarBtn && profileDropdown) {
  avatarBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !profileDropdown.classList.contains("open");
    closeAllHeaderDropdowns();
    if (willOpen) profileDropdown.classList.add("open");
  });
}

document.addEventListener("click", () => {
  closeAllHeaderDropdowns();
});

if (profileDropdown) {
  profileDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

if (notifDropdown) {
  notifDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}


// =====================================================
// 22. FOTO E NOME NO DROPDOWN DE PERFIL
// =====================================================

function getHeaderProfile() {
  try {
    return JSON.parse(localStorage.getItem("fluir-profile")) || {};
  } catch (error) {
    return {};
  }
}

function saveHeaderProfile(profile) {
  localStorage.setItem("fluir-profile", JSON.stringify(profile));
}

function renderHeaderProfileDropdown() {
  const nickname = setupData.user?.nickname?.trim();
  const name = setupData.user?.name?.trim();
  const rawDisplayName = nickname || name || "";
  const displayName =
    !rawDisplayName || rawDisplayName === "Você"
      ? dashboardT("common.you", "Você")
      : rawDisplayName;

  const profile = getHeaderProfile();

  if (headerProfileName) {
    headerProfileName.textContent = displayName;
  }

  if (headerProfileEmail) {
    headerProfileEmail.textContent = setupData.user?.email || "usuario@email.com";
  }

  if (headerProfileInitial) {
    headerProfileInitial.textContent = getInitial(displayName);
  }

  if (profile.photo && headerProfileImage && headerProfilePhoto) {
    headerProfileImage.src = profile.photo;
    headerProfilePhoto.classList.add("has-image");
  } else if (headerProfilePhoto) {
    headerProfilePhoto.classList.remove("has-image");
  }

  
  const avatarBtnImage = document.getElementById("avatarBtnImage");

  if (profile.photo && avatarBtnImage && avatarBtn) {
    avatarBtnImage.src = profile.photo;
    avatarBtn.classList.add("has-image");
  } else if (avatarBtn) {
    avatarBtn.classList.remove("has-image");
  }
}

if (headerPhotoInput) {
  headerPhotoInput.addEventListener("change", () => {
    const file = headerPhotoInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const profile = getHeaderProfile();
      profile.photo = reader.result;

      saveHeaderProfile(profile);
      renderHeaderProfileDropdown();
    };

    reader.readAsDataURL(file);
  });
}

renderHeaderProfileDropdown();
