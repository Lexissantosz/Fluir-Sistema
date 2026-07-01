// =====================================================
// FLUIR — ALIMENTAÇÃO
// JavaScript puro para controlar a tela de alimentação
// =====================================================


// =====================================================
// 1. ELEMENTOS PRINCIPAIS
// =====================================================

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");
const avatarBtn = document.getElementById("avatarBtn");

const moduleLinks = document.querySelectorAll(".module-link");

const newMealBtn = document.getElementById("newMealBtn");
const quickMealBtn = document.getElementById("quickMealBtn");

const nutritionModal = document.getElementById("nutritionModal");
const closeNutritionModalBtn = document.getElementById("closeNutritionModalBtn");
const saveMealBtn = document.getElementById("saveMealBtn");

const mealTitleInput = document.getElementById("mealTitleInput");
const mealTypeSelect = document.getElementById("mealTypeSelect");
const mealQualitySelect = document.getElementById("mealQualitySelect");
const mealNoteInput = document.getElementById("mealNoteInput");
const nutritionFormMessage = document.getElementById("nutritionFormMessage");

const mealList = document.getElementById("mealList");
const emptyState = document.getElementById("emptyState");
const mealSubtitle = document.getElementById("mealSubtitle");

const totalMeals = document.getElementById("totalMeals");
const averageQuality = document.getElementById("averageQuality");
const weeklyMeals = document.getElementById("weeklyMeals");
const topMealType = document.getElementById("topMealType");

const sidebarMealCount = document.getElementById("sidebarMealCount");
const sidebarNutritionBar = document.getElementById("sidebarNutritionBar");
const sidebarNutritionText = document.getElementById("sidebarNutritionText");

const weekText = document.getElementById("weekText");
const nutritionMiniTimeline = document.getElementById("nutritionMiniTimeline");

const clearMealsBtn = document.getElementById("clearMealsBtn");
const filterButtons = document.querySelectorAll(".filter-btn");


// =====================================================
// 2. CONFIGURAÇÃO PADRÃO
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
    nutrition: true,
    physicalHealth: false,
    menstrualCycle: false,
    attachments: true
  },

  preferences: {}
};


// =====================================================
// 3. ESTADO
// =====================================================

let meals = [];
let activeFilter = "all";


// =====================================================
// 4. UTILITÁRIOS
// =====================================================

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentTimeLabel() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

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

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// =====================================================
// 5. LER SETUP SALVO
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
// 6. TEMA
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
// 7. SAUDAÇÃO
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
    calmo: "Registre suas refeições sem cobrança, só com clareza.",
    direto: "Registre refeições e veja seu padrão alimentar.",
    motivador: "Cuidar da alimentação também é cuidar da sua energia.",
    delicado: "Comer bem pode começar com pequenas escolhas possíveis.",
    neutro: "Acompanhe refeições, qualidade e tipos registrados."
  };

  return subtitles[tone] || subtitles.calmo;
}


// =====================================================
// 8. MENU — ESCONDER MÓDULOS NÃO ATIVOS
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
// 9. LOCALSTORAGE — ALIMENTAÇÃO
// =====================================================

function loadMeals() {
  const saved = localStorage.getItem("fluir-nutrition");

  if (!saved) {
    meals = [];
    saveMeals();
    return;
  }

  try {
    meals = JSON.parse(saved);
  } catch (error) {
    console.warn("Erro ao ler refeições:", error);
    meals = [];
    saveMeals();
  }
}

function saveMeals() {
  localStorage.setItem("fluir-nutrition", JSON.stringify(meals));
}


// =====================================================
// 10. TIMELINE
// =====================================================

function saveTimelineEvent(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}

function createNutritionTimelineEvent(title, description) {
  saveTimelineEvent({
    id: Date.now(),
    title,
    category: "health",
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  });
}


// =====================================================
// 11. LABELS
// =====================================================

function getMealTypeLabel(type) {
  const labels = {
    breakfast: "Café da manhã",
    lunch: "Almoço",
    dinner: "Jantar",
    snack: "Lanche",
    other: "Outro"
  };

  return labels[type] || "Outro";
}

function getMealTypeIcon(type) {
  const icons = {
    breakfast: "☼",
    lunch: "◒",
    dinner: "☾",
    snack: "◇",
    other: "◌"
  };

  return icons[type] || "◌";
}

function getQualityLabel(quality) {
  const labels = {
    boa: "Boa",
    media: "Média",
    ruim: "Ruim"
  };

  return labels[quality] || "Média";
}

function getQualityScore(quality) {
  const scores = {
    boa: 3,
    media: 2,
    ruim: 1
  };

  return scores[quality] || 2;
}


// =====================================================
// 12. FILTROS
// =====================================================

function mealMatchesFilter(meal) {
  if (activeFilter === "all") {
    return true;
  }

  if (activeFilter === "today") {
    return meal.date === getTodayKey();
  }

  return meal.type === activeFilter;
}

function getFilteredMeals() {
  return meals.filter(mealMatchesFilter);
}


// =====================================================
// 13. RENDERIZAÇÃO
// =====================================================

