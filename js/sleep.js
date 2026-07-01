// =====================================================
// FLUIR — SONO
// JavaScript puro para controlar a tela de sono
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

const newSleepBtn = document.getElementById("newSleepBtn");
const quickSleepBtn = document.getElementById("quickSleepBtn");

const sleepModal = document.getElementById("sleepModal");
const closeSleepModalBtn = document.getElementById("closeSleepModalBtn");
const saveSleepBtn = document.getElementById("saveSleepBtn");

const sleepStartInput = document.getElementById("sleepStartInput");
const sleepEndInput = document.getElementById("sleepEndInput");
const sleepQualitySelect = document.getElementById("sleepQualitySelect");
const sleepTypeSelect = document.getElementById("sleepTypeSelect");
const sleepNoteInput = document.getElementById("sleepNoteInput");
const sleepFormMessage = document.getElementById("sleepFormMessage");

const sleepList = document.getElementById("sleepList");
const emptyState = document.getElementById("emptyState");
const sleepListSubtitle = document.getElementById("sleepListSubtitle");

const lastSleepDuration = document.getElementById("lastSleepDuration");
const lastSleepQuality = document.getElementById("lastSleepQuality");
const weeklyAverage = document.getElementById("weeklyAverage");
const sleepGoalProgress = document.getElementById("sleepGoalProgress");

const sidebarSleepPercent = document.getElementById("sidebarSleepPercent");
const sidebarSleepBar = document.getElementById("sidebarSleepBar");
const sidebarSleepText = document.getElementById("sidebarSleepText");

const weekText = document.getElementById("weekText");
const sleepMiniTimeline = document.getElementById("sleepMiniTimeline");

const clearSleepBtn = document.getElementById("clearSleepBtn");


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

  preferences: {
    sleep: {
      sleepGoal: "8h"
    }
  }
};


// =====================================================
// 3. ESTADO
// =====================================================

let sleepLogs = [];


// =====================================================
// 4. UTILITÁRIOS DE DATA/HORA
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
    calmo: "Acompanhe seu descanso com calma e consistência.",
    direto: "Registre sua noite e veja seus dados de sono.",
    motivador: "Dormir melhor também é evoluir.",
    delicado: "Seu descanso merece cuidado e leveza.",
    neutro: "Acompanhe duração, qualidade e rotina do sono."
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
// 9. LOCALSTORAGE — SONO
// =====================================================

function loadSleepLogs() {
  const saved = localStorage.getItem("fluir-sleep-logs");

  if (!saved) {
    sleepLogs = [];
    return;
  }

  try {
    sleepLogs = JSON.parse(saved);
  } catch (error) {
    console.warn("Erro ao ler registros de sono:", error);
    sleepLogs = [];
  }
}

function saveSleepLogs() {
  localStorage.setItem("fluir-sleep-logs", JSON.stringify(sleepLogs));
}


// =====================================================
// 10. TIMELINE
// =====================================================

function saveTimelineEvent(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}

function createSleepTimelineEvent(title, description) {
  saveTimelineEvent({
    id: Date.now(),
    title,
    category: "sleep",
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  });
}


// =====================================================
// 11. CÁLCULO DE DURAÇÃO
// =====================================================

function calculateSleepDuration(startTime, endTime) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let start = startHour * 60 + startMinute;
  let end = endHour * 60 + endMinute;

  // Se acordou no dia seguinte
  if (end <= start) {
    end += 24 * 60;
  }

  return end - start;
}

function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function getSleepGoalMinutes() {
  const rawGoal = setupData.preferences?.sleep?.sleepGoal || "8h";
  const match = String(rawGoal).match(/\d+/);

  if (!match) {
    return 480;
  }

  return Number(match[0]) * 60;
}

function formatQuality(quality) {
  const labels = {
    boa: "Boa",
    media: "Média",
    ruim: "Ruim"
  };

  return labels[quality] || "Média";
}


// =====================================================
// 12. ESCAPAR HTML
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
// 13. RENDERIZAR LISTA
// =====================================================

