// =====================================================
// FLUIR — CICLO MENSTRUAL
// JavaScript puro para controlar a tela de ciclo menstrual
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

const newCycleBtn = document.getElementById("newCycleBtn");
const quickCycleBtn = document.getElementById("quickCycleBtn");

const cycleModal = document.getElementById("cycleModal");
const closeCycleModalBtn = document.getElementById("closeCycleModalBtn");
const saveCycleBtn = document.getElementById("saveCycleBtn");

const cycleTypeSelect = document.getElementById("cycleTypeSelect");
const cycleIntensitySelect = document.getElementById("cycleIntensitySelect");
const cycleTitleInput = document.getElementById("cycleTitleInput");
const cycleNoteInput = document.getElementById("cycleNoteInput");
const cycleFormMessage = document.getElementById("cycleFormMessage");

const cycleList = document.getElementById("cycleList");
const emptyState = document.getElementById("emptyState");
const cycleSubtitle = document.getElementById("cycleSubtitle");

const currentPhase = document.getElementById("currentPhase");
const lastPeriodStart = document.getElementById("lastPeriodStart");
const cycleDay = document.getElementById("cycleDay");
const symptomCount = document.getElementById("symptomCount");

const sidebarCyclePhase = document.getElementById("sidebarCyclePhase");
const sidebarCycleBar = document.getElementById("sidebarCycleBar");
const sidebarCycleText = document.getElementById("sidebarCycleText");

const estimateTitle = document.getElementById("estimateTitle");
const estimateText = document.getElementById("estimateText");
const cycleMiniTimeline = document.getElementById("cycleMiniTimeline");

const clearCycleBtn = document.getElementById("clearCycleBtn");
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
    menstrualCycle: true,
    attachments: true
  },

  preferences: {
    menstrualCycle: {
      averageCycleLength: 28,
      averagePeriodLength: 5
    }
  }
};


// =====================================================
// 3. ESTADO
// =====================================================

let cycleRecords = [];
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

