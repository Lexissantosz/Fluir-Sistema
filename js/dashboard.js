console.log("dashboard.js carregou");

/* =====================================================
   FLUIR — DASHBOARD PRINCIPAL
   Controle da tela inicial interna do sistema
===================================================== */


/* =====================================================
   1. ELEMENTOS PRINCIPAIS
===================================================== */

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");
const avatarBtn = document.getElementById("avatarBtn");

const navItems = document.querySelectorAll(".nav-item");
const moduleLinks = document.querySelectorAll(".module-link");
const moduleCards = document.querySelectorAll(".module-card");
const modulePanels = document.querySelectorAll(".module-panel");

const focusPercent = document.getElementById("focusPercent");


/* =====================================================
   2. CONFIGURAÇÕES PADRÃO
   Usadas quando ainda não existe setup salvo.
===================================================== */

const defaultSetup = {
  user: {
    name: "Deibson",
    nickname: "Deibson",
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

  if (!numberValue || Number.isNaN(numberValue)) {
    return "R$ 0";
  }

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  });
}

function getTodayKey() {
  const today = new Date();

  return today.toISOString().split("T")[0];
}


/* =====================================================
   4. SETUP SALVO
   Aqui lemos o que veio da tela de configuração inicial.
===================================================== */

function getSavedSetup() {
  const savedSetup = localStorage.getItem("fluir-setup");

  if (!savedSetup) {
    return defaultSetup;
  }

  try {
    return JSON.parse(savedSetup);
  } catch (error) {
    console.warn("Erro ao ler configuração do Fluir:", error);
    return defaultSetup;
  }
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
      themeBtn.innerHTML = "<span>☼</span> Claro";
    }
  } else {
    body.classList.remove("dark");

    if (themeBtn) {
      themeBtn.innerHTML = "<span>☾</span> Escuro";
    }
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDarkMode = body.classList.contains("dark");

    themeBtn.innerHTML = isDarkMode
      ? "<span>☼</span> Claro"
      : "<span>☾</span> Escuro";

    localStorage.setItem("fluir-theme", isDarkMode ? "dark" : "light");
  });
}


/* =====================================================
   6. SAUDAÇÃO DO USUÁRIO
===================================================== */

function updateWelcomeArea() {
  const nickname = setupData.user?.nickname?.trim();
  const name = setupData.user?.name?.trim();

  const displayName = nickname || name || "Deibson";

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${displayName} 👋`;
  }

  if (avatarBtn) {
    avatarBtn.textContent = getInitial(displayName);
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
    calmo: "Respire fundo. Um dia de cada vez, no seu ritmo.",
    direto: "Veja suas prioridades e siga para o próximo passo.",
    motivador: "Você está construindo constância. Continue avançando.",
    delicado: "Com calma e leveza, hoje também pode fluir.",
    neutro: "Acompanhe sua rotina, seus registros e seus próximos passos."
  };

  return subtitles[tone] || subtitles.calmo;
}


/* =====================================================
   7. MÓDULOS ESCOLHIDOS
   Esconde áreas que o usuário não ativou no setup.
===================================================== */

function applySelectedModules() {
  const modules = setupData.modules || defaultSetup.modules;

  moduleLinks.forEach((link) => {
    const moduleName = link.dataset.module;

    if (!moduleName) {
      return;
    }

    if (modules[moduleName]) {
      link.classList.remove("module-hidden");
    } else {
      link.classList.add("module-hidden");
    }
  });

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

  if (activeModulesCount <= 1 && dashboardMain && !existingNote) {
    const note = document.createElement("section");

    note.className = "empty-dashboard-note";

    note.innerHTML = `
      <strong>Seu dashboard está mais leve por enquanto.</strong>
      <p>
        Você escolheu poucas funcionalidades, então o Fluir deixou a tela mais simples.
        Quando quiser, vá em Configurações para ativar novas áreas como tarefas,
        sono, água, finanças, diário, alimentação ou saúde.
      </p>
    `;

    const recentEvents = document.querySelector(".recent-events");

    if (recentEvents) {
      dashboardMain.insertBefore(note, recentEvents);
    } else {
      dashboardMain.appendChild(note);
    }
  }

  if (activeModulesCount > 1 && existingNote) {
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
      title: "Revisar proposta do projeto",
      category: "Trabalho",
      time: "09:00",
      completed: false
    },
    {
      id: "demo-task-2",
      title: "Responder e-mails importantes",
      category: "Trabalho",
      time: "11:00",
      completed: false
    },
    {
      id: "demo-task-3",
      title: "Estudar capítulo 4",
      category: "Estudos",
      time: "14:00",
      completed: false
    },
    {
      id: "demo-task-4",
      title: "Treino de força",
      category: "Saúde",
      time: "18:00",
      completed: true
    },
    {
      id: "demo-task-5",
      title: "Ler 20 páginas",
      category: "Pessoal",
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
          title: task.title || "Tarefa sem título",
          category: task.category || task.type || "Tarefa",
          time: task.time || task.hour || "",
          completed: Boolean(task.completed)
        };
      })
    };
  }

  const savedDemoTasks = getStorageJSON("fluir-dashboard-demo-tasks", null);

  return {
    source: "demo",
    tasks: Array.isArray(savedDemoTasks) && savedDemoTasks.length
      ? savedDemoTasks
      : getDefaultDashboardTasks()
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
        <strong>Nenhuma tarefa ainda</strong>
        <p>Crie uma tarefa para começar a organizar o dia.</p>
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
        <small>${escapeHTML(task.category || "Tarefa")}</small>
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
    textElement.textContent = `${completed} de ${total} concluídas`;
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
    if (small) small.textContent = `${completedToday} de ${total} concluídos`;
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
  const sleepSmall = lastEntry ? "último registro" : "sem registro";

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
    item.textContent = `meta ${sleepGoal}`;
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
    if (small) small.textContent = `de ${waterGoal}ml`;

    updateWaterDots(dots, total, waterGoal);
  }

  if (panel) {
    const strong = panel.querySelector("strong");
    const p = panel.querySelector("p");
    const dots = panel.querySelectorAll(".water-dots span");

    if (strong) strong.textContent = `${total}ml`;
    if (p) p.textContent = `de ${waterGoal}ml`;

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
    item.textContent = `meta ${waterGoal}`;
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
    if (small) small.textContent = "saldo atual";
  }

  if (panel) {
    const strong = panel.querySelector("strong");
    const p = panel.querySelector("p");
    const smallItems = panel.querySelectorAll("small");

    if (strong) strong.textContent = formatCurrency(balance);
    if (p) p.textContent = "Saldo atual";

    if (smallItems[0]) smallItems[0].textContent = `Entrada ${formatCurrency(income)}`;
    if (smallItems[1]) smallItems[1].textContent = `Saída - ${formatCurrency(expense)}`;
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
        ? "entrada hoje"
        : "entradas hoje";
    }
  }

  if (panel) {
    const p = panel.querySelector("p");

    if (p) {
      p.textContent = entries.length
        ? entries[entries.length - 1].text || entries[entries.length - 1].content || "Última entrada registrada."
        : "Nenhuma entrada no diário ainda.";
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
        <span>Hoje</span>
        <strong>Nenhum evento recente</strong>
        <p>Os registros dos módulos aparecerão aqui.</p>
      </article>
    `;

    return;
  }

  eventList.innerHTML = events.slice(0, 4).map((event) => {
    return `
      <article>
        <span>${escapeHTML(event.date || "Hoje")}</span>
        <strong>${escapeHTML(event.title || "Evento")}</strong>
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

initDashboard();