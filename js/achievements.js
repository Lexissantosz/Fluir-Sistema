// =====================================================
// FLUIR — CONQUISTAS
// JavaScript puro para calcular e renderizar conquistas
// =====================================================


// =====================================================
// 1. ELEMENTOS PRINCIPAIS
// =====================================================

const body = document.body;

const welcomeTitle = document.getElementById("welcomeTitle");
const avatarBtn = document.getElementById("avatarBtn");

const moduleLinks = document.querySelectorAll(".module-link");

const sidebarUnlocked = document.getElementById("sidebarUnlocked");
const sidebarProgressBar = document.getElementById("sidebarProgressBar");
const sidebarAchievementText = document.getElementById("sidebarAchievementText");

const unlockedCount = document.getElementById("unlockedCount");
const totalCount = document.getElementById("totalCount");
const generalProgress = document.getElementById("generalProgress");
const nextAchievement = document.getElementById("nextAchievement");

const featuredTitle = document.getElementById("featuredTitle");
const featuredText = document.getElementById("featuredText");

const achievementsGrid = document.getElementById("achievementsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

const achievementModal = document.getElementById("achievementModal");
const closeAchievementModal = document.getElementById("closeAchievementModal");

const modalSymbol = document.getElementById("modalSymbol");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalProgressText = document.getElementById("modalProgressText");
const modalProgressFill = document.getElementById("modalProgressFill");

let activeFilter = "all";


// =====================================================
// 2. FUNÇÕES DE LOCALSTORAGE
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
// 3. TEMA
// A tela apenas aplica o tema salvo.
// A troca fica em Configurações ou Perfil.
// =====================================================

function applySavedTheme() {
  const savedTheme = localStorage.getItem("fluir-theme") || "light";

  if (savedTheme === "dark") {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }
}


// =====================================================
// 4. DADOS DO USUÁRIO
// =====================================================

function getSetupData() {
  return getStorageJSON("fluir-setup", {
    user: {
      name: "Usuário",
      nickname: "Usuário"
    },
    modules: {}
  });
}

function getDisplayName() {
  const setupData = getSetupData();
  const user = setupData.user || {};

  return user.nickname || user.name || "Usuário";
}

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase() || "F";
}

