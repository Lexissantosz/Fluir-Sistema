// =====================================================
// FLUIR — HÁBITOS
// JavaScript puro para controlar a tela de hábitos
// =====================================================


// =====================================================
// 1. ELEMENTOS PRINCIPAIS DA PÁGINA
// =====================================================

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

const moduleLinks = document.querySelectorAll(".module-link");

const habitList = document.getElementById("habitList");
const emptyState = document.getElementById("emptyState");
const habitListSubtitle = document.getElementById("habitListSubtitle");

const totalHabits = document.getElementById("totalHabits");
const completedTodayHabits = document.getElementById("completedTodayHabits");
const bestStreak = document.getElementById("bestStreak");
const weeklyProgress = document.getElementById("weeklyProgress");

const sidebarHabitPercent = document.getElementById("sidebarHabitPercent");
const sidebarHabitBar = document.getElementById("sidebarHabitBar");
const sidebarHabitText = document.getElementById("sidebarHabitText");

const focusRecommendation = document.getElementById("focusRecommendation");
const focusMiniList = document.getElementById("focusMiniList");
const habitMiniTimeline = document.getElementById("habitMiniTimeline");

const weekText = document.getElementById("weekText");

const filterButtons = document.querySelectorAll(".filter-btn");

const newHabitBtn = document.getElementById("newHabitBtn");
const habitModal = document.getElementById("habitModal");
const closeHabitModalBtn = document.getElementById("closeHabitModalBtn");
const saveHabitBtn = document.getElementById("saveHabitBtn");

const habitTitleInput = document.getElementById("habitTitleInput");
const habitCategorySelect = document.getElementById("habitCategorySelect");
const habitDaysPicker = document.getElementById("habitDaysPicker");
const habitDayButtons = document.querySelectorAll(".habit-day-btn");
const habitDaysFeedback = document.getElementById("habitDaysFeedback");
const selectAllDaysBtn = document.getElementById("selectAllDaysBtn");
const selectAlternateDaysBtn = document.getElementById("selectAlternateDaysBtn");

let selectedHabitDays = [];
const habitDescriptionInput = document.getElementById("habitDescriptionInput");
const habitFormMessage = document.getElementById("habitFormMessage");

