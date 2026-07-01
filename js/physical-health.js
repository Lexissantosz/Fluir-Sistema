// =====================================================
// FLUIR — SAÚDE FÍSICA
// JavaScript puro para controlar a tela de saúde física
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

const newHealthBtn = document.getElementById("newHealthBtn");
const quickHealthBtn = document.getElementById("quickHealthBtn");

const healthModal = document.getElementById("healthModal");
const closeHealthModalBtn = document.getElementById("closeHealthModalBtn");
const saveHealthBtn = document.getElementById("saveHealthBtn");

const healthTitleInput = document.getElementById("healthTitleInput");
const healthTypeSelect = document.getElementById("healthTypeSelect");
const healthEnergySelect = document.getElementById("healthEnergySelect");
const healthNoteInput = document.getElementById("healthNoteInput");
const healthFormMessage = document.getElementById("healthFormMessage");

const healthList = document.getElementById("healthList");
const emptyState = document.getElementById("emptyState");
const healthSubtitle = document.getElementById("healthSubtitle");

const todayRecords = document.getElementById("todayRecords");
const trainingCount = document.getElementById("trainingCount");
const lastEnergy = document.getElementById("lastEnergy");
const weeklyRecords = document.getElementById("weeklyRecords");

const sidebarHealthCount = document.getElementById("sidebarHealthCount");
const sidebarHealthBar = document.getElementById("sidebarHealthBar");
const sidebarHealthText = document.getElementById("sidebarHealthText");

const weekText = document.getElementById("weekText");
const healthMiniTimeline = document.getElementById("healthMiniTimeline");

const clearHealthBtn = document.getElementById("clearHealthBtn");
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
    physicalHealth: true,
    menstrualCycle: false,
    attachments: true
  },

  preferences: {}
};


// =====================================================
// 3. ESTADO
// =====================================================

let healthRecords = [];
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
    calmo: "Acompanhe movimento, medidas e sinais físicos com clareza.",
    direto: "Registre treino, sintoma ou percepção corporal.",
    motivador: "Cuidar do corpo também é construir futuro.",
    delicado: "Seu corpo merece atenção sem cobrança.",
    neutro: "Acompanhe registros físicos, energia e rotina corporal."
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
// 9. LOCALSTORAGE — SAÚDE FÍSICA
// =====================================================

function loadHealthRecords() {
  const saved = localStorage.getItem("fluir-physical-health");

  if (!saved) {
    healthRecords = [];
    saveHealthRecords();
    return;
  }

  try {
    healthRecords = JSON.parse(saved);
  } catch (error) {
    console.warn("Erro ao ler registros de saúde física:", error);
    healthRecords = [];
    saveHealthRecords();
  }
}

function saveHealthRecords() {
  localStorage.setItem("fluir-physical-health", JSON.stringify(healthRecords));
}


// =====================================================
// 10. TIMELINE
// =====================================================

function saveTimelineEvent(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}