function renderNutrition() {
  renderMeals();
  updateSummaryCards();
  renderWeekGrid();
  renderMiniTimeline();
}

function renderMeals() {
  if (!mealList) {
    return;
  }

  const filtered = getFilteredMeals();

  mealList.innerHTML = "";

  filtered.forEach((meal) => {
    mealList.appendChild(createMealCard(meal));
  });

  updateEmptyState(filtered.length);
  updateMealSubtitle(filtered.length);
}

function createMealCard(meal) {
  const card = document.createElement("article");

  card.className = "meal-card";
  card.dataset.id = meal.id;

  card.innerHTML = `
    <div class="meal-icon">
      ${getMealTypeIcon(meal.type)}
    </div>

    <div class="meal-info">
      <strong>${escapeHTML(meal.title)}</strong>
      <p>${escapeHTML(meal.note || "Refeição registrada.")}</p>

      <div class="meal-meta">
        <span>${getMealTypeLabel(meal.type)}</span>
        <span>Qualidade ${getQualityLabel(meal.quality)}</span>
        <span>${escapeHTML(meal.date)}</span>
      </div>
    </div>

    <button class="meal-action-btn delete-meal-btn" type="button" title="Excluir refeição">
      ×
    </button>
  `;

  const deleteButton = card.querySelector(".delete-meal-btn");

  deleteButton.addEventListener("click", () => {
    deleteMeal(meal.id);
  });

  return card;
}

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