function habitsT(key, fallback = "", variables = {}) {
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

function habitsLocale() {
  return window.FluirI18n
    ? window.FluirI18n.getLocale()
    : "pt-BR";
}

function getHabitCategoryLabel(category) {
  const categories = {
    "Saúde": ["habits.category.health", "Saúde"],
    "Estudos": ["habits.category.study", "Estudos"],
    "Casa": ["habits.category.home", "Casa"],
    "Pessoal": ["habits.category.personal", "Pessoal"],
    "Produtividade": ["habits.category.productivity", "Produtividade"],
    "Autocuidado": ["habits.category.selfCare", "Autocuidado"]
  };

  const entry = categories[category];

  if (!entry) {
    return category || habitsT("habits.category.personal", "Pessoal");
  }

  return habitsT(entry[0], entry[1]);
}

function getHabitDisplayData(habit) {
  const demoHabits = {
    1: {
      title: "Beber água",
      titleKey: "habits.demo.water.title",
      description: "Manter hidratação ao longo do dia.",
      descriptionKey: "habits.demo.water.description"
    },
    2: {
      title: "Ler 20 páginas",
      titleKey: "habits.demo.read.title",
      description: "Leitura leve para manter constância.",
      descriptionKey: "habits.demo.read.description"
    },
    3: {
      title: "Meditar 10 minutos",
      titleKey: "habits.demo.meditate.title",
      description: "Pausar, respirar e desacelerar.",
      descriptionKey: "habits.demo.meditate.description"
    },
    4: {
      title: "Estudar",
      titleKey: "habits.demo.study.title",
      description: "Estudar pelo menos 40 minutos.",
      descriptionKey: "habits.demo.study.description"
    }
  };

  const demo = demoHabits[Number(habit.id)];
  const title =
    demo && habit.title === demo.title
      ? habitsT(demo.titleKey, demo.title)
      : habit.title;

  const description =
    demo && habit.description === demo.description
      ? habitsT(demo.descriptionKey, demo.description)
      : habit.description;

  return {
    title,
    description,
    category: getHabitCategoryLabel(habit.category)
  };
}

const resetTodayBtn = document.getElementById("resetTodayBtn");


// =====================================================
// 2. CONFIGURAÇÃO PADRÃO
// Caso ainda não exista setup salvo no localStorage
// =====================================================

const defaultSetup = {
  user: {
    name: "Você",
    nickname: "Você",
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
// 3. DADOS PADRÃO DE HÁBITOS
// Usados quando ainda não existe nenhum hábito salvo
// =====================================================

const defaultHabits = [
  {
    id: 1,
    title: "Beber água",
    description: "Manter hidratação ao longo do dia.",
    category: "Saúde",
    weeklyGoal: 7,
    streak: 4,
    completedDates: [getTodayKey()],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Ler 20 páginas",
    description: "Leitura leve para manter constância.",
    category: "Pessoal",
    weeklyGoal: 5,
    streak: 6,
    completedDates: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Meditar 10 minutos",
    description: "Pausar, respirar e desacelerar.",
    category: "Autocuidado",
    weeklyGoal: 3,
    streak: 2,
    completedDates: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: "Estudar",
    description: "Estudar pelo menos 40 minutos.",
    category: "Estudos",
    weeklyGoal: 5,
    streak: 3,
    completedDates: [getTodayKey()],
    createdAt: new Date().toISOString()
  }
];


// =====================================================
// 4. ESTADO DA TELA
// =====================================================

let habits = [];
let activeFilter = "all";


// =====================================================
// 5. LER CONFIGURAÇÃO SALVA DO SETUP
// =====================================================

const setupData = FluirAPI.getSetup(defaultSetup);


// =====================================================
// 6. DATA DE HOJE EM FORMATO SIMPLES
// =====================================================

function getTodayKey() {
  const now = new Date();

  return toLocalDateKey(now);
}


// =====================================================
// 7. HORA ATUAL FORMATADA
// =====================================================

function getCurrentTimeLabel() {
  const now = new Date();

  return now.toLocaleTimeString(habitsLocale(), {
    hour: "2-digit",
    minute: "2-digit"
  });
}


// =====================================================
// 8. PEGAR DIAS DA SEMANA ATUAL
// Retorna 7 datas, começando no domingo
// =====================================================

function getCurrentWeekKeys() {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  const week = [];

  for (let index = 0; index < 7; index++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);
    week.push(toLocalDateKey(date));
  }

  return week;
}


// =====================================================
// 9. TEMA CLARO / ESCURO
// =====================================================

function applySavedTheme() {
  const savedTheme = FluirAPI.getTheme();

  if (savedTheme === "dark") {
    body.classList.add("dark");

    if (themeBtn) {
      themeBtn.innerHTML = `<span>☼</span> ${habitsT("common.light", "Claro")}`;
    }
  } else {
    body.classList.remove("dark");

    if (themeBtn) {
      themeBtn.innerHTML = `<span>☾</span> ${habitsT("common.dark", "Escuro")}`;
    }
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDarkMode = body.classList.contains("dark");

    themeBtn.innerHTML = isDarkMode
      ? `<span>☼</span> ${habitsT("common.light", "Claro")}`
      : `<span>☾</span> ${habitsT("common.dark", "Escuro")}`;

    FluirAPI.saveTheme(isDarkMode ? "dark" : "light");
  });
}


// =====================================================
// 10. SAUDAÇÃO PERSONALIZADA
// =====================================================

function updateWelcomeArea() {
  const nickname = setupData.user?.nickname?.trim();
  const name = setupData.user?.name?.trim();

  const rawDisplayName = nickname || name || "";
  const displayName =
    rawDisplayName && rawDisplayName !== "Você"
      ? rawDisplayName
      : habitsT("common.you", "Você");

  if (welcomeTitle) {
    welcomeTitle.textContent = habitsT(
      "habits.welcome",
      "Olá, {name}",
      { name: displayName }
    );
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
    calmo: ["habits.subtitle.calm", "Pequenos passos repetidos também transformam."],
    direto: ["habits.subtitle.direct", "Veja seus hábitos, marque o que concluiu e siga."],
    motivador: ["habits.subtitle.motivating", "Constância cresce quando você aparece todos os dias."],
    delicado: ["habits.subtitle.gentle", "Com leveza, seus hábitos vão criando raízes."],
    neutro: ["habits.subtitle.neutral", "Acompanhe seus hábitos, sequência e progresso semanal."]
  };

  const [key, fallback] = subtitles[tone] || subtitles.calmo;
  return habitsT(key, fallback);
}


// =====================================================
// 11. ESCONDER MÓDULOS NÃO ATIVOS NO MENU
// =====================================================

function applySelectedModulesToMenu() {
  const modules = setupData.modules || defaultSetup.modules;

  moduleLinks.forEach((link) => {
    const moduleName = link.dataset.module;

    if (modules[moduleName]) {
      link.classList.remove("module-hidden");
    } else {
      link.classList.add("module-hidden");
    }
  });
}


// =====================================================
// 12. LOCALSTORAGE — HÁBITOS
// =====================================================

function loadHabits() {
  const savedHabits = localStorage.getItem("fluir-habits");

  if (!savedHabits) {
    habits = [...defaultHabits];
    saveHabits();
    return;
  }

  try {
    habits = JSON.parse(savedHabits);
  } catch (error) {
    console.warn("Erro ao ler hábitos salvos:", error);
    habits = [...defaultHabits];
    saveHabits();
  }
}

function saveHabits() {
  localStorage.setItem("fluir-habits", JSON.stringify(habits));
}


// =====================================================
// 13. LOCALSTORAGE — EVENTOS DA TIMELINE
// Quando cria/conclui/remove hábito, registramos um evento
// =====================================================

function saveTimelineEvent(eventData) {
  FluirAPI.saveTimelineEvent(eventData);
}

function createHabitTimelineEvent(title, description) {
  saveTimelineEvent({
    id: Date.now(),
    title,
    category: "habits",
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  });
}


// =====================================================
// 14. EVITAR HTML INDESEJADO
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
// 15. VERIFICAR SE HÁBITO FOI CONCLUÍDO HOJE
// =====================================================

function isHabitCompletedToday(habit) {
  return Array.isArray(habit.completedDates) && habit.completedDates.includes(getTodayKey());
}


// =====================================================
// 16. CONTAR CONCLUSÕES DA SEMANA DE UM HÁBITO
// =====================================================

function getHabitWeeklyCount(habit) {
  const weekKeys = getCurrentWeekKeys();

  return (habit.completedDates || []).filter((date) => {
    return weekKeys.includes(date);
  }).length;
}


// =====================================================
// 17. FILTRAR HÁBITOS
// =====================================================

function habitMatchesFilter(habit) {
  if (activeFilter === "all") {
    return true;
  }

  if (activeFilter === "pending") {
    return !isHabitCompletedToday(habit);
  }

  if (activeFilter === "completed") {
    return isHabitCompletedToday(habit);
  }

  if (activeFilter === "highStreak") {
    return Number(habit.streak || 0) >= 3;
  }

  return true;
}

function getFilteredHabits() {
  let filtered = habits.filter(habitMatchesFilter);

  if (activeFilter === "highStreak") {
    filtered = filtered.sort((a, b) => Number(b.streak || 0) - Number(a.streak || 0));
  }

  return filtered;
}


// =====================================================
// 18. RENDERIZAR LISTA DE HÁBITOS
// =====================================================

function renderHabits() {
  if (!habitList) {
    return;
  }

  const filteredHabits = getFilteredHabits();

  habitList.innerHTML = "";

  filteredHabits.forEach((habit) => {
    const habitCard = createHabitCard(habit);
    habitList.appendChild(habitCard);
  });

  updateEmptyState(filteredHabits.length);
  updateHabitListSubtitle(filteredHabits.length);
  updateSummaryCards();
  updateSidebarProgress();
  renderFocusMiniList();
  renderWeekGrid();
  renderMiniTimeline();
}


// =====================================================
// 19. CRIAR CARD DE HÁBITO
// =====================================================

function createHabitCard(habit) {
  const completedToday = isHabitCompletedToday(habit);
  const weeklyCount = getHabitWeeklyCount(habit);
  const weeklyGoal = Number(habit.weeklyGoal || 7);
  const weekKeys = getCurrentWeekKeys();
  const displayHabit = getHabitDisplayData(habit);
  const streak = Number(habit.streak || 0);

  const card = document.createElement("article");

  card.className = `habit-card ${completedToday ? "completed-today" : ""}`;
  card.dataset.id = habit.id;

  const weekDots = weekKeys.map((dateKey) => {
    const done = (habit.completedDates || []).includes(dateKey);

    return `<span class="${done ? "done" : ""}">${done ? "✓" : "○"}</span>`;
  }).join("");

  card.innerHTML = `
    <button class="habit-check" type="button" title="${escapeHTML(habitsT("habits.markToday", "Marcar hábito de hoje"))}">
      ${completedToday ? "✓" : "○"}
    </button>

    <div class="habit-info">
      <strong>${escapeHTML(displayHabit.title)}</strong>
      <p>${escapeHTML(displayHabit.description || habitsT("habits.noNote", "Sem observação."))}</p>

      <div class="habit-meta">
        <span>${escapeHTML(displayHabit.category)}</span>
        <span>${escapeHTML(habitsT("habits.weekMeta", "{done}/{goal} na semana", { done: weeklyCount, goal: weeklyGoal }))}</span>
        <span>${escapeHTML(habitsT(
          streak === 1 ? "habits.streakDays.one" : "habits.streakDays.other",
          streak === 1 ? "{count} dia de sequência" : "{count} dias de sequência",
          { count: streak }
        ))}</span>
      </div>

      <div class="habit-week">
        ${weekDots}
      </div>
    </div>

    <div class="habit-actions">
      <button class="habit-action-btn delete-habit-btn" type="button" title="${escapeHTML(habitsT("habits.delete", "Excluir hábito"))}">
        ×
      </button>
    </div>
  `;

  const checkButton = card.querySelector(".habit-check");
  const deleteButton = card.querySelector(".delete-habit-btn");

  checkButton.addEventListener("click", () => {
    toggleHabitToday(habit.id);
  });

  deleteButton.addEventListener("click", () => {
    deleteHabit(habit.id);
  });

  return card;
}


// =====================================================
// 20. EMPTY STATE
// =====================================================

function updateEmptyState(visibleCount) {
  if (!emptyState) {
    return;
  }

  if (visibleCount === 0) {
    emptyState.classList.add("active");
  } else {
    emptyState.classList.remove("active");
  }
}

function updateHabitListSubtitle(visibleCount) {
  if (!habitListSubtitle) {
    return;
  }

  const suffix = visibleCount === 1 ? "one" : "other";
  const keys = {
    all: "habits.listSubtitle.all." + suffix,
    pending: "habits.listSubtitle.pending." + suffix,
    completed: "habits.listSubtitle.completed." + suffix,
    highStreak: "habits.listSubtitle.highStreak." + suffix
  };
  const fallbacks = {
    all: visibleCount === 1 ? "{count} hábito ativo." : "{count} hábitos ativos.",
    pending: visibleCount === 1 ? "{count} hábito pendente hoje." : "{count} hábitos pendentes hoje.",
    completed: visibleCount === 1 ? "{count} hábito concluído hoje." : "{count} hábitos concluídos hoje.",
    highStreak: visibleCount === 1 ? "{count} hábito com boa sequência." : "{count} hábitos com boa sequência."
  };

  habitListSubtitle.textContent = habitsT(
    keys[activeFilter] || keys.all,
    fallbacks[activeFilter] || fallbacks.all,
    { count: visibleCount }
  );
}


// =====================================================
// 21. CARDS DE RESUMO
// =====================================================

function updateSummaryCards() {
  const total = habits.length;
  const completedToday = habits.filter(isHabitCompletedToday).length;

  const best = habits.reduce((highest, habit) => {
    return Math.max(highest, Number(habit.streak || 0));
  }, 0);

  const totalWeeklyGoal = habits.reduce((sum, habit) => {
    return sum + Number(habit.weeklyGoal || 7);
  }, 0);

  const totalWeeklyDone = habits.reduce((sum, habit) => {
    return sum + getHabitWeeklyCount(habit);
  }, 0);

  const weeklyPercent = totalWeeklyGoal === 0
    ? 0
    : Math.round((totalWeeklyDone / totalWeeklyGoal) * 100);

  if (totalHabits) {
    totalHabits.textContent = total;
  }

  if (completedTodayHabits) {
    completedTodayHabits.textContent = completedToday;
  }

  if (bestStreak) {
    bestStreak.textContent = best;
  }

  if (weeklyProgress) {
    weeklyProgress.textContent = `${weeklyPercent}%`;
  }
}


// =====================================================
// 22. PROGRESSO DA SIDEBAR
// =====================================================

function updateSidebarProgress() {
  const total = habits.length;
  const completedToday = habits.filter(isHabitCompletedToday).length;

  const percent = total === 0 ? 0 : Math.round((completedToday / total) * 100);

  if (sidebarHabitPercent) {
    sidebarHabitPercent.textContent = `${percent}%`;
  }

  if (sidebarHabitBar) {
    sidebarHabitBar.style.width = `${percent}%`;
  }

  if (sidebarHabitText) {
    if (total === 0) {
      sidebarHabitText.textContent = habitsT(
        "habits.sidebarProgress.none",
        "Nenhum hábito registrado ainda."
      );
      return;
    }

    sidebarHabitText.textContent = habitsT(
      total === 1
        ? "habits.sidebarProgress.one"
        : "habits.sidebarProgress.other",
      total === 1
        ? "{completed} de {total} hábito concluído hoje."
        : "{completed} de {total} hábitos concluídos hoje.",
      { completed: completedToday, total }
    );
  }
}


// =====================================================
// 23. FOCO RECOMENDADO
// =====================================================

function renderFocusMiniList() {
  if (!focusMiniList) {
    return;
  }

  const pendingHabits = habits
    .filter((habit) => !isHabitCompletedToday(habit))
    .sort((a, b) => Number(b.streak || 0) - Number(a.streak || 0))
    .slice(0, 3);

  focusMiniList.innerHTML = "";

  if (pendingHabits.length === 0) {
    if (focusRecommendation) {
      focusRecommendation.textContent = habitsT(
        "habits.focus.completed",
        "Você concluiu seus hábitos de hoje. Continue com calma."
      );
    }

    focusMiniList.innerHTML = `
      <div class="focus-mini-item">
        <strong>${escapeHTML(habitsT("habits.focus.allDoneTitle", "Tudo certo por hoje"))}</strong>
        <span>${escapeHTML(habitsT("habits.focus.allDoneText", "Você manteve sua constância."))}</span>
      </div>
    `;

    return;
  }

  if (focusRecommendation) {
    focusRecommendation.textContent = habitsT(
      "habits.focus.recommendation",
      "Comece pelos hábitos que ajudam a manter sua sequência."
    );
  }

  pendingHabits.forEach((habit) => {
    const item = document.createElement("div");
    const displayHabit = getHabitDisplayData(habit);
    const streak = Number(habit.streak || 0);

    item.className = "focus-mini-item";

    item.innerHTML = `
      <strong>${escapeHTML(displayHabit.title)}</strong>
      <span>${escapeHTML(habitsT(
        streak === 1 ? "habits.focusMeta.one" : "habits.focusMeta.other",
        streak === 1
          ? "{count} dia de sequência · {category}"
          : "{count} dias de sequência · {category}",
        { count: streak, category: displayHabit.category }
      ))}</span>
    `;

    focusMiniList.appendChild(item);
  });
}


// =====================================================
// 24. RESUMO SEMANAL LATERAL
// Marca um dia como feito se qualquer hábito foi concluído nele
// =====================================================

function renderWeekGrid() {
  const weekKeys = getCurrentWeekKeys();

  weekKeys.forEach((dateKey, index) => {
    const dayElement = document.getElementById(`day${index}`);

    if (!dayElement) {
      return;
    }

    const hasAnyCompletion = habits.some((habit) => {
      return (habit.completedDates || []).includes(dateKey);
    });

    if (hasAnyCompletion) {
      dayElement.textContent = "✓";
      dayElement.classList.add("done");
    } else {
      dayElement.textContent = "○";
      dayElement.classList.remove("done");
    }
  });

  const completedToday = habits.filter(isHabitCompletedToday).length;
  const total = habits.length;

  if (weekText) {
    if (total === 0) {
      weekText.textContent = habitsT(
        "habits.weekText.empty",
        "Crie seu primeiro hábito para começar a acompanhar sua semana."
      );
      return;
    }

    weekText.textContent = habitsT(
      total === 1
        ? "habits.weekText.progress.one"
        : "habits.weekText.progress.other",
      total === 1
        ? "Hoje você concluiu {completed} de {total} hábito."
        : "Hoje você concluiu {completed} de {total} hábitos.",
      { completed: completedToday, total }
    );
  }
}


// =====================================================
// 25. MINI TIMELINE DE AÇÕES
// =====================================================

function renderMiniTimeline() {
  if (!habitMiniTimeline) {
    return;
  }

  const recentHabits = [...habits]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  habitMiniTimeline.innerHTML = "";

  if (recentHabits.length === 0) {
    habitMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>${escapeHTML(habitsT("habits.mini.noneTitle", "Nenhuma ação ainda"))}</strong>
          ${escapeHTML(habitsT("habits.mini.noneText", "Crie seu primeiro hábito."))}
        </p>
      </div>
    `;
    return;
  }

  recentHabits.forEach((habit) => {
    const item = document.createElement("div");
    const displayHabit = getHabitDisplayData(habit);

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${getCurrentTimeLabel()}</time>
      <p>
        <strong>${escapeHTML(
          isHabitCompletedToday(habit)
            ? habitsT("habits.mini.completed", "Hábito concluído")
            : habitsT("habits.mini.active", "Hábito ativo")
        )}</strong>
        ${escapeHTML(displayHabit.title)}
      </p>
    `;

    habitMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 26. MODAL — MENSAGENS
// =====================================================

function showHabitFormMessage(message, type = "error") {
  if (!habitFormMessage) {
    return;
  }

  habitFormMessage.textContent = message;
  habitFormMessage.className = `habit-form-message show ${type}`;
}

function clearHabitFormMessage() {
  if (!habitFormMessage) {
    return;
  }

  habitFormMessage.textContent = "";
  habitFormMessage.className = "habit-form-message";
}

function clearHabitInvalidFields() {
  document.querySelectorAll(".habit-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 27. MODAL — ABRIR, FECHAR E LIMPAR
// =====================================================

function openHabitModal() {
  if (!habitModal) {
    return;
  }

  clearHabitModalFields();
  habitModal.classList.add("active");

  setTimeout(() => {
    if (habitTitleInput) {
      habitTitleInput.focus();
    }
  }, 100);
}

function closeHabitModal() {
  if (!habitModal) {
    return;
  }

  habitModal.classList.remove("active");
}

function clearHabitModalFields() {
  if (habitTitleInput) {
    habitTitleInput.value = "";
  }

  if (habitCategorySelect) {
    habitCategorySelect.value = "Saúde";
  }

  selectedHabitDays = [];

  habitDayButtons.forEach((button) => {
    button.classList.remove("selected");
  });

  if (habitDaysPicker) {
    habitDaysPicker.classList.remove("invalid");
  }

  if (habitDaysFeedback) {
    habitDaysFeedback.textContent = "";
  }

  if (habitDescriptionInput) {
    habitDescriptionInput.value = "";
  }

  clearHabitFormMessage();
  clearHabitInvalidFields();
}

const ALL_HABIT_DAYS = [0, 1, 2, 3, 4, 5, 6];
const ALTERNATE_DAYS_A = [1, 3, 5]; // seg, qua, sex
const ALTERNATE_DAYS_B = [2, 4, 6]; // ter, qui, sáb

function isSameHabitDaySet(daysA, daysB) {
  if (daysA.length !== daysB.length) {
    return false;
  }

  const sortedA = [...daysA].sort((a, b) => a - b);
  const sortedB = [...daysB].sort((a, b) => a - b);

  return sortedA.every((value, index) => value === sortedB[index]);
}

function setSelectedHabitDays(days) {
  selectedHabitDays = [...days];

  habitDayButtons.forEach((button) => {
    const day = Number(button.dataset.day);
    button.classList.toggle("selected", selectedHabitDays.includes(day));
  });

  if (habitDaysPicker) {
    habitDaysPicker.classList.remove("invalid");
  }

  if (habitDaysFeedback) {
    habitDaysFeedback.textContent = "";
  }
}


// =====================================================
// 28. CRIAR NOVO HÁBITO
// =====================================================

function saveNewHabit() {
  clearHabitFormMessage();
  clearHabitInvalidFields();

  const title = habitTitleInput?.value.trim();
  const category = habitCategorySelect?.value || "Saúde";
  const weekDays = [...selectedHabitDays].sort((a, b) => a - b);
  const weeklyGoal = weekDays.length;
  const description = habitDescriptionInput?.value.trim() || "";

  if (!title || title.length < 2) {
    if (habitTitleInput) {
      habitTitleInput.classList.add("invalid");
      habitTitleInput.focus();
    }

    showHabitFormMessage(habitsT("habits.validation.invalidName", "Digite um nome válido para o hábito."));
    return;
  }

  if (weekDays.length === 0) {
    if (habitDaysPicker) {
      habitDaysPicker.classList.add("invalid");
    }

    if (habitDaysFeedback) {
      habitDaysFeedback.textContent = habitsT("habits.validation.selectOneDay", "Selecione ao menos um dia da semana.");
    }

    showHabitFormMessage(habitsT("habits.validation.selectRepeatDays", "Selecione os dias em que o hábito vai se repetir."));
    return;
  }

  const newHabit = {
    id: Date.now(),
    title,
    description,
    category,
    weeklyGoal,
    weekDays,
    streak: 0,
    completedDates: [],
    createdAt: new Date().toISOString()
  };

  habits.unshift(newHabit);
  saveHabits();

  createHabitTimelineEvent("Hábito criado", title);

  renderHabits();

  showHabitFormMessage(habitsT("habits.savedSuccess", "Hábito salvo com sucesso."), "success");

  setTimeout(() => {
    closeHabitModal();
    clearHabitModalFields();
  }, 450);
}


// =====================================================
// 29. MARCAR / DESMARCAR HÁBITO DE HOJE
// =====================================================

function toggleHabitToday(habitId) {
  const habit = habits.find((item) => item.id === habitId);

  if (!habit) {
    return;
  }

  if (!Array.isArray(habit.completedDates)) {
    habit.completedDates = [];
  }

  const todayKey = getTodayKey();
  const completedToday = habit.completedDates.includes(todayKey);

  if (completedToday) {
    habit.completedDates = habit.completedDates.filter((date) => date !== todayKey);
    habit.streak = Math.max(0, Number(habit.streak || 0) - 1);

    createHabitTimelineEvent("Hábito desmarcado", habit.title);
  } else {
    habit.completedDates.push(todayKey);
    habit.streak = Number(habit.streak || 0) + 1;

    createHabitTimelineEvent("Hábito concluído", habit.title);
  }

  saveHabits();
  renderHabits();
}


// =====================================================
// 30. EXCLUIR HÁBITO
// =====================================================

function deleteHabit(habitId) {
  const habit = habits.find((item) => item.id === habitId);

  habits = habits.filter((item) => item.id !== habitId);

  saveHabits();

  if (habit) {
    createHabitTimelineEvent("Hábito removido", habit.title);
  }

  renderHabits();
}


// =====================================================
// 31. REINICIAR CONCLUSÕES DE HOJE
// =====================================================

function resetTodayHabits() {
  const todayKey = getTodayKey();

  habits = habits.map((habit) => {
    const wasCompletedToday = (habit.completedDates || []).includes(todayKey);

    if (!wasCompletedToday) {
      return habit;
    }

    return {
      ...habit,
      streak: Math.max(0, Number(habit.streak || 0) - 1),
      completedDates: (habit.completedDates || []).filter((date) => date !== todayKey)
    };
  });

  saveHabits();

  createHabitTimelineEvent("Hábitos de hoje reiniciados", "As conclusões de hoje foram removidas.");

  renderHabits();
}


// =====================================================
// 32. FILTROS
// =====================================================

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderHabits();
    });
  });
}


