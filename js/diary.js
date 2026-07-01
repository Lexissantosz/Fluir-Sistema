// =====================================================
// FLUIR — DIÁRIO EMOCIONAL
// JavaScript puro para controlar a tela de diário
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

const newEntryBtn = document.getElementById("newEntryBtn");
const quickEntryBtn = document.getElementById("quickEntryBtn");

const diaryModal = document.getElementById("diaryModal");
const closeDiaryModalBtn = document.getElementById("closeDiaryModalBtn");
const saveEntryBtn = document.getElementById("saveEntryBtn");

const entryTitleInput = document.getElementById("entryTitleInput");
const entryMoodSelect = document.getElementById("entryMoodSelect");
const entryTagSelect = document.getElementById("entryTagSelect");
const entryTextInput = document.getElementById("entryTextInput");
const diaryFormMessage = document.getElementById("diaryFormMessage");

const entryList = document.getElementById("entryList");
const emptyState = document.getElementById("emptyState");
const entrySubtitle = document.getElementById("entrySubtitle");

const totalEntries = document.getElementById("totalEntries");
const lastMood = document.getElementById("lastMood");
const weeklyEntries = document.getElementById("weeklyEntries");
const topTag = document.getElementById("topTag");

const sidebarDiaryCount = document.getElementById("sidebarDiaryCount");
const sidebarDiaryBar = document.getElementById("sidebarDiaryBar");
const sidebarDiaryText = document.getElementById("sidebarDiaryText");

const moodRow = document.getElementById("moodRow");
const moodText = document.getElementById("moodText");
const diaryMiniTimeline = document.getElementById("diaryMiniTimeline");

const clearEntriesBtn = document.getElementById("clearEntriesBtn");
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
    nutrition: false,
    physicalHealth: false,
    menstrualCycle: false,
    attachments: true
  },

  preferences: {}
};


// =====================================================
// 3. ESTADO
// =====================================================

let diaryEntries = [];
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
    calmo: "Registre pensamentos, emoções e pequenos acontecimentos do dia.",
    direto: "Escreva uma entrada e acompanhe seus registros.",
    motivador: "Entender o que sente também é progresso.",
    delicado: "Escreva com calma. Aqui não precisa ter pressa.",
    neutro: "Acompanhe entradas, humor e tags emocionais."
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
// 9. LOCALSTORAGE — DIÁRIO
// =====================================================

function loadDiaryEntries() {
  const saved = localStorage.getItem("fluir-diary");

  if (!saved) {
    diaryEntries = [];
    saveDiaryEntries();
    return;
  }

  try {
    diaryEntries = JSON.parse(saved);
  } catch (error) {
    console.warn("Erro ao ler diário:", error);
    diaryEntries = [];
    saveDiaryEntries();
  }
}

function saveDiaryEntries() {
  localStorage.setItem("fluir-diary", JSON.stringify(diaryEntries));
}


// =====================================================
// 10. TIMELINE
// =====================================================

function saveTimelineEvent(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}

function createDiaryTimelineEvent(title, description) {
  saveTimelineEvent({
    id: Date.now(),
    title,
    category: "diary",
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  });
}


// =====================================================
// 11. HUMOR
// =====================================================

function getMoodLabel(mood) {
  const labels = {
    positive: "Leve",
    neutral: "Neutro",
    heavy: "Pesado"
  };

  return labels[mood] || "Neutro";
}

function getMoodIcon(mood) {
  const icons = {
    positive: "☺",
    neutral: "☻",
    heavy: "☹"
  };

  return icons[mood] || "☻";
}


// =====================================================
// 12. FILTROS
// =====================================================

function entryMatchesFilter(entry) {
  if (activeFilter === "all") {
    return true;
  }

  if (activeFilter === "today") {
    return entry.date === getTodayKey();
  }

  return entry.mood === activeFilter;
}

function getFilteredEntries() {
  return diaryEntries.filter(entryMatchesFilter);
}


// =====================================================
// 13. RENDERIZAÇÃO
// =====================================================

function renderDiary() {
  renderEntries();
  updateSummaryCards();
  renderMoodRow();
  renderMiniTimeline();
}

function renderEntries() {
  if (!entryList) {
    return;
  }

  const filtered = getFilteredEntries();

  entryList.innerHTML = "";

  filtered.forEach((entry) => {
    entryList.appendChild(createEntryCard(entry));
  });

  updateEmptyState(filtered.length);
  updateEntrySubtitle(filtered.length);
}