function renderSleepLogs() {
  if (!sleepList) {
    return;
  }

  sleepList.innerHTML = "";

  sleepLogs.forEach((log) => {
    sleepList.appendChild(createSleepCard(log));
  });

  updateEmptyState();
  updateSummaryCards();
  renderWeekGrid();
  renderMiniTimeline();
}

function createSleepCard(log) {
  const card = document.createElement("article");

  card.className = "sleep-card";
  card.dataset.id = log.id;

  const durationText = formatMinutes(log.durationMinutes);
const formattedDate = formatSleepDate(log.date);
const qualityText = formatQuality(log.quality);
const typeText = log.type === "nap" ? "Cochilo" : "Sono principal";
const goalMessage = getSleepGoalMessage(log.durationMinutes, log.type);

  card.innerHTML = `
    <div class="sleep-icon">☾</div>

    <div class="sleep-info">
      <div class="sleep-card-header">
        <strong>${durationText}</strong>
        <span>${formattedDate}</span>
      </div>

      <p>${escapeHTML(log.note || "Registro de sono salvo.")}</p>

      <div class="sleep-meta">
  <span>${typeText}</span>
  <span>Dormiu: ${escapeHTML(log.startTime || "--:--")}</span>
  <span>Acordou: ${escapeHTML(log.endTime || "--:--")}</span>
  <span>Qualidade: ${qualityText}</span>
</div>

      <div class="sleep-goal-message">
        ${goalMessage}
      </div>
    </div>

    <button class="sleep-action-btn delete-sleep-btn" type="button" title="Excluir registro">
      ×
    </button>
  `;

  const deleteButton = card.querySelector(".delete-sleep-btn");

  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteSleepLog(log.id);
    });
  }

  return card;
}

// =====================================================
// FORMATAR DATA DO REGISTRO DE SONO
// Transforma "2026-05-20" em "20/05/2026"
// =====================================================

function formatSleepDate(dateValue) {
  if (!dateValue) {
    return "Data não informada";
  }

  const dateParts = String(dateValue).split("-");

  if (dateParts.length === 3) {
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }

  return dateValue;
}


// =====================================================
// MENSAGEM DE META DO SONO
// Por enquanto considera 7h como mínimo saudável no sistema.
// Depois podemos puxar a meta real do setup.
// =====================================================

function getSleepGoalMessage(durationMinutes, type = "main") {
  const minutes = Number(durationMinutes) || 0;
  const sevenHours = 7 * 60;
  const eightHours = 8 * 60;

  if (type === "nap") {
    if (minutes >= 10 && minutes <= 40) {
      return `
        <span class="sleep-message good">
          ♡ Cochilo leve registrado. Uma pausa curta também ajuda.
        </span>
      `;
    }

    return `
      <span class="sleep-message neutral">
        ☾ Cochilo registrado.
      </span>
    `;
  }

  if (minutes >= eightHours) {
    return `
      <span class="sleep-message success">
        ✦ Meta batida. Você dormiu muito bem nessa noite.
      </span>
    `;
  }

  if (minutes >= sevenHours) {
    return `
      <span class="sleep-message good">
        ♡ Boa noite de sono. Você chegou perto de uma rotina bem equilibrada.
      </span>
    `;
  }

  if (minutes > 0) {
    return `
      <span class="sleep-message alert">
        ☾ Sono abaixo da meta. Tente descansar um pouco mais quando puder.
      </span>
    `;
  }

  return `
    <span class="sleep-message neutral">
      Registro salvo.
    </span>
  `;
}

function updateEmptyState() {
  if (!emptyState) {
    return;
  }

  if (sleepLogs.length === 0) {
    emptyState.classList.add("active");
  } else {
    emptyState.classList.remove("active");
  }

  if (sleepListSubtitle) {
    sleepListSubtitle.textContent = `${sleepLogs.length} registro${sleepLogs.length === 1 ? "" : "s"} de sono.`;
  }
}


// =====================================================
// 14. RESUMOS
// =====================================================

