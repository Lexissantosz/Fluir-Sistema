// =====================================================
// FLUIR — HÁBITOS
// JavaScript puro para controlar a tela de hábitos
// =====================================================


// =====================================================
// 1. ELEMENTOS PRINCIPAIS DA PÁGINA
// =====================================================

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");
const avatarBtn = document.getElementById("avatarBtn");

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
const habitWeeklyGoalSelect = document.getElementById("habitWeeklyGoalSelect");
const habitDescriptionInput = document.getElementById("habitDescriptionInput");
const habitFormMessage = document.getElementById("habitFormMessage");

const resetTodayBtn = document.getElementById("resetTodayBtn");


// =====================================================
// 2. CONFIGURAÇÃO PADRÃO
// Caso ainda não exista setup salvo no localStorage
// =====================================================

const defaultSetup = {
  user: {
    name: "Deibson",
    nickname: "Deibson",
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
// 6. DATA DE HOJE EM FORMATO SIMPLES
// =====================================================

function getTodayKey() {
  const now = new Date();

  return now.toISOString().split("T")[0];
}


// =====================================================
// 7. HORA ATUAL FORMATADA
// =====================================================

function getCurrentTimeLabel() {
  const now = new Date();

  return now.toLocaleTimeString("pt-BR", {
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
    week.push(date.toISOString().split("T")[0]);
  }

  return week;
}


// =====================================================
// 9. TEMA CLARO / ESCURO
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
// 10. SAUDAÇÃO PERSONALIZADA
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

function getInitial(name) {
  if (!name) {
    return "F";
  }

  return name.trim().charAt(0).toUpperCase();
}

function getSubtitleByTone(tone) {
  const subtitles = {
    calmo: "Pequenos passos repetidos também transformam.",
    direto: "Veja seus hábitos, marque o que concluiu e siga.",
    motivador: "Constância cresce quando você aparece todos os dias.",
    delicado: "Com leveza, seus hábitos vão criando raízes.",
    neutro: "Acompanhe seus hábitos, sequência e progresso semanal."
  };

  return subtitles[tone] || subtitles.calmo;
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
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
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

  const card = document.createElement("article");

  card.className = `habit-card ${completedToday ? "completed-today" : ""}`;
  card.dataset.id = habit.id;

  const weekDots = weekKeys.map((dateKey) => {
    const done = (habit.completedDates || []).includes(dateKey);

    return `<span class="${done ? "done" : ""}">${done ? "✓" : "○"}</span>`;
  }).join("");

  card.innerHTML = `
    <button class="habit-check" type="button" title="Marcar hábito de hoje">
      ${completedToday ? "✓" : "○"}
    </button>

    <div class="habit-info">
      <strong>${escapeHTML(habit.title)}</strong>
      <p>${escapeHTML(habit.description || "Sem observação.")}</p>

      <div class="habit-meta">
        <span>${escapeHTML(habit.category || "Pessoal")}</span>
        <span>${weeklyCount}/${weeklyGoal} na semana</span>
        <span>${Number(habit.streak || 0)} dia${Number(habit.streak || 0) === 1 ? "" : "s"} de sequência</span>
      </div>

      <div class="habit-week">
        ${weekDots}
      </div>
    </div>

    <div class="habit-actions">
      <button class="habit-action-btn delete-habit-btn" type="button" title="Excluir hábito">
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

  const subtitles = {
    all: `${visibleCount} hábito${visibleCount === 1 ? "" : "s"} ativo${visibleCount === 1 ? "" : "s"}.`,
    pending: `${visibleCount} hábito${visibleCount === 1 ? "" : "s"} pendente${visibleCount === 1 ? "" : "s"} hoje.`,
    completed: `${visibleCount} hábito${visibleCount === 1 ? "" : "s"} concluído${visibleCount === 1 ? "" : "s"} hoje.`,
    highStreak: `${visibleCount} hábito${visibleCount === 1 ? "" : "s"} com boa sequência.`
  };

  habitListSubtitle.textContent = subtitles[activeFilter] || subtitles.all;
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
      sidebarHabitText.textContent = "Nenhum hábito registrado ainda.";
      return;
    }

    sidebarHabitText.textContent = `${completedToday} de ${total} hábito${total === 1 ? "" : "s"} concluído${completedToday === 1 ? "" : "s"} hoje.`;
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
      focusRecommendation.textContent = "Você concluiu seus hábitos de hoje. Continue com calma.";
    }

    focusMiniList.innerHTML = `
      <div class="focus-mini-item">
        <strong>Tudo certo por hoje</strong>
        <span>Você manteve sua constância.</span>
      </div>
    `;

    return;
  }

  if (focusRecommendation) {
    focusRecommendation.textContent = "Comece pelos hábitos que ajudam a manter sua sequência.";
  }

  pendingHabits.forEach((habit) => {
    const item = document.createElement("div");

    item.className = "focus-mini-item";

    item.innerHTML = `
      <strong>${escapeHTML(habit.title)}</strong>
      <span>${Number(habit.streak || 0)} dia${Number(habit.streak || 0) === 1 ? "" : "s"} de sequência · ${escapeHTML(habit.category)}</span>
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
      weekText.textContent = "Crie seu primeiro hábito para começar a acompanhar sua semana.";
      return;
    }

    weekText.textContent = `Hoje você concluiu ${completedToday} de ${total} hábito${total === 1 ? "" : "s"}.`;
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
          <strong>Nenhuma ação ainda</strong>
          Crie seu primeiro hábito.
        </p>
      </div>
    `;
    return;
  }

  recentHabits.forEach((habit) => {
    const item = document.createElement("div");

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${getCurrentTimeLabel()}</time>
      <p>
        <strong>${isHabitCompletedToday(habit) ? "Hábito concluído" : "Hábito ativo"}</strong>
        ${escapeHTML(habit.title)}
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

  if (habitWeeklyGoalSelect) {
    habitWeeklyGoalSelect.value = "3";
  }

  if (habitDescriptionInput) {
    habitDescriptionInput.value = "";
  }

  clearHabitFormMessage();
  clearHabitInvalidFields();
}


// =====================================================
// 28. CRIAR NOVO HÁBITO
// =====================================================

function saveNewHabit() {
  clearHabitFormMessage();
  clearHabitInvalidFields();

  const title = habitTitleInput?.value.trim();
  const category = habitCategorySelect?.value || "Saúde";
  const weeklyGoal = Number(habitWeeklyGoalSelect?.value || 3);
  const description = habitDescriptionInput?.value.trim() || "";

  if (!title || title.length < 2) {
    if (habitTitleInput) {
      habitTitleInput.classList.add("invalid");
      habitTitleInput.focus();
    }

    showHabitFormMessage("Digite um nome válido para o hábito.");
    return;
  }

  const newHabit = {
    id: Date.now(),
    title,
    description,
    category,
    weeklyGoal,
    streak: 0,
    completedDates: [],
    createdAt: new Date().toISOString()
  };

  habits.unshift(newHabit);
  saveHabits();

  createHabitTimelineEvent("Hábito criado", title);

  renderHabits();

  showHabitFormMessage("Hábito salvo com sucesso.", "success");

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