function updateUserArea() {
  const name = getDisplayName();

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${name}`;
  }

  if (avatarBtn) {
    avatarBtn.textContent = getInitial(name);
  }
}


// =====================================================
// 5. ESCONDER MÓDULOS DESATIVADOS
// =====================================================

function hideDisabledModules() {
  const setupData = getSetupData();
  const savedModules = setupData.modules;

  if (!savedModules) return;

  const activeModules = Object.keys(savedModules).filter((moduleName) => {
    return savedModules[moduleName] === true;
  });

  if (!activeModules.length) return;

  moduleLinks.forEach((link) => {
    const moduleName = link.dataset.module;

    if (!activeModules.includes(moduleName)) {
      link.style.display = "none";
    }
  });
}


// =====================================================
// 6. DADOS DOS MÓDULOS
// =====================================================

function getModuleData() {
  return {
    tasks: getStorageJSON("fluir-tasks", []),
    habits: getStorageJSON("fluir-habits", []),
    sleep: getStorageJSON("fluir-sleep-logs", []),
    water: getStorageJSON("fluir-water", { logs: {} }),
    finances: getStorageJSON("fluir-finances", []),
    diary: getStorageJSON("fluir-diary", []),
    nutrition: getStorageJSON("fluir-nutrition", []),
    physicalHealth: getStorageJSON("fluir-physical-health", []),
    menstrualCycle: getStorageJSON("fluir-menstrual-cycle", []),
    attachments: getStorageJSON("fluir-attachments", []),
    timeline: getStorageJSON("fluir-timeline-events", [])
  };
}


// =====================================================
// 7. REGRAS DAS CONQUISTAS
// Cada conquista tem uma função que calcula progresso.
// =====================================================

function buildAchievements() {
  const data = getModuleData();

  const completedTasks = data.tasks.filter((task) => task.completed).length;

  const completedHabitsToday = data.habits.filter((habit) => {
    const today = getTodayKey();

    return Array.isArray(habit.completedDates) && habit.completedDates.includes(today);
  }).length;

  const sleepGoalHits = data.sleep.filter((log) => {
    const hours = Number(log.durationHours) || 0;

    return hours >= 7;
  }).length;

  const waterLogs = data.water.logs || {};
  const waterGoal = Number(data.water.goal) || 8;
  const waterGoalHits = Object.values(waterLogs).filter((value) => {
    return Number(value) >= waterGoal;
  }).length;

  const incomeTransactions = data.finances.filter((item) => {
    return item.type === "income" || item.type === "entrada";
  }).length;

  const expenseTransactions = data.finances.filter((item) => {
    return item.type === "expense" || item.type === "saida";
  }).length;

  return [
    {
      id: "first-step",
      category: "all",
      icon: "✧",
      title: "O início",
      description: "Faça seu primeiro registro em qualquer módulo do Fluir.",
      current: data.timeline.length + data.tasks.length + data.habits.length + data.sleep.length + data.diary.length,
      target: 1
    },
    {
      id: "first-task",
      category: "tasks",
      icon: "☑",
      title: "Primeira tarefa",
      description: "Crie sua primeira tarefa no Fluir.",
      current: data.tasks.length,
      target: 1
    },
    {
      id: "five-tasks",
      category: "tasks",
      icon: "▦",
      title: "Mente organizada",
      description: "Conclua 5 tarefas.",
      current: completedTasks,
      target: 5
    },
    {
      id: "twenty-tasks",
      category: "tasks",
      icon: "▣",
      title: "Fluxo produtivo",
      description: "Conclua 20 tarefas.",
      current: completedTasks,
      target: 20
    },
    {
      id: "first-habit",
      category: "habits",
      icon: "◌",
      title: "Primeiro hábito",
      description: "Crie seu primeiro hábito.",
      current: data.habits.length,
      target: 1
    },
    {
      id: "habit-day",
      category: "habits",
      icon: "♡",
      title: "Hoje eu continuei",
      description: "Conclua pelo menos 1 hábito hoje.",
      current: completedHabitsToday,
      target: 1
    },
    {
      id: "five-habits",
      category: "habits",
      icon: "◇",
      title: "Rotina em construção",
      description: "Crie 5 hábitos.",
      current: data.habits.length,
      target: 5
    },
    {
      id: "first-sleep",
      category: "sleep",
      icon: "☾",
      title: "Primeira noite registrada",
      description: "Registre sua primeira noite de sono.",
      current: data.sleep.length,
      target: 1
    },
    {
      id: "sleep-goal-week",
      category: "sleep",
      icon: "☽",
      title: "Sono cuidado",
      description: "Bata a meta de sono 7 vezes.",
      current: sleepGoalHits,
      target: 7
    },
    {
      id: "sleep-goal-month",
      category: "sleep",
      icon: "✦",
      title: "Um mês mais leve",
      description: "Bata a meta de sono 30 vezes.",
      current: sleepGoalHits,
      target: 30
    },
    {
      id: "first-water",
      category: "water",
      icon: "♢",
      title: "Primeiro gole",
      description: "Registre água pela primeira vez.",
      current: Object.keys(waterLogs).length,
      target: 1
    },
    {
      id: "water-week",
      category: "water",
      icon: "♧",
      title: "Hidratação constante",
      description: "Bata sua meta de água 7 vezes.",
      current: waterGoalHits,
      target: 7
    },
    {
      id: "first-diary",
      category: "diary",
      icon: "▤",
      title: "Primeiro registro emocional",
      description: "Escreva sua primeira entrada no diário.",
      current: data.diary.length,
      target: 1
    },
    {
      id: "diary-ten",
      category: "diary",
      icon: "♡",
      title: "Autoconhecimento",
      description: "Escreva 10 entradas no diário.",
      current: data.diary.length,
      target: 10
    },
    {
      id: "first-finance",
      category: "finances",
      icon: "$",
      title: "Primeiro lançamento",
      description: "Registre sua primeira movimentação financeira.",
      current: data.finances.length,
      target: 1
    },
    {
      id: "finance-balance",
      category: "finances",
      icon: "▣",
      title: "Olhar financeiro",
      description: "Registre pelo menos 1 receita e 1 despesa.",
      current: incomeTransactions > 0 && expenseTransactions > 0 ? 1 : 0,
      target: 1
    },
    {
      id: "first-meal",
      category: "nutrition",
      icon: "◒",
      title: "Primeira refeição",
      description: "Registre sua primeira refeição.",
      current: data.nutrition.length,
      target: 1
    },
    {
      id: "first-health",
      category: "physicalHealth",
      icon: "✦",
      title: "Corpo em atenção",
      description: "Registre sua primeira informação de saúde física.",
      current: data.physicalHealth.length,
      target: 1
    },
    {
      id: "first-cycle",
      category: "menstrualCycle",
      icon: "◍",
      title: "Ciclo acompanhado",
      description: "Faça seu primeiro registro do ciclo menstrual.",
      current: data.menstrualCycle.length,
      target: 1
    },
    {
      id: "first-attachment",
      category: "attachments",
      icon: "⌁",
      title: "Memória guardada",
      description: "Salve seu primeiro anexo, link ou nota.",
      current: data.attachments.length,
      target: 1
    }
  ].map((achievement) => {
    const progress = Math.min(achievement.current / achievement.target, 1);
    const unlocked = progress >= 1;

    return {
      ...achievement,
      progress,
      unlocked
    };
  });
}


// =====================================================
// 8. RENDERIZAR RESUMOS
// =====================================================

function renderSummary(achievements) {
  const total = achievements.length;
  const unlocked = achievements.filter((item) => item.unlocked).length;
  const percentage = total ? Math.round((unlocked / total) * 100) : 0;

  if (unlockedCount) unlockedCount.textContent = unlocked;
  if (totalCount) totalCount.textContent = total;
  if (generalProgress) generalProgress.textContent = `${percentage}%`;

  if (sidebarUnlocked) sidebarUnlocked.textContent = `${percentage}%`;

  if (sidebarProgressBar) {
    sidebarProgressBar.style.width = `${percentage}%`;
  }

  if (sidebarAchievementText) {
    sidebarAchievementText.textContent =
      unlocked > 0
        ? `${unlocked} conquistas desbloqueadas.`
        : "Comece registrando sua rotina.";
  }

  const next = achievements.find((item) => !item.unlocked);

  if (nextAchievement) {
    nextAchievement.textContent = next ? next.title : "Tudo liberado";
  }

  if (featuredTitle && featuredText) {
    const featured = next || achievements[achievements.length - 1];

    featuredTitle.textContent = featured.title;
    featuredText.textContent = featured.description;
  }
}


// =====================================================
// 9. RENDERIZAR GRID
// =====================================================

function renderAchievements() {
  const achievements = buildAchievements();

  renderSummary(achievements);

  const filtered = achievements.filter((achievement) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unlocked") return achievement.unlocked;
    if (activeFilter === "locked") return !achievement.unlocked;

    return achievement.category === activeFilter;
  });

  if (!achievementsGrid) return;

  if (!filtered.length) {
    achievementsGrid.innerHTML = `
      <div class="achievement-card">
        <div class="achievement-icon">◇</div>
        <h3>Nada encontrado</h3>
        <p>Nenhuma conquista aparece neste filtro por enquanto.</p>
      </div>
    `;
    return;
  }

  achievementsGrid.innerHTML = filtered.map((achievement) => {
    const percent = Math.round(achievement.progress * 100);
    const status = achievement.unlocked ? "Liberada" : "Bloqueada";
    const className = achievement.unlocked ? "unlocked" : "locked";

    return `
      <article class="achievement-card ${className}" data-achievement-id="${achievement.id}">
        <span class="achievement-status">${status}</span>

        <div class="achievement-icon">${achievement.icon}</div>

        <h3>${escapeHTML(achievement.title)}</h3>
        <p>${escapeHTML(achievement.description)}</p>

        <div class="achievement-progress">
          <small>${Math.min(achievement.current, achievement.target)} de ${achievement.target}</small>

          <div class="progress-line">
            <span style="width: ${percent}%"></span>
          </div>
        </div>
      </article>
    `;
  }).join("");

  setupAchievementCards(achievements);
}


// =====================================================
// 10. EVENTOS DOS CARDS
// =====================================================

function setupAchievementCards(achievements) {
  const cards = document.querySelectorAll(".achievement-card[data-achievement-id]");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const achievementId = card.dataset.achievementId;
      const achievement = achievements.find((item) => item.id === achievementId);

      if (achievement) {
        openAchievementModal(achievement);
      }
    });
  });
}


// =====================================================
// 11. FILTROS
// =====================================================

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      renderAchievements();
    });
  });
}


// =====================================================
// 12. MODAL
// =====================================================

function openAchievementModal(achievement) {
  if (!achievementModal) return;

  const percent = Math.round(achievement.progress * 100);

  if (modalSymbol) modalSymbol.textContent = achievement.icon;
  if (modalTitle) modalTitle.textContent = achievement.title;
  if (modalDescription) modalDescription.textContent = achievement.description;

  if (modalProgressText) {
    modalProgressText.textContent = `${Math.min(achievement.current, achievement.target)} de ${achievement.target} concluído`;
  }

  if (modalProgressFill) {
    modalProgressFill.style.width = `${percent}%`;
  }

  achievementModal.classList.add("show");
}

function closeModal() {
  if (achievementModal) {
    achievementModal.classList.remove("show");
  }
}

if (closeAchievementModal) {
  closeAchievementModal.addEventListener("click", closeModal);
}

if (achievementModal) {
  achievementModal.addEventListener("click", (event) => {
    if (event.target === achievementModal) {
      closeModal();
    }
  });
}


// =====================================================
// 13. UTILITÁRIOS
// =====================================================

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// =====================================================
// 14. INICIALIZAÇÃO
// =====================================================

applySavedTheme();
updateUserArea();
hideDisabledModules();
setupFilters();
renderAchievements();