function createEntryCard(entry) {
  const card = document.createElement("article");

  card.className = "entry-card";
  card.dataset.id = entry.id;

  card.innerHTML = `
    <div class="entry-icon">
      ${getMoodIcon(entry.mood)}
    </div>

    <div class="entry-info">
      <strong>${escapeHTML(entry.title)}</strong>
      <p>${escapeHTML(entry.text)}</p>

      <div class="entry-meta">
        <span>${getMoodLabel(entry.mood)}</span>
        <span>${escapeHTML(entry.tag)}</span>
        <span>${escapeHTML(entry.date)}</span>
      </div>
    </div>

    <button class="entry-action-btn delete-entry-btn" type="button" title="Excluir entrada">
      ×
    </button>
  `;

  const deleteButton = card.querySelector(".delete-entry-btn");

  deleteButton.addEventListener("click", () => {
    deleteEntry(entry.id);
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

function updateEntrySubtitle(visibleCount) {
  if (!entrySubtitle) {
    return;
  }

  const texts = {
    all: `${visibleCount} entrada${visibleCount === 1 ? "" : "s"} no total.`,
    positive: `${visibleCount} entrada${visibleCount === 1 ? "" : "s"} leve${visibleCount === 1 ? "" : "s"}.`,
    neutral: `${visibleCount} entrada${visibleCount === 1 ? "" : "s"} neutra${visibleCount === 1 ? "" : "s"}.`,
    heavy: `${visibleCount} entrada${visibleCount === 1 ? "" : "s"} pesada${visibleCount === 1 ? "" : "s"}.`,
    today: `${visibleCount} entrada${visibleCount === 1 ? "" : "s"} de hoje.`
  };

  entrySubtitle.textContent = texts[activeFilter] || texts.all;
}


// =====================================================
// 14. RESUMOS
// =====================================================

function updateSummaryCards() {
  const total = diaryEntries.length;
  const latest = diaryEntries[0];
  const weekKeys = getCurrentWeekKeys();

  const weekCount = diaryEntries.filter((entry) => {
    return weekKeys.includes(entry.date);
  }).length;

  const tagCounts = {};

  diaryEntries.forEach((entry) => {
    tagCounts[entry.tag] = (tagCounts[entry.tag] || 0) + 1;
  });

  const topTagEntry = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];

  if (totalEntries) totalEntries.textContent = total;
  if (lastMood) lastMood.textContent = latest ? getMoodLabel(latest.mood) : "--";
  if (weeklyEntries) weeklyEntries.textContent = weekCount;
  if (topTag) topTag.textContent = topTagEntry ? topTagEntry[0] : "--";

  if (sidebarDiaryCount) sidebarDiaryCount.textContent = total;

  const percent = Math.min(100, total * 10);

  if (sidebarDiaryBar) sidebarDiaryBar.style.width = `${percent}%`;

  if (sidebarDiaryText) {
    if (total === 0) {
      sidebarDiaryText.textContent = "Nenhuma entrada ainda.";
      return;
    }

    sidebarDiaryText.textContent = `${total} entrada${total === 1 ? "" : "s"} registrada${total === 1 ? "" : "s"}.`;
  }
}


// =====================================================
// 15. HUMOR RECENTE
// =====================================================

function renderMoodRow() {
  if (!moodRow) {
    return;
  }

  const recent = diaryEntries.slice(0, 5);

  moodRow.innerHTML = "";

  if (recent.length === 0) {
    moodRow.innerHTML = `
      <div class="mood-item">
        <span>○</span>
        <small>--</small>
      </div>
    `;

    if (moodText) {
      moodText.textContent = "Seus registros de humor aparecerão aqui.";
    }

    return;
  }

  recent.reverse().forEach((entry) => {
    const item = document.createElement("div");

    item.className = "mood-item";

    item.innerHTML = `
      <span>${getMoodIcon(entry.mood)}</span>
      <small>${entry.date.slice(5).replace("-", "/")}</small>
    `;

    moodRow.appendChild(item);
  });

  if (moodText) {
    moodText.textContent = `Último humor registrado: ${getMoodLabel(diaryEntries[0].mood)}.`;
  }
}


// =====================================================
// 16. MINI TIMELINE
// =====================================================

function renderMiniTimeline() {
  if (!diaryMiniTimeline) {
    return;
  }

  const recent = diaryEntries.slice(0, 3);

  diaryMiniTimeline.innerHTML = "";

  if (recent.length === 0) {
    diaryMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>Nenhuma entrada</strong>
          Escreva seu primeiro registro.
        </p>
      </div>
    `;
    return;
  }

  recent.forEach((entry) => {
    const item = document.createElement("div");

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${escapeHTML(entry.createdTime)}</time>
      <p>
        <strong>Entrada registrada</strong>
        ${escapeHTML(entry.title)}
      </p>
    `;

    diaryMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 17. MODAL — MENSAGENS
// =====================================================

function showDiaryFormMessage(message, type = "error") {
  if (!diaryFormMessage) {
    return;
  }

  diaryFormMessage.textContent = message;
  diaryFormMessage.className = `diary-form-message show ${type}`;
}

function clearDiaryFormMessage() {
  if (!diaryFormMessage) {
    return;
  }

  diaryFormMessage.textContent = "";
  diaryFormMessage.className = "diary-form-message";
}

function clearDiaryInvalidFields() {
  document.querySelectorAll(".diary-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 18. MODAL — ABRIR / FECHAR
// =====================================================

function openDiaryModal() {
  if (!diaryModal) {
    return;
  }

  clearDiaryModalFields();
  diaryModal.classList.add("active");

  setTimeout(() => {
    if (entryTitleInput) {
      entryTitleInput.focus();
    }
  }, 100);
}

function closeDiaryModal() {
  if (!diaryModal) {
    return;
  }

  diaryModal.classList.remove("active");
}

function clearDiaryModalFields() {
  if (entryTitleInput) entryTitleInput.value = "";
  if (entryMoodSelect) entryMoodSelect.value = "positive";
  if (entryTagSelect) entryTagSelect.value = "Rotina";
  if (entryTextInput) entryTextInput.value = "";

  clearDiaryFormMessage();
  clearDiaryInvalidFields();
}


// =====================================================
// 19. SALVAR ENTRADA
// =====================================================

function saveEntry() {
  clearDiaryFormMessage();
  clearDiaryInvalidFields();

  const title = entryTitleInput?.value.trim();
  const mood = entryMoodSelect?.value || "neutral";
  const tag = entryTagSelect?.value || "Outros";
  const text = entryTextInput?.value.trim();

  if (!title || title.length < 2) {
    entryTitleInput.classList.add("invalid");
    entryTitleInput.focus();
    showDiaryFormMessage("Digite um título válido.");
    return;
  }

  if (!text || text.length < 5) {
    entryTextInput.classList.add("invalid");
    entryTextInput.focus();
    showDiaryFormMessage("Escreva pelo menos uma frase curta.");
    return;
  }

  const newEntry = {
    id: Date.now(),
    title,
    mood,
    tag,
    text,
    date: getTodayKey(),
    createdTime: getCurrentTimeLabel(),
    createdAt: new Date().toISOString()
  };

  diaryEntries.unshift(newEntry);
  saveDiaryEntries();

  createDiaryTimelineEvent(
    "Entrada no diário",
    `${title} · humor ${getMoodLabel(mood)}`
  );

  renderDiary();

  showDiaryFormMessage("Entrada salva com sucesso.", "success");

  setTimeout(() => {
    closeDiaryModal();
    clearDiaryModalFields();
  }, 450);
}


// =====================================================
// 20. EXCLUIR / LIMPAR
// =====================================================

function deleteEntry(entryId) {
  const entry = diaryEntries.find((item) => item.id === entryId);

  diaryEntries = diaryEntries.filter((item) => item.id !== entryId);

  saveDiaryEntries();

  if (entry) {
    createDiaryTimelineEvent("Entrada removida", entry.title);
  }

  renderDiary();
}

function clearEntries() {
  if (diaryEntries.length === 0) {
    return;
  }

  diaryEntries = [];
  saveDiaryEntries();

  createDiaryTimelineEvent("Diário limpo", "Todas as entradas do diário foram removidas.");

  renderDiary();
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

      renderDiary();
    });
  });
}


// =====================================================
// 22. EVENTOS
// =====================================================

function setupDiaryEvents() {
  if (newEntryBtn) {
    newEntryBtn.addEventListener("click", openDiaryModal);
  }

  if (quickEntryBtn) {
    quickEntryBtn.addEventListener("click", openDiaryModal);
  }

  if (closeDiaryModalBtn) {
    closeDiaryModalBtn.addEventListener("click", () => {
      closeDiaryModal();
      clearDiaryModalFields();
    });
  }

  if (saveEntryBtn) {
    saveEntryBtn.addEventListener("click", saveEntry);
  }

  if (entryTitleInput) {
    entryTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveEntry();
      }
    });
  }

  if (diaryModal) {
    diaryModal.addEventListener("click", (event) => {
      if (event.target === diaryModal) {
        closeDiaryModal();
        clearDiaryModalFields();
      }
    });
  }

  if (clearEntriesBtn) {
    clearEntriesBtn.addEventListener("click", clearEntries);
  }
}


// =====================================================
// 23. INICIALIZAÇÃO
// =====================================================

function initDiaryPage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadDiaryEntries();

  setupFilters();
  setupDiaryEvents();

  renderDiary();
}

initDiaryPage();