function updateSummaryCards() {
  const lastLog = sleepLogs[0];
  const goalMinutes = getSleepGoalMinutes();

  if (!lastLog) {
    if (lastSleepDuration) lastSleepDuration.textContent = "0h";
    if (lastSleepQuality) lastSleepQuality.textContent = "--";
    if (weeklyAverage) weeklyAverage.textContent = "0h";
    if (sleepGoalProgress) sleepGoalProgress.textContent = "0%";
    if (sidebarSleepPercent) sidebarSleepPercent.textContent = "0%";
    if (sidebarSleepBar) sidebarSleepBar.style.width = "0%";
    if (sidebarSleepText) sidebarSleepText.textContent = "Nenhum registro de sono ainda.";
    return;
  }

  const percent = Math.min(100, Math.round((lastLog.durationMinutes / goalMinutes) * 100));

  if (lastSleepDuration) {
    lastSleepDuration.textContent = formatMinutes(lastLog.durationMinutes);
  }

  if (lastSleepQuality) {
    lastSleepQuality.textContent = formatQuality(lastLog.quality);
  }

  if (sleepGoalProgress) {
    sleepGoalProgress.textContent = `${percent}%`;
  }

  if (sidebarSleepPercent) {
    sidebarSleepPercent.textContent = `${percent}%`;
  }

  if (sidebarSleepBar) {
    sidebarSleepBar.style.width = `${percent}%`;
  }

  if (sidebarSleepText) {
    sidebarSleepText.textContent = `${formatMinutes(lastLog.durationMinutes)} da meta de ${formatMinutes(goalMinutes)}.`;
  }

  const weekKeys = getCurrentWeekKeys();
  const weekLogs = sleepLogs.filter((log) => weekKeys.includes(log.date));

  const totalMinutes = weekLogs.reduce((sum, log) => sum + Number(log.durationMinutes || 0), 0);
  const average = weekLogs.length === 0 ? 0 : Math.round(totalMinutes / weekLogs.length);

  if (weeklyAverage) {
    weeklyAverage.textContent = formatMinutes(average);
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

    const hasLog = sleepLogs.some((log) => log.date === dateKey);

    if (hasLog) {
      dayElement.textContent = "✓";
      dayElement.classList.add("done");
    } else {
      dayElement.textContent = "○";
      dayElement.classList.remove("done");
    }
  });

  const weekLogs = sleepLogs.filter((log) => weekKeys.includes(log.date));

  if (weekText) {
    if (weekLogs.length === 0) {
      weekText.textContent = "Registre suas noites para visualizar seu padrão semanal.";
      return;
    }

    weekText.textContent = `Você registrou ${weekLogs.length} noite${weekLogs.length === 1 ? "" : "s"} nesta semana.`;
  }
}


// =====================================================
// 16. MINI TIMELINE
// =====================================================