function createHealthTimelineEvent(title, description) {
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

function getHealthTypeLabel(type) {
  const labels = {
    training: "Treino",
    body: "Corpo / medida",
    symptom: "Sintoma",
    other: "Outro"
  };

  return labels[type] || "Outro";
}

function getHealthTypeIcon(type) {
  const icons = {
    training: "↗",
    body: "◎",
    symptom: "!",
    other: "✦"
  };

  return icons[type] || "✦";
}

function getEnergyLabel(energy) {
  const labels = {
    alta: "Alta",
    media: "Média",
    baixa: "Baixa"
  };

  return labels[energy] || "Média";
}


// =====================================================
// 12. FILTROS
// =====================================================

function recordMatchesFilter(record) {
  if (activeFilter === "all") {
    return true;
  }

  if (activeFilter === "today") {
    return record.date === getTodayKey();
  }

  return record.type === activeFilter;
}

function getFilteredRecords() {
  return healthRecords.filter(recordMatchesFilter);
}


// =====================================================
// 13. RENDERIZAÇÃO
// =====================================================

function renderHealth() {
  renderRecords();
  updateSummaryCards();
  renderWeekGrid();
  renderMiniTimeline();
}

function renderRecords() {
  if (!healthList) {
    return;
  }

  const filtered = getFilteredRecords();

  healthList.innerHTML = "";

  filtered.forEach((record) => {
    healthList.appendChild(createHealthCard(record));
  });

  updateEmptyState(filtered.length);
  updateHealthSubtitle(filtered.length);
}

function createHealthCard(record) {
  const card = document.createElement("article");

  card.className = "health-card";
  card.dataset.id = record.id;

  card.innerHTML = `
    <div class="health-icon">
      ${getHealthTypeIcon(record.type)}
    </div>

    <div class="health-info">
      <strong>${escapeHTML(record.title)}</strong>
      <p>${escapeHTML(record.note || "Registro físico salvo.")}</p>

      <div class="health-meta">
        <span>${getHealthTypeLabel(record.type)}</span>
        <span>Energia ${getEnergyLabel(record.energy)}</span>
        <span>${escapeHTML(record.date)}</span>
      </div>
    </div>

    <button class="health-action-btn delete-health-btn" type="button" title="Excluir registro">
      ×
    </button>
  `;

  const deleteButton = card.querySelector(".delete-health-btn");

  deleteButton.addEventListener("click", () => {
    deleteHealthRecord(record.id);
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

function updateHealthSubtitle(visibleCount) {
  if (!healthSubtitle) {
    return;
  }

  const texts = {
    all: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} no total.`,
    training: `${visibleCount} treino${visibleCount === 1 ? "" : "s"} registrado${visibleCount === 1 ? "" : "s"}.`,
    body: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} corporal${visibleCount === 1 ? "" : "es"}.`,
    symptom: `${visibleCount} sintoma${visibleCount === 1 ? "" : "s"} registrado${visibleCount === 1 ? "" : "s"}.`,
    today: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} de hoje.`
  };

  healthSubtitle.textContent = texts[activeFilter] || texts.all;
}


// =====================================================
// 14. RESUMOS
// =====================================================

function updateSummaryCards() {
  const today = getTodayKey();
  const todayList = healthRecords.filter((record) => record.date === today);
  const weekKeys = getCurrentWeekKeys();
  const weekList = healthRecords.filter((record) => weekKeys.includes(record.date));
  const trainings = healthRecords.filter((record) => record.type === "training");
  const latest = healthRecords[0];

  if (todayRecords) todayRecords.textContent = todayList.length;
  if (trainingCount) trainingCount.textContent = trainings.length;
  if (lastEnergy) lastEnergy.textContent = latest ? getEnergyLabel(latest.energy) : "--";
  if (weeklyRecords) weeklyRecords.textContent = weekList.length;

  if (sidebarHealthCount) sidebarHealthCount.textContent = todayList.length;

  const percent = Math.min(100, Math.round((todayList.length / 3) * 100));

  if (sidebarHealthBar) sidebarHealthBar.style.width = `${percent}%`;

  if (sidebarHealthText) {
    if (todayList.length === 0) {
      sidebarHealthText.textContent = "Nenhum registro físico ainda.";
      return;
    }

    sidebarHealthText.textContent = `${todayList.length} registro${todayList.length === 1 ? "" : "s"} físico${todayList.length === 1 ? "" : "s"} hoje.`;
  }
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

    const count = healthRecords.filter((record) => record.date === dateKey).length;

    if (count > 0) {
      dayElement.textContent = count;
      dayElement.classList.add("done");
    } else {
      dayElement.textContent = "○";
      dayElement.classList.remove("done");
    }
  });

  const weekCount = healthRecords.filter((record) => {
    return weekKeys.includes(record.date);
  }).length;

  if (weekText) {
    weekText.textContent = `${weekCount} registro${weekCount === 1 ? "" : "s"} físico${weekCount === 1 ? "" : "s"} nesta semana.`;
  }
}


// =====================================================
// 16. MINI TIMELINE
// =====================================================

function renderMiniTimeline() {
  if (!healthMiniTimeline) {
    return;
  }

  const recent = healthRecords.slice(0, 3);

  healthMiniTimeline.innerHTML = "";

  if (recent.length === 0) {
    healthMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>Nenhum registro</strong>
          Registre algo sobre seu corpo.
        </p>
      </div>
    `;
    return;
  }

  recent.forEach((record) => {
    const item = document.createElement("div");

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${escapeHTML(record.createdTime)}</time>
      <p>
        <strong>${getHealthTypeLabel(record.type)}</strong>
        ${escapeHTML(record.title)}
      </p>
    `;

    healthMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 17. MODAL — MENSAGENS
// =====================================================

function showHealthFormMessage(message, type = "error") {
  if (!healthFormMessage) {
    return;
  }

  healthFormMessage.textContent = message;
  healthFormMessage.className = `health-form-message show ${type}`;
}

function clearHealthFormMessage() {
  if (!healthFormMessage) {
    return;
  }

  healthFormMessage.textContent = "";
  healthFormMessage.className = "health-form-message";
}

function clearHealthInvalidFields() {
  document.querySelectorAll(".health-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 18. MODAL — ABRIR / FECHAR
// =====================================================

function openHealthModal() {
  if (!healthModal) {
    return;
  }

  clearHealthModalFields();
  healthModal.classList.add("active");

  setTimeout(() => {
    if (healthTitleInput) {
      healthTitleInput.focus();
    }
  }, 100);
}

function closeHealthModal() {
  if (!healthModal) {
    return;
  }

  healthModal.classList.remove("active");
}

function clearHealthModalFields() {
  if (healthTitleInput) healthTitleInput.value = "";
  if (healthTypeSelect) healthTypeSelect.value = "training";
  if (healthEnergySelect) healthEnergySelect.value = "media";
  if (healthNoteInput) healthNoteInput.value = "";

  clearHealthFormMessage();
  clearHealthInvalidFields();
}


// =====================================================
// 19. SALVAR REGISTRO
// =====================================================

function saveHealthRecord() {
  clearHealthFormMessage();
  clearHealthInvalidFields();

  const title = healthTitleInput?.value.trim();
  const type = healthTypeSelect?.value || "other";
  const energy = healthEnergySelect?.value || "media";
  const note = healthNoteInput?.value.trim() || "";

  if (!title || title.length < 2) {
    healthTitleInput.classList.add("invalid");
    healthTitleInput.focus();
    showHealthFormMessage("Digite um título válido para o registro.");
    return;
  }

  const newRecord = {
    id: Date.now(),
    title,
    type,
    energy,
    note,
    date: getTodayKey(),
    createdTime: getCurrentTimeLabel(),
    createdAt: new Date().toISOString()
  };

  healthRecords.unshift(newRecord);
  saveHealthRecords();

  createHealthTimelineEvent(
    getHealthTypeLabel(type),
    `${title} · energia ${getEnergyLabel(energy)}`
  );

  renderHealth();

  showHealthFormMessage("Registro salvo com sucesso.", "success");

  setTimeout(() => {
    closeHealthModal();
    clearHealthModalFields();
  }, 450);
}


// =====================================================
// 20. EXCLUIR / LIMPAR
// =====================================================

function deleteHealthRecord(recordId) {
  const record = healthRecords.find((item) => item.id === recordId);

  healthRecords = healthRecords.filter((item) => item.id !== recordId);

  saveHealthRecords();

  if (record) {
    createHealthTimelineEvent("Registro físico removido", record.title);
  }

  renderHealth();
}

function clearHealthRecords() {
  if (healthRecords.length === 0) {
    return;
  }

  healthRecords = [];
  saveHealthRecords();

  createHealthTimelineEvent("Saúde física limpa", "Todos os registros físicos foram removidos.");

  renderHealth();
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

      renderHealth();
    });
  });
}


// =====================================================
// 22. EVENTOS
// =====================================================

function setupHealthEvents() {
  if (newHealthBtn) {
    newHealthBtn.addEventListener("click", openHealthModal);
  }

  if (quickHealthBtn) {
    quickHealthBtn.addEventListener("click", openHealthModal);
  }

  if (closeHealthModalBtn) {
    closeHealthModalBtn.addEventListener("click", () => {
      closeHealthModal();
      clearHealthModalFields();
    });
  }

  if (saveHealthBtn) {
    saveHealthBtn.addEventListener("click", saveHealthRecord);
  }

  if (healthTitleInput) {
    healthTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveHealthRecord();
      }
    });
  }

  if (healthModal) {
    healthModal.addEventListener("click", (event) => {
      if (event.target === healthModal) {
        closeHealthModal();
        clearHealthModalFields();
      }
    });
  }

  if (clearHealthBtn) {
    clearHealthBtn.addEventListener("click", clearHealthRecords);
  }
}


// =====================================================
// 23. INICIALIZAÇÃO
// =====================================================

function initHealthPage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadHealthRecords();

  setupFilters();
  setupHealthEvents();

  renderHealth();
}

initHealthPage();