function getDaysBetween(dateA, dateB) {
  const start = new Date(dateA + "T00:00:00");
  const end = new Date(dateB + "T00:00:00");

  const diff = end - start;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatShortDate(dateKey) {
  if (!dateKey) {
    return "--";
  }

  const parts = dateKey.split("-");

  return `${parts[2]}/${parts[1]}`;
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
    calmo: "Acompanhe seu ciclo, sintomas e sinais do corpo com cuidado.",
    direto: "Registre ciclo, sintomas e fase estimada.",
    motivador: "Entender seu corpo ajuda você a se organizar melhor.",
    delicado: "Seu corpo pode ser observado com calma e sem cobrança.",
    neutro: "Acompanhe registros, sintomas e estimativas do ciclo."
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
// 9. LOCALSTORAGE — CICLO MENSTRUAL
// =====================================================

function loadCycleRecords() {
  const saved = localStorage.getItem("fluir-menstrual-cycle");

  if (!saved) {
    cycleRecords = [];
    saveCycleRecords();
    return;
  }

  try {
    cycleRecords = JSON.parse(saved);
  } catch (error) {
    console.warn("Erro ao ler registros do ciclo:", error);
    cycleRecords = [];
    saveCycleRecords();
  }
}

function saveCycleRecords() {
  localStorage.setItem("fluir-menstrual-cycle", JSON.stringify(cycleRecords));
}


// =====================================================
// 10. TIMELINE
// =====================================================

function saveTimelineEvent(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}

function createCycleTimelineEvent(title, description) {
  saveTimelineEvent({
    id: Date.now(),
    title,
    category: "menstrualCycle",
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  });
}


// =====================================================
// 11. LABELS
// =====================================================

function getCycleTypeLabel(type) {
  const labels = {
    period: "Menstruação",
    symptom: "Sintoma",
    mood: "Humor",
    other: "Outro"
  };

  return labels[type] || "Outro";
}

function getCycleTypeIcon(type) {
  const icons = {
    period: "◍",
    symptom: "!",
    mood: "☻",
    other: "○"
  };

  return icons[type] || "○";
}

function getIntensityLabel(intensity) {
  const labels = {
    leve: "Leve",
    medio: "Médio",
    intenso: "Intenso",
    nenhum: "Não se aplica"
  };

  return labels[intensity] || "Não se aplica";
}


// =====================================================
// 12. ESTIMATIVA SIMPLES DO CICLO
// =====================================================

function getLastPeriodRecord() {
  return cycleRecords.find((record) => record.type === "period");
}

function getCycleEstimate() {
  const lastPeriod = getLastPeriodRecord();

  if (!lastPeriod) {
    return {
      hasData: false,
      phase: "--",
      day: "--",
      percent: 0,
      text: "Registre o início da menstruação para estimar a fase atual."
    };
  }

  const averageCycleLength = Number(setupData.preferences?.menstrualCycle?.averageCycleLength) || 28;
  const averagePeriodLength = Number(setupData.preferences?.menstrualCycle?.averagePeriodLength) || 5;

  const dayNumber = getDaysBetween(lastPeriod.date, getTodayKey()) + 1;
  const safeDay = Math.max(1, dayNumber);
  const cyclePosition = ((safeDay - 1) % averageCycleLength) + 1;

  let phase = "Folicular";
  let text = "Fase pós-menstruação estimada. Observe energia, humor e sinais do corpo.";

  if (cyclePosition <= averagePeriodLength) {
    phase = "Menstrual";
    text = "Fase menstrual estimada. Observe fluxo, cólicas e necessidade de descanso.";
  } else if (cyclePosition >= 12 && cyclePosition <= 16) {
    phase = "Ovulatória";
    text = "Janela ovulatória estimada. Acompanhe sinais do corpo e variações de energia.";
  } else if (cyclePosition >= 17) {
    phase = "Lútea";
    text = "Fase lútea estimada. Observe sintomas, humor, sono e sensibilidade.";
  }

  const percent = Math.min(100, Math.round((cyclePosition / averageCycleLength) * 100));

  return {
    hasData: true,
    phase,
    day: cyclePosition,
    percent,
    text
  };
}


// =====================================================
// 13. FILTROS
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
  return cycleRecords.filter(recordMatchesFilter);
}


// =====================================================
// 14. RENDERIZAÇÃO
// =====================================================

function renderCycle() {
  renderRecords();
  updateSummaryCards();
  updateEstimateArea();
  renderMiniTimeline();
}

function renderRecords() {
  if (!cycleList) {
    return;
  }

  const filtered = getFilteredRecords();

  cycleList.innerHTML = "";

  filtered.forEach((record) => {
    cycleList.appendChild(createCycleCard(record));
  });

  updateEmptyState(filtered.length);
  updateCycleSubtitle(filtered.length);
}

function createCycleCard(record) {
  const card = document.createElement("article");

  card.className = "cycle-card";
  card.dataset.id = record.id;

  card.innerHTML = `
    <div class="cycle-icon">
      ${getCycleTypeIcon(record.type)}
    </div>

    <div class="cycle-info">
      <strong>${escapeHTML(record.title)}</strong>
      <p>${escapeHTML(record.note || "Registro do ciclo salvo.")}</p>

      <div class="cycle-meta">
        <span>${getCycleTypeLabel(record.type)}</span>
        <span>${getIntensityLabel(record.intensity)}</span>
        <span>${escapeHTML(record.date)}</span>
      </div>
    </div>

    <button class="cycle-action-btn delete-cycle-btn" type="button" title="Excluir registro">
      ×
    </button>
  `;

  const deleteButton = card.querySelector(".delete-cycle-btn");

  deleteButton.addEventListener("click", () => {
    deleteCycleRecord(record.id);
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

function updateCycleSubtitle(visibleCount) {
  if (!cycleSubtitle) {
    return;
  }

  const texts = {
    all: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} no total.`,
    period: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} de menstruação.`,
    symptom: `${visibleCount} sintoma${visibleCount === 1 ? "" : "s"} registrado${visibleCount === 1 ? "" : "s"}.`,
    mood: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} de humor.`,
    today: `${visibleCount} registro${visibleCount === 1 ? "" : "s"} de hoje.`
  };

  cycleSubtitle.textContent = texts[activeFilter] || texts.all;
}


// =====================================================
// 15. RESUMOS
// =====================================================

function updateSummaryCards() {
  const estimate = getCycleEstimate();
  const lastPeriod = getLastPeriodRecord();

  const symptoms = cycleRecords.filter((record) => record.type === "symptom").length;

  if (currentPhase) currentPhase.textContent = estimate.phase;
  if (lastPeriodStart) lastPeriodStart.textContent = lastPeriod ? formatShortDate(lastPeriod.date) : "--";
  if (cycleDay) cycleDay.textContent = estimate.hasData ? `${estimate.day}º` : "--";
  if (symptomCount) symptomCount.textContent = symptoms;

  if (sidebarCyclePhase) sidebarCyclePhase.textContent = estimate.phase;
  if (sidebarCycleBar) sidebarCycleBar.style.width = `${estimate.percent}%`;

  if (sidebarCycleText) {
    if (!estimate.hasData) {
      sidebarCycleText.textContent = "Nenhum ciclo registrado ainda.";
      return;
    }

    sidebarCycleText.textContent = `Dia ${estimate.day} do ciclo estimado.`;
  }
}

function updateEstimateArea() {
  const estimate = getCycleEstimate();

  if (estimateTitle) {
    estimateTitle.textContent = estimate.hasData
      ? `${estimate.phase} · dia ${estimate.day}`
      : "Sem dados suficientes";
  }

  if (estimateText) {
    estimateText.textContent = estimate.text;
  }
}


// =====================================================
// 16. MINI TIMELINE
// =====================================================

function renderMiniTimeline() {
  if (!cycleMiniTimeline) {
    return;
  }

  const recent = cycleRecords.slice(0, 3);

  cycleMiniTimeline.innerHTML = "";

  if (recent.length === 0) {
    cycleMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>Nenhum registro</strong>
          Registre o primeiro sinal do ciclo.
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
        <strong>${getCycleTypeLabel(record.type)}</strong>
        ${escapeHTML(record.title)}
      </p>
    `;

    cycleMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 17. MODAL — MENSAGENS
// =====================================================

function showCycleFormMessage(message, type = "error") {
  if (!cycleFormMessage) {
    return;
  }

  cycleFormMessage.textContent = message;
  cycleFormMessage.className = `cycle-form-message show ${type}`;
}

function clearCycleFormMessage() {
  if (!cycleFormMessage) {
    return;
  }

  cycleFormMessage.textContent = "";
  cycleFormMessage.className = "cycle-form-message";
}

function clearCycleInvalidFields() {
  document.querySelectorAll(".cycle-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 18. MODAL — ABRIR / FECHAR
// =====================================================

function openCycleModal() {
  if (!cycleModal) {
    return;
  }

  clearCycleModalFields();
  cycleModal.classList.add("active");

  setTimeout(() => {
    if (cycleTitleInput) {
      cycleTitleInput.focus();
    }
  }, 100);
}

function closeCycleModal() {
  if (!cycleModal) {
    return;
  }

  cycleModal.classList.remove("active");
}

function clearCycleModalFields() {
  if (cycleTypeSelect) cycleTypeSelect.value = "period";
  if (cycleIntensitySelect) cycleIntensitySelect.value = "medio";
  if (cycleTitleInput) cycleTitleInput.value = "";
  if (cycleNoteInput) cycleNoteInput.value = "";

  clearCycleFormMessage();
  clearCycleInvalidFields();
}


// =====================================================
// 19. SALVAR REGISTRO
// =====================================================

function saveCycleRecord() {
  clearCycleFormMessage();
  clearCycleInvalidFields();

  const type = cycleTypeSelect?.value || "other";
  const intensity = cycleIntensitySelect?.value || "nenhum";
  const title = cycleTitleInput?.value.trim();
  const note = cycleNoteInput?.value.trim() || "";

  if (!title || title.length < 2) {
    cycleTitleInput.classList.add("invalid");
    cycleTitleInput.focus();
    showCycleFormMessage("Digite uma observação principal válida.");
    return;
  }

  const newRecord = {
    id: Date.now(),
    type,
    intensity,
    title,
    note,
    date: getTodayKey(),
    createdTime: getCurrentTimeLabel(),
    createdAt: new Date().toISOString()
  };

  cycleRecords.unshift(newRecord);
  saveCycleRecords();

  createCycleTimelineEvent(
    getCycleTypeLabel(type),
    `${title} · intensidade ${getIntensityLabel(intensity)}`
  );

  renderCycle();

  showCycleFormMessage("Registro salvo com sucesso.", "success");

  setTimeout(() => {
    closeCycleModal();
    clearCycleModalFields();
  }, 450);
}


// =====================================================
// 20. EXCLUIR / LIMPAR
// =====================================================

function deleteCycleRecord(recordId) {
  const record = cycleRecords.find((item) => item.id === recordId);

  cycleRecords = cycleRecords.filter((item) => item.id !== recordId);

  saveCycleRecords();

  if (record) {
    createCycleTimelineEvent("Registro do ciclo removido", record.title);
  }

  renderCycle();
}

function clearCycleRecords() {
  if (cycleRecords.length === 0) {
    return;
  }

  cycleRecords = [];
  saveCycleRecords();

  createCycleTimelineEvent("Ciclo menstrual limpo", "Todos os registros do ciclo foram removidos.");

  renderCycle();
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

      renderCycle();
    });
  });
}


// =====================================================
// 22. EVENTOS
// =====================================================

function setupCycleEvents() {
  if (newCycleBtn) {
    newCycleBtn.addEventListener("click", openCycleModal);
  }

  if (quickCycleBtn) {
    quickCycleBtn.addEventListener("click", openCycleModal);
  }

  if (closeCycleModalBtn) {
    closeCycleModalBtn.addEventListener("click", () => {
      closeCycleModal();
      clearCycleModalFields();
    });
  }

  if (saveCycleBtn) {
    saveCycleBtn.addEventListener("click", saveCycleRecord);
  }

  if (cycleTitleInput) {
    cycleTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveCycleRecord();
      }
    });
  }

  if (cycleModal) {
    cycleModal.addEventListener("click", (event) => {
      if (event.target === cycleModal) {
        closeCycleModal();
        clearCycleModalFields();
      }
    });
  }

  if (clearCycleBtn) {
    clearCycleBtn.addEventListener("click", clearCycleRecords);
  }
}


// =====================================================
// 23. INICIALIZAÇÃO
// =====================================================

function initCyclePage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadCycleRecords();

  setupFilters();
  setupCycleEvents();

  renderCycle();
}

initCyclePage();