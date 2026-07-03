console.log("dashboard.js carregou");

// =====================================================
// FLUIR — DASHBOARD PRINCIPAL
// JavaScript puro para personalizar o dashboard
// =====================================================


// =====================================================
// 1. SELEÇÃO DOS ELEMENTOS PRINCIPAIS
// =====================================================

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


// =====================================================
// 2. CONFIGURAÇÕES PADRÃO
// Usadas caso ainda não exista setup salvo no localStorage.
// =====================================================

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


// =====================================================
// 3. LER SETUP SALVO
// Lê os dados vindos da tela setup.html.
// Se não existir, usa o padrão acima.
// =====================================================

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


// =====================================================
// 4. TEMA CLARO / ESCURO
// Mantém o mesmo tema usado nas outras telas.
// =====================================================

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


// =====================================================
// 5. SAUDAÇÃO PERSONALIZADA
// Usa o nome preferido salvo no setup.
// =====================================================

function updateWelcomeArea() {
  const nickname = setupData.user?.nickname?.trim();
  const name = setupData.user?.name?.trim();

  const displayName = nickname || name || "Deibson";

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${displayName}`;
  }

  if (avatarBtn) {
    avatarBtn.textContent = getInitial(displayName);
  }

  if (welcomeSubtitle) {
    welcomeSubtitle.textContent = getSubtitleByTone(setupData.user?.communicationTone);
  }
}


// =====================================================
// 6. PEGAR INICIAL DO NOME
// Usado no botão redondo de perfil.
// =====================================================

function getInitial(name) {
  if (!name) {
    return "F";
  }

  return name.trim().charAt(0).toUpperCase();
}


// =====================================================
// 7. FRASE DO TOPO POR TOM DE COMUNICAÇÃO
// Muda levemente conforme o que a pessoa escolheu no setup.
// =====================================================

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


// =====================================================
// 8. APLICAR MÓDULOS ESCOLHIDOS
// Mostra no dashboard apenas os módulos ativados no setup.
// Timeline e Dashboard ficam sempre ativos.
// =====================================================

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


// =====================================================
// 9. AJUSTAR LAYOUT QUANDO ALGUNS MÓDULOS SUMIREM
// Mantém o dashboard bonito mesmo com poucos módulos ativos.
// =====================================================

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

  // Conta quantos módulos estão ativos no setup.
  const modules = setupData.modules || defaultSetup.modules;

  const activeModulesCount = Object.values(modules).filter((value) => {
    return value === true;
  }).length;

  // Verifica se a nota de dashboard vazio já existe.
  const existingNote = document.querySelector(".empty-dashboard-note");

  // =====================================================
  // CARDS DO TOPO
  // =====================================================

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

  // =====================================================
  // GRID PRINCIPAL
  // Se só tiver um painel, ele ocupa melhor o espaço.
  // =====================================================

  if (contentGrid) {
    contentGrid.classList.remove("single-content-panel");

    if (visibleContentPanels.length <= 1) {
      contentGrid.classList.add("single-content-panel");
    }
  }

  // =====================================================
  // GRID INFERIOR
  // Se poucos painéis aparecem, evita espaços vazios.
  // =====================================================

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

  // =====================================================
  // PAINEL DE HÁBITOS
  // Se ele for o único painel inferior, limita largura.
  // =====================================================

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

  // =====================================================
  // ESTADO COM POUCAS FUNCIONALIDADES
  // Mostra uma nota elegante se o dashboard estiver vazio.
  // =====================================================

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


// =====================================================
// 10. MENU ATIVO
// Mantém visual ativo sem bloquear links reais.
// =====================================================

function setupNavigation() {
  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const href = item.getAttribute("href");

      // Só bloqueia links vazios ou "#".
      // Assim links como tasks.html, water.html, finances.html etc. funcionam.
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


// =====================================================
// 11. CHECKBOXES DE TAREFAS
// Atualiza visual simples quando marcar/desmarcar.
// =====================================================

function setupTasksInteraction() {
  const taskCheckboxes = document.querySelectorAll(".task-item input");

  taskCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const taskItem = checkbox.closest(".task-item");

      if (!taskItem) {
        return;
      }

      if (checkbox.checked) {
        taskItem.classList.add("task-done");
      } else {
        taskItem.classList.remove("task-done");
      }

      updateFocusProgress();
    });

    if (checkbox.checked) {
      const taskItem = checkbox.closest(".task-item");

      if (taskItem) {
        taskItem.classList.add("task-done");
      }
    }
  });
}


// =====================================================
// 12. ATUALIZAR FOCO DO DIA
// Calcula uma porcentagem simples baseada em tarefas concluídas.
// =====================================================

function updateFocusProgress() {
  const taskCheckboxes = document.querySelectorAll(".task-item input");

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


// =====================================================
// 13. PREENCHER DADOS FINANCEIROS DO SETUP
// Se a pessoa informou renda no setup, podemos mostrar um começo.
// =====================================================

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

// =====================================================
// LER JSON DO LOCALSTORAGE COM SEGURANÇA
// Evita erro se algum dado estiver vazio ou corrompido.
// =====================================================

function getStorageJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    console.warn(`Erro ao ler ${key}:`, error);
    return fallback;
  }
}

// =====================================================
// 14. FORMATAR MOEDA
// =====================================================

function formatCurrency(value) {
  if (!value || Number.isNaN(value)) {
    return "R$ 0";
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  });
}


// =====================================================
// 15. DADOS DE SONO DO SETUP
// Se a pessoa colocou meta de sono, aparece no card.
// =====================================================

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


// =====================================================
// 16. DADOS DE ÁGUA DO SETUP
// Se a pessoa colocou meta, aparece no card.
// =====================================================

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


// =====================================================
// 17. AVISO CASO NÃO TENHA SETUP
// Ajuda durante desenvolvimento.
// =====================================================

function showSetupNoticeIfNeeded() {
  const savedSetup = localStorage.getItem("fluir-setup");

  if (savedSetup) {
    return;
  }

  console.info(
    "Nenhuma configuração inicial encontrada. O dashboard está usando dados padrão."
  );
}

// =====================================================
// DADOS REAIS DO DASHBOARD
// Puxa informações reais dos módulos salvos no localStorage.
// =====================================================

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


// =====================================================
// TAREFAS
// =====================================================

function updateTasksDashboardData() {
  const tasks = getStorageJSON("fluir-tasks", []);

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const card = document.querySelector('[data-module-card="tasks"]');

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");
    const progress = card.querySelector(".mini-progress span");

    if (strong) strong.textContent = String(pending);
    if (small) small.textContent = `${completed} de ${total} concluídas`;
    if (progress) progress.style.width = `${percent}%`;
  }

  const tasksPanel = document.querySelector('[data-module-panel="tasks"] .task-list');

  if (!tasksPanel) return;

  if (!tasks.length) {
    tasksPanel.innerHTML = `
      <div class="empty-dashboard-mini">
        <strong>Nenhuma tarefa ainda</strong>
        <p>Crie uma tarefa para começar a organizar o dia.</p>
      </div>
    `;
    return;
  }

  const recentTasks = tasks.slice(0, 5);

  tasksPanel.innerHTML = recentTasks.map((task) => {
    const checked = task.completed ? "checked" : "";
    const doneClass = task.completed ? "task-done" : "";

    return `
      <label class="task-item ${doneClass}">
        <input type="checkbox" ${checked} disabled>
        <span>${escapeHTML(task.title || "Tarefa sem título")}</span>
      </label>
    `;
  }).join("");
}


// =====================================================
// HÁBITOS
// =====================================================

function updateHabitsDashboardData() {
  const habits = getStorageJSON("fluir-habits", []);
  const todayKey = getTodayKey();

  const total = habits.length;
  const completedToday = habits.filter((habit) => {
    return Array.isArray(habit.completedDates) && habit.completedDates.includes(todayKey);
  }).length;

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

  const habitsPanel = document.querySelector('[data-module-panel="habits"] .habit-list');

  if (!habitsPanel) return;

  if (!habits.length) {
    habitsPanel.innerHTML = `
      <div class="empty-dashboard-mini">
        <strong>Nenhum hábito ainda</strong>
        <p>Crie hábitos para acompanhar sua constância.</p>
      </div>
    `;
    return;
  }

  habitsPanel.innerHTML = habits.slice(0, 4).map((habit) => {
    const completedDates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
    const doneCount = completedDates.length;

    return `
      <div class="habit-row">
        <span>${escapeHTML(habit.title || "Hábito sem título")}</span>
        <p>${doneCount} registros</p>
        <strong>${habit.streak || 0}d</strong>
      </div>
    `;
  }).join("");
}


// =====================================================
// SONO
// =====================================================

function updateSleepDashboardData() {
  const sleepLogs = getStorageJSON("fluir-sleep-logs", []);
  const lastSleep = sleepLogs[0];

  const card = document.querySelector('[data-module-card="sleep"]');
  const sidePanel = document.querySelector('[data-module-panel="sleep"]');

  const sleepText = lastSleep
    ? getSleepDurationText(lastSleep)
    : "0h";

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");

    if (strong) strong.textContent = sleepText;
    if (small) small.textContent = lastSleep ? "última noite" : "sem registro";
  }

  if (sidePanel) {
    const strong = sidePanel.querySelector("strong");
    const p = sidePanel.querySelector("p");

    if (strong) strong.textContent = sleepText;
    if (p) p.textContent = lastSleep ? "Última noite" : "Nenhum registro";
  }
}

function getSleepDurationText(log) {
  if (log.durationText) return log.durationText;

  if (log.durationMinutes) {
    return formatMinutesDashboard(Number(log.durationMinutes));
  }

  if (log.durationHours) {
    return `${Number(log.durationHours).toFixed(1)}h`;
  }

  return "0h";
}

function formatMinutesDashboard(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!minutes) return `${hours}h`;

  return `${hours}h ${minutes}m`;
}


// =====================================================
// ÁGUA
// =====================================================

function updateWaterDashboardData() {
  const waterData = getStorageJSON("fluir-water", { goal: 2000, logs: {} });
  const todayKey = getTodayKey();

  const goalMl = Number(waterData.goal) || 2000;
  const todayMl = Number(waterData.logs?.[todayKey]) || 0;

  const percent = goalMl
    ? Math.min(Math.round((todayMl / goalMl) * 100), 100)
    : 0;

  const card = document.querySelector('[data-module-card="water"]');
  const sidePanel = document.querySelector('[data-module-panel="water"]');

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");
    const dots = card.querySelectorAll(".water-dots span");

    if (strong) {
      strong.textContent = `${todayMl}ml`;
    }

    if (small) {
      small.textContent = `de ${goalMl}ml`;
    }

    /*
      Mantém as bolinhas visuais do dashboard.
      Como agora é ml, cada bolinha representa uma parte da meta.
    */
    dots.forEach((dot, index) => {
      const dotLimit = ((index + 1) / dots.length) * goalMl;
      dot.classList.toggle("filled", todayMl >= dotLimit);
    });
  }

  if (sidePanel) {
    const strong = sidePanel.querySelector("strong");
    const p = sidePanel.querySelector("p");
    const dots = sidePanel.querySelectorAll(".water-dots span");

    if (strong) {
      strong.textContent = `${todayMl}ml`;
    }

    if (p) {
      p.textContent = `de ${goalMl}ml`;
    }

    dots.forEach((dot, index) => {
      const dotLimit = ((index + 1) / dots.length) * goalMl;
      dot.classList.toggle("filled", todayMl >= dotLimit);
    });
  }

  updateFocusByRealData(percent);
}

// =====================================================
// FINANÇAS
// =====================================================

function updateFinancesDashboardData() {
  const transactions = getStorageJSON("fluir-finances", []);

  const income = transactions
    .filter((item) => item.type === "income" || item.type === "entrada")
    .reduce((sum, item) => sum + (Number(item.value) || 0), 0);

  const expense = transactions
    .filter((item) => item.type === "expense" || item.type === "saida")
    .reduce((sum, item) => sum + (Number(item.value) || 0), 0);

  const balance = income - expense;

  const card = document.querySelector('[data-module-card="finances"]');
  const sidePanel = document.querySelector('[data-module-panel="finances"]');

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");

    if (strong) strong.textContent = formatCurrency(balance);
    if (small) small.textContent = "saldo atual";
  }

  if (sidePanel) {
    const strong = sidePanel.querySelector("strong");
    const smalls = sidePanel.querySelectorAll("small");

    if (strong) strong.textContent = formatCurrency(balance);

    if (smalls[0]) smalls[0].textContent = `Entrada ${formatCurrency(income)}`;
    if (smalls[1]) smalls[1].textContent = `Saída - ${formatCurrency(expense)}`;
  }
}


// =====================================================
// DIÁRIO
// =====================================================

function updateDiaryDashboardData() {
  const entries = getStorageJSON("fluir-diary", []);
  const todayKey = getTodayKey();

  const todayEntries = entries.filter((entry) => {
    return entry.date === todayKey || String(entry.createdAt || "").startsWith(todayKey);
  });

  const lastEntry = entries[0];

  const card = document.querySelector('[data-module-card="diary"]');
  const panel = document.querySelector('[data-module-panel="diary"]');

  if (card) {
    const strong = card.querySelector("strong");
    const small = card.querySelector("small");

    if (strong) strong.textContent = String(todayEntries.length);
    if (small) small.textContent = todayEntries.length === 1 ? "entrada hoje" : "entradas hoje";
  }

  if (panel) {
    const p = panel.querySelector("p");
    const link = panel.querySelector("a");

    if (p) {
      p.textContent = lastEntry
        ? lastEntry.text || lastEntry.title || "Última entrada registrada."
        : "Nenhuma entrada no diário ainda.";
    }

    if (link) {
      link.href = "diary.html";
      link.textContent = "Ver entradas →";
    }
  }
}


// =====================================================
// CONQUISTAS
// =====================================================

function updateAchievementsDashboardData() {
  const tasks = getStorageJSON("fluir-tasks", []);
  const habits = getStorageJSON("fluir-habits", []);
  const sleepLogs = getStorageJSON("fluir-sleep-logs", []);
  const diaryEntries = getStorageJSON("fluir-diary", []);
  const timelineEvents = getStorageJSON("fluir-timeline-events", []);

  const unlocked = [
    tasks.length >= 1,
    tasks.filter((task) => task.completed).length >= 5,
    habits.length >= 1,
    sleepLogs.length >= 1,
    diaryEntries.length >= 1,
    timelineEvents.length >= 1
  ].filter(Boolean).length;

  localStorage.setItem("fluir-dashboard-achievements", String(unlocked));
}


// =====================================================
// PLANO ATUAL
// =====================================================

function updatePlanDashboardData() {
  const currentPlan = localStorage.getItem("fluir-current-plan") || "Gratuito";

  const planElements = document.querySelectorAll("[data-dashboard-plan]");

  planElements.forEach((element) => {
    element.textContent = currentPlan;
  });
}


// =====================================================
// EVENTOS RECENTES
// =====================================================

function updateRecentEventsDashboardData() {
  const events = getStorageJSON("fluir-timeline-events", []);
  const eventList = document.querySelector(".event-list");

  if (!eventList) return;

  if (!events.length) {
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
    const dateLabel = formatEventDate(event.date || event.createdAt);
    const title = event.title || "Evento registrado";
    const description = event.description || event.category || "Registro do Fluir";

    return `
      <article>
        <span>${escapeHTML(dateLabel)}</span>
        <strong>${escapeHTML(title)}</strong>
        <p>${escapeHTML(description)}</p>
      </article>
    `;
  }).join("");
}

function formatEventDate(value) {
  if (!value) return "Hoje";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(5).replace("-", "/");
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  }).replace(".", "").toUpperCase();
}


// =====================================================
// FOCO DO DIA COM DADOS REAIS
// Usa tarefas e hábitos como base principal.
// =====================================================

function updateFocusByRealData(waterPercent = 0) {
  const tasks = getStorageJSON("fluir-tasks", []);
  const habits = getStorageJSON("fluir-habits", []);
  const todayKey = getTodayKey();

  const taskPercent = tasks.length
    ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100)
    : 0;

  const habitPercent = habits.length
    ? Math.round((habits.filter((habit) => {
        return Array.isArray(habit.completedDates) && habit.completedDates.includes(todayKey);
      }).length / habits.length) * 100)
    : 0;

  const values = [taskPercent, habitPercent, waterPercent].filter((value) => value > 0);
  const finalPercent = values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;

  if (focusPercent) {
    focusPercent.textContent = `${finalPercent}%`;
  }

  const focusBar = document.querySelector(".focus-bar span");

  if (focusBar) {
    focusBar.style.width = `${finalPercent}%`;
  }
}


// =====================================================
// DATA DE HOJE
// =====================================================

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =====================================================
// CARDS DO DASHBOARD CLICÁVEIS
// Leva cada card de resumo para sua tela completa
// =====================================================

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

    card.style.cursor = "pointer";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("title", "Abrir módulo");

    card.addEventListener("click", function () {
      window.location.href = route;
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = route;
      }
    });
  });
}
// =====================================================
// 18. INICIALIZAÇÃO DO DASHBOARD
// =====================================================

function initDashboard() {
  console.log("initDashboard rodou");

  applySavedTheme();
  updateWelcomeArea();
  applySelectedModules();
  setupNavigation();

  updateDashboardRealData();

  setupTasksInteraction();
  setupDashboardCardLinks();

  applyFinancePreferences();
  applySleepPreferences();
  applyWaterPreferences();
  showSetupNoticeIfNeeded();
}

initDashboard();