function updateMealSubtitle(visibleCount) {
  if (!mealSubtitle) {
    return;
  }

  const texts = {
    all: `${visibleCount} refeição${visibleCount === 1 ? "" : "ões"} no total.`,
    breakfast: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} de café da manhã.`,
    lunch: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} de almoço.`,
    dinner: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} de jantar.`,
    snack: `${visibleCount} lanche${visibleCount === 1 ? "" : "s"} registrado${visibleCount === 1 ? "" : "s"}.`,
    today: `${visibleCount} refeição${visibleCount === 1 ? "" : "ões"} de hoje.`
  };

  mealSubtitle.textContent = texts[activeFilter] || texts.all;
}


// =====================================================
// 14. RESUMOS
// =====================================================

function updateSummaryCards() {
  const today = getTodayKey();
  const todayList = meals.filter((meal) => meal.date === today);
  const weekKeys = getCurrentWeekKeys();
  const weekList = meals.filter((meal) => weekKeys.includes(meal.date));

  const typeCounts = {};

  meals.forEach((meal) => {
    typeCounts[meal.type] = (typeCounts[meal.type] || 0) + 1;
  });

  const topTypeEntry = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

  const qualityAverage = todayList.length === 0
    ? "--"
    : getQualityLabelFromAverage(
        todayList.reduce((sum, meal) => sum + getQualityScore(meal.quality), 0) / todayList.length
      );

  if (totalMeals) totalMeals.textContent = todayList.length;
  if (averageQuality) averageQuality.textContent = qualityAverage;
  if (weeklyMeals) weeklyMeals.textContent = weekList.length;
  if (topMealType) topMealType.textContent = topTypeEntry ? getMealTypeLabel(topTypeEntry[0]) : "--";

  if (sidebarMealCount) sidebarMealCount.textContent = todayList.length;

  const percent = Math.min(100, Math.round((todayList.length / 4) * 100));

  if (sidebarNutritionBar) sidebarNutritionBar.style.width = `${percent}%`;

  if (sidebarNutritionText) {
    if (todayList.length === 0) {
      sidebarNutritionText.textContent = "Nenhuma refeição registrada ainda.";
      return;
    }

    sidebarNutritionText.textContent = `${todayList.length} refeição${todayList.length === 1 ? "" : "ões"} registrada${todayList.length === 1 ? "" : "s"} hoje.`;
  }
}

function getQualityLabelFromAverage(average) {
  if (average >= 2.5) {
    return "Boa";
  }

  if (average >= 1.7) {
    return "Média";
  }

  return "Ruim";
}


// =====================================================
// 15. SEMANA
// =====================================================

function renderWeekGrid() {
  const weekKeys = getCurrentWeekKeys();

  weekKeys.forEach((dateKey, index) => {
    const dayElement = document.getElementById(`day${index}`);

    if (!dayElement) {
      return;
    }

    const count = meals.filter((meal) => meal.date === dateKey).length;

    if (count > 0) {
      dayElement.textContent = count;
      dayElement.classList.add("done");
    } else {
      dayElement.textContent = "○";
      dayElement.classList.remove("done");
    }
  });

  const weekCount = meals.filter((meal) => weekKeys.includes(meal.date)).length;

  if (weekText) {
    weekText.textContent = `${weekCount} refeição${weekCount === 1 ? "" : "ões"} registrada${weekCount === 1 ? "" : "s"} nesta semana.`;
  }
}


// =====================================================
// 16. MINI TIMELINE
// =====================================================

function renderMiniTimeline() {
  if (!nutritionMiniTimeline) {
    return;
  }

  const recent = meals.slice(0, 3);

  nutritionMiniTimeline.innerHTML = "";

  if (recent.length === 0) {
    nutritionMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>Nenhuma refeição</strong>
          Registre sua primeira refeição.
        </p>
      </div>
    `;
    return;
  }

  recent.forEach((meal) => {
    const item = document.createElement("div");

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${escapeHTML(meal.createdTime)}</time>
      <p>
        <strong>Refeição registrada</strong>
        ${escapeHTML(meal.title)}
      </p>
    `;

    nutritionMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 17. MODAL — MENSAGENS
// =====================================================

function showNutritionFormMessage(message, type = "error") {
  if (!nutritionFormMessage) {
    return;
  }

  nutritionFormMessage.textContent = message;
  nutritionFormMessage.className = `nutrition-form-message show ${type}`;
}

function clearNutritionFormMessage() {
  if (!nutritionFormMessage) {
    return;
  }

  nutritionFormMessage.textContent = "";
  nutritionFormMessage.className = "nutrition-form-message";
}

function clearNutritionInvalidFields() {
  document.querySelectorAll(".nutrition-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 18. MODAL — ABRIR / FECHAR
// =====================================================

function openNutritionModal() {
  if (!nutritionModal) {
    return;
  }

  clearNutritionModalFields();
  nutritionModal.classList.add("active");

  setTimeout(() => {
    if (mealTitleInput) {
      mealTitleInput.focus();
    }
  }, 100);
}

function closeNutritionModal() {
  if (!nutritionModal) {
    return;
  }

  nutritionModal.classList.remove("active");
}

function clearNutritionModalFields() {
  if (mealTitleInput) mealTitleInput.value = "";
  if (mealTypeSelect) mealTypeSelect.value = "breakfast";
  if (mealQualitySelect) mealQualitySelect.value = "boa";
  if (mealNoteInput) mealNoteInput.value = "";

  clearNutritionFormMessage();
  clearNutritionInvalidFields();
}


// =====================================================
// 19. SALVAR REFEIÇÃO
// =====================================================

function saveMeal() {
  clearNutritionFormMessage();
  clearNutritionInvalidFields();

  const title = mealTitleInput?.value.trim();
  const type = mealTypeSelect?.value || "other";
  const quality = mealQualitySelect?.value || "media";
  const note = mealNoteInput?.value.trim() || "";

  if (!title || title.length < 2) {
    mealTitleInput.classList.add("invalid");
    mealTitleInput.focus();
    showNutritionFormMessage("Digite um nome válido para a refeição.");
    return;
  }

  const newMeal = {
    id: Date.now(),
    title,
    type,
    quality,
    note,
    date: getTodayKey(),
    createdTime: getCurrentTimeLabel(),
    createdAt: new Date().toISOString()
  };

  meals.unshift(newMeal);
  saveMeals();

  createNutritionTimelineEvent(
    "Refeição registrada",
    `${getMealTypeLabel(type)} · qualidade ${getQualityLabel(quality)}`
  );

  renderNutrition();

  showNutritionFormMessage("Refeição salva com sucesso.", "success");

  setTimeout(() => {
    closeNutritionModal();
    clearNutritionModalFields();
  }, 450);
}


// =====================================================
// 20. EXCLUIR / LIMPAR
// =====================================================

function deleteMeal(mealId) {
  const meal = meals.find((item) => item.id === mealId);

  meals = meals.filter((item) => item.id !== mealId);

  saveMeals();

  if (meal) {
    createNutritionTimelineEvent("Refeição removida", meal.title);
  }

  renderNutrition();
}

function clearMeals() {
  if (meals.length === 0) {
    return;
  }

  meals = [];
  saveMeals();

  createNutritionTimelineEvent("Alimentação limpa", "Todos os registros alimentares foram removidos.");

  renderNutrition();
}


// =====================================================
// 21. FILTROS
// =====================================================

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderNutrition();
    });
  });
}


// =====================================================
// 22. EVENTOS
// =====================================================

function setupNutritionEvents() {
  if (newMealBtn) {
    newMealBtn.addEventListener("click", openNutritionModal);
  }

  if (quickMealBtn) {
    quickMealBtn.addEventListener("click", openNutritionModal);
  }

  if (closeNutritionModalBtn) {
    closeNutritionModalBtn.addEventListener("click", () => {
      closeNutritionModal();
      clearNutritionModalFields();
    });
  }

  if (saveMealBtn) {
    saveMealBtn.addEventListener("click", saveMeal);
  }

  if (mealTitleInput) {
    mealTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveMeal();
      }
    });
  }

  if (nutritionModal) {
    nutritionModal.addEventListener("click", (event) => {
      if (event.target === nutritionModal) {
        closeNutritionModal();
        clearNutritionModalFields();
      }
    });
  }

  if (clearMealsBtn) {
    clearMealsBtn.addEventListener("click", clearMeals);
  }
}


// =====================================================
// 23. INICIALIZAÇÃO
// =====================================================

function initNutritionPage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadMeals();

  setupFilters();
  setupNutritionEvents();

  renderNutrition();
}

initNutritionPage();