function renderMiniTimeline() {
  if (!sleepMiniTimeline) {
    return;
  }

  sleepMiniTimeline.innerHTML = "";

  const recent = sleepLogs.slice(0, 3);

  if (recent.length === 0) {
    sleepMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>Nenhum registro ainda</strong>
          Registre sua primeira noite.
        </p>
      </div>
    `;
    return;
  }

  recent.forEach((log) => {
    const item = document.createElement("div");

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${escapeHTML(log.createdTime)}</time>
      <p>
        <strong>Sono registrado</strong>
        ${formatMinutes(log.durationMinutes)} · ${formatQuality(log.quality)}
      </p>
    `;

    sleepMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 17. MODAL — MENSAGENS
// =====================================================

function showSleepFormMessage(message, type = "error") {
  if (!sleepFormMessage) {
    return;
  }

  sleepFormMessage.textContent = message;
  sleepFormMessage.className = `sleep-form-message show ${type}`;
}

function clearSleepFormMessage() {
  if (!sleepFormMessage) {
    return;
  }

  sleepFormMessage.textContent = "";
  sleepFormMessage.className = "sleep-form-message";
}

function clearSleepInvalidFields() {
  document.querySelectorAll(".sleep-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 18. MODAL — ABRIR / FECHAR
// =====================================================

function openSleepModal() {
  if (!sleepModal) {
    return;
  }

  clearSleepModalFields();
  sleepModal.classList.add("active");

  setTimeout(() => {
    if (sleepStartInput) {
      sleepStartInput.focus();
    }
  }, 100);
}

function closeSleepModal() {
  if (!sleepModal) {
    return;
  }

  sleepModal.classList.remove("active");
}

function clearSleepModalFields() {
  if (sleepStartInput) sleepStartInput.value = "";
  if (sleepEndInput) sleepEndInput.value = "";
  if (sleepQualitySelect) sleepQualitySelect.value = "boa";
  if (sleepNoteInput) sleepNoteInput.value = "";

  clearSleepFormMessage();
  clearSleepInvalidFields();
}

// =====================================================
// FUNÇÕES AUXILIARES DE VALIDAÇÃO DO SONO
// Evitam erro caso alguma função ainda não exista no arquivo.
// =====================================================

function clearSleepInvalidFields() {
  document.querySelectorAll(".invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}

function getSleepGoalMinutes() {
  /*
    Primeiro tenta pegar a meta salva no setup.
    Se não encontrar, usa 8 horas como padrão.
  */
  const setupData = getSavedSetup();
  const sleepGoal = setupData.preferences?.sleep?.sleepGoal || "8h";

  if (typeof sleepGoal === "number") {
    return sleepGoal * 60;
  }

  const goalText = String(sleepGoal).toLowerCase();

  if (goalText.includes("7")) {
    return 7 * 60;
  }

  if (goalText.includes("9")) {
    return 9 * 60;
  }

  return 8 * 60;
}

// =====================================================
// 19. SALVAR REGISTRO
// =====================================================
function saveSleepLog() {
  clearSleepFormMessage();
  clearSleepInvalidFields();

  const startTime = sleepStartInput?.value;
  const endTime = sleepEndInput?.value;

  const quality = sleepQualitySelect?.value || "boa";
const type = sleepTypeSelect?.value || "main";
const note = sleepNoteInput?.value.trim() || "";
const todayKey = getTodayKey();

  if (!startTime) {
    sleepStartInput.classList.add("invalid");
    sleepStartInput.focus();
    showSleepFormMessage("Informe a hora que você dormiu.");
    return;
  }

  if (!endTime) {
    sleepEndInput.classList.add("invalid");
    sleepEndInput.focus();
    showSleepFormMessage("Informe a hora que você acordou.");
    return;
  }

  const durationMinutes = calculateSleepDuration(startTime, endTime);

  /*
    Evita registros estranhos:
    - menos de 1h provavelmente é cochilo curto, não registro principal de sono
    - mais de 16h pode indicar erro nos horários
  */
  if (type === "main" && (durationMinutes < 60 || durationMinutes > 960)) {
  showSleepFormMessage("Confira os horários. O sono principal precisa estar entre 1h e 16h.");
  return;
}

if (type === "nap" && (durationMinutes < 10 || durationMinutes > 240)) {
  showSleepFormMessage("Confira os horários. O cochilo precisa estar entre 10 minutos e 4 horas.");
  return;
}

  /*
    Permite mais de um registro no mesmo dia,
    mas impede horários sobrepostos.

    Exemplo bloqueado:
    já existe 13:00 → 22:00
    novo 14:00 → 16:00
  */
  const hasOverlap = sleepLogs.some((log) => {
    return log.date === todayKey && sleepIntervalsOverlap(
      log.startTime,
      log.endTime,
      startTime,
      endTime
    );
  });

  if (hasOverlap) {
    showSleepFormMessage(
      "Esse horário se sobrepõe a outro registro de sono deste dia. Ajuste os horários antes de salvar."
    );
    return;
  }

  /*
    Evita duplicar exatamente o mesmo registro.
  */
  const duplicatedTime = sleepLogs.some((log) => {
    return (
      log.date === todayKey &&
      log.startTime === startTime &&
      log.endTime === endTime
    );
  });

  if (duplicatedTime) {
    showSleepFormMessage("Já existe um registro com esse mesmo horário.");
    return;
  }

  const newLog = {
  id: Date.now(),
  startTime,
  endTime,
  type,
  quality,
  note,
  durationMinutes,
  date: todayKey,
  createdTime: getCurrentTimeLabel(),
  createdAt: new Date().toISOString()
};

  sleepLogs.unshift(newLog);
  saveSleepLogs();

  createSleepTimelineEvent(
  type === "nap" ? "Cochilo registrado" : "Sono registrado",
  `${formatMinutes(durationMinutes)} · qualidade ${formatQuality(quality)}`
);

  renderSleepLogs();

  const goalMinutes = getSleepGoalMinutes();

  if (durationMinutes >= goalMinutes) {
    showSleepFormMessage("Registro salvo. Meta de sono batida, parabéns!", "success");
  } else {
    showSleepFormMessage("Registro salvo com sucesso.", "success");
  }

  setTimeout(() => {
    closeSleepModal();
    clearSleepModalFields();
  }, 650);
}

// =====================================================
// VERIFICAR SOBREPOSIÇÃO ENTRE HORÁRIOS DE SONO
// Permite vários registros no mesmo dia, mas não horários cruzados.
// =====================================================

function sleepIntervalsOverlap(existingStart, existingEnd, newStart, newEnd) {
  const existingInterval = normalizeSleepInterval(existingStart, existingEnd);
  const newInterval = normalizeSleepInterval(newStart, newEnd);

  /*
    Dois períodos se sobrepõem quando:
    início A < fim B
    e
    início B < fim A
  */
  return (
    existingInterval.start < newInterval.end &&
    newInterval.start < existingInterval.end
  );
}


// =====================================================
// NORMALIZAR INTERVALO DE SONO
// Transforma "22:00 → 06:00" em um intervalo que passa da meia-noite.
// =====================================================

function normalizeSleepInterval(startTime, endTime) {
  const start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);

  /*
    Se acordou em horário menor ou igual ao horário que dormiu,
    significa que acordou no dia seguinte.

    Exemplo:
    22:00 → 06:00
    start = 1320
    end = 360 + 1440
  */
  if (end <= start) {
    end += 24 * 60;
  }

  return {
    start,
    end
  };
}


// =====================================================
// CONVERTER HORÁRIO "HH:MM" PARA MINUTOS
// =====================================================

function timeToMinutes(timeValue) {
  const [hours, minutes] = String(timeValue).split(":").map(Number);

  return (hours * 60) + minutes;
}

// =====================================================
// 20. EXCLUIR / LIMPAR
// =====================================================

function deleteSleepLog(logId) {
  sleepLogs = sleepLogs.filter((log) => log.id !== logId);

  saveSleepLogs();

  createSleepTimelineEvent("Registro de sono removido", "Um registro de sono foi excluído.");

  renderSleepLogs();
}

function clearSleepLogs() {
  if (sleepLogs.length === 0) {
    return;
  }

  sleepLogs = [];
  saveSleepLogs();

  createSleepTimelineEvent("Registros de sono limpos", "O histórico de sono foi limpo.");

  renderSleepLogs();
}


// =====================================================
// 21. EVENTOS
// =====================================================

function setupSleepModal() {
  if (newSleepBtn) {
    newSleepBtn.addEventListener("click", openSleepModal);
  }

  if (quickSleepBtn) {
    quickSleepBtn.addEventListener("click", openSleepModal);
  }

  if (closeSleepModalBtn) {
    closeSleepModalBtn.addEventListener("click", () => {
      closeSleepModal();
      clearSleepModalFields();
    });
  }

  if (saveSleepBtn) {
    saveSleepBtn.addEventListener("click", saveSleepLog);
  }

  if (sleepModal) {
    sleepModal.addEventListener("click", (event) => {
      if (event.target === sleepModal) {
        closeSleepModal();
        clearSleepModalFields();
      }
    });
  }
}

function setupClearSleepButton() {
  if (!clearSleepBtn) {
    return;
  }

  clearSleepBtn.addEventListener("click", clearSleepLogs);
}


// =====================================================
// 22. INICIALIZAÇÃO
// =====================================================

function initSleepPage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadSleepLogs();

  setupSleepModal();
  setupClearSleepButton();

  renderSleepLogs();
}

initSleepPage();