// =====================================================
// 33. CONFIGURAR EVENTOS DO MODAL
// =====================================================

function setupHabitModal() {
  if (newHabitBtn) {
    newHabitBtn.addEventListener("click", openHabitModal);
  }

  if (closeHabitModalBtn) {
    closeHabitModalBtn.addEventListener("click", () => {
      closeHabitModal();
      clearHabitModalFields();
    });
  }

  if (saveHabitBtn) {
    saveHabitBtn.addEventListener("click", saveNewHabit);
  }

  habitDayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const day = Number(button.dataset.day);

      button.classList.toggle("selected");

      if (button.classList.contains("selected")) {
        selectedHabitDays.push(day);
      } else {
        selectedHabitDays = selectedHabitDays.filter((item) => item !== day);
      }

      if (habitDaysPicker) {
        habitDaysPicker.classList.remove("invalid");
      }

      if (habitDaysFeedback) {
        habitDaysFeedback.textContent = "";
      }
    });
  });

  if (selectAllDaysBtn) {
    selectAllDaysBtn.addEventListener("click", () => {
      if (isSameHabitDaySet(selectedHabitDays, ALL_HABIT_DAYS)) {
        setSelectedHabitDays([]);
      } else {
        setSelectedHabitDays(ALL_HABIT_DAYS);
      }
    });
  }

  if (selectAlternateDaysBtn) {
    selectAlternateDaysBtn.addEventListener("click", () => {
      if (isSameHabitDaySet(selectedHabitDays, ALTERNATE_DAYS_A)) {
        setSelectedHabitDays(ALTERNATE_DAYS_B);
      } else {
        setSelectedHabitDays(ALTERNATE_DAYS_A);
      }
    });
  }

  if (habitTitleInput) {
    habitTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveNewHabit();
      }
    });
  }

  if (habitDescriptionInput) {
    habitDescriptionInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveNewHabit();
      }
    });
  }

  if (habitModal) {
    habitModal.addEventListener("click", (event) => {
      if (event.target === habitModal) {
        closeHabitModal();
        clearHabitModalFields();
      }
    });
  }
}


// =====================================================
// 34. CONFIGURAR BOTÃO DE REINICIAR HOJE
// =====================================================

function setupResetTodayButton() {
  if (!resetTodayBtn) {
    return;
  }

  resetTodayBtn.addEventListener("click", resetTodayHabits);
}


// =====================================================
// 35. INICIALIZAÇÃO
// =====================================================

function initHabitsPage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadHabits();

  setupFilters();
  setupHabitModal();
  setupResetTodayButton();

  renderHabits();
}

initHabitsPage();

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
    rawDisplayName && rawDisplayName !== "Você"
      ? rawDisplayName
      : habitsT("common.you", "Você");

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

function refreshHabitsLanguage() {
  applySavedTheme();
  updateWelcomeArea();
  renderHabits();
  renderHeaderProfileDropdown();
}

window.addEventListener(
  "fluir:languagechange",
  refreshHabitsLanguage
);
