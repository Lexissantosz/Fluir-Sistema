// =====================================================
// FLUIR — TIMELINE SEPARADA
// JavaScript puro para personalizar e controlar a Timeline
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

const filterButtons = document.querySelectorAll(".filter-btn");

const newEventBtn = document.getElementById("newEventBtn");
const eventModal = document.getElementById("eventModal");
const closeEventModalBtn = document.getElementById("closeEventModalBtn");

const saveEventBtn = document.getElementById("saveEventBtn");
const eventTitleInput = document.getElementById("eventTitleInput");
const eventCategorySelect = document.getElementById("eventCategorySelect");
const eventDescriptionInput = document.getElementById("eventDescriptionInput");
const eventFormMessage = document.getElementById("eventFormMessage");


// =====================================================
// 2. CONFIGURAÇÃO PADRÃO
// Caso ainda não exista setup salvo
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
// 3. LER CONFIGURAÇÃO SALVA DO SETUP
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
// =====================================================

function updateWelcomeArea() {
  const nickname = setupData.user?.nickname?.trim();
  const name = setupData.user?.name?.trim();

  const displayName = nickname || name || "Deibson";

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${displayName}`;
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
    calmo: "Respire fundo. Tudo que importa pode ser acompanhado com calma.",
    direto: "Veja seus eventos, filtre informações e siga para o próximo passo.",
    motivador: "Cada registro mostra sua constância. Continue avançando.",
    delicado: "Com leveza, sua rotina vai ganhando forma.",
    neutro: "Acompanhe seus registros, eventos e mudanças ao longo do tempo."
  };

  return subtitles[tone] || subtitles.calmo;
}


// =====================================================
// 6. ESCONDER MÓDULOS NÃO ATIVOS NO MENU
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
// 7. MAPAS DE CATEGORIAS
// =====================================================

function getCategoryLabel(category) {
  const labels = {
    tasks: "Tarefas",
    habits: "Hábitos",
    health: "Saúde",
    finances: "Finanças",
    diary: "Diário",
    attachments: "Anexos",
    sleep: "Sono",
    water: "Água"
  };

  return labels[category] || "Evento";
}

function getCategoryIcon(category) {
  const icons = {
    tasks: "✓",
    habits: "◌",
    health: "✦",
    finances: "$",
    diary: "▤",
    attachments: "⌁",
    sleep: "☾",
    water: "♢"
  };

  return icons[category] || "•";
}


// =====================================================
// 8. FILTRO ATIVO ATUAL
// =====================================================

function getActiveTimelineFilter() {
  const activeButton = document.querySelector(".filter-btn.active");

  if (!activeButton) {
    return "all";
  }

  return activeButton.dataset.filter || "all";
}


// =====================================================
// 9. PEGAR TODOS OS EVENTOS ATUAIS
// Importante: pega eventos criados depois também
// =====================================================

function getAllEventItems() {
  return document.querySelectorAll(".event-item");
}


// =====================================================
// 10. FILTROS DA TIMELINE
// =====================================================

function setupTimelineFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      applyTimelineVisibility();
    });
  });
}


// =====================================================
// 11. CHECAR SE EVENTO PERTENCE AO FILTRO
// =====================================================

function eventMatchesFilter(eventType, activeFilter) {
  if (activeFilter === "all") {
    return true;
  }

  return eventType === activeFilter;
}


// =====================================================
// 12. CHECAR SE EVENTO PERTENCE A UM MÓDULO ATIVO
// =====================================================

function eventMatchesActiveModules(eventType) {
  const modules = setupData.modules || defaultSetup.modules;

  if (eventType === "tasks") {
    return !!modules.tasks;
  }

  if (eventType === "habits") {
    return !!modules.habits;
  }

  if (eventType === "finances") {
    return !!modules.finances;
  }

  if (eventType === "diary") {
    return !!modules.diary;
  }

  if (eventType === "attachments") {
    return !!modules.attachments;
  }

  if (eventType === "sleep") {
    return !!modules.sleep;
  }

  if (eventType === "water") {
    return !!modules.water;
  }

  if (eventType === "health") {
    return (
      !!modules.sleep ||
      !!modules.water ||
      !!modules.nutrition ||
      !!modules.physicalHealth ||
      !!modules.menstrualCycle
    );
  }

  return true;
}


// =====================================================
// 13. APLICAR VISIBILIDADE FINAL
// Essa é a função principal que corrige o bug.
// Ela considera filtro + módulos ativos ao mesmo tempo.
// =====================================================

function applyTimelineVisibility() {
  const activeFilter = getActiveTimelineFilter();
  const allEvents = getAllEventItems();

  allEvents.forEach((event) => {
    const eventType = event.dataset.type;

    const matchesFilter = eventMatchesFilter(eventType, activeFilter);
    const matchesModule = eventMatchesActiveModules(eventType);

    if (matchesFilter && matchesModule) {
      event.classList.remove("hidden-event");
    } else {
      event.classList.add("hidden-event");
    }
  });

  updateDayCounters();
}


// =====================================================
// 14. ATUALIZAR CONTADORES DOS DIAS
// Conta somente eventos visíveis de verdade
// =====================================================

function updateDayCounters() {
  const timelineDays = document.querySelectorAll(".timeline-day");

  timelineDays.forEach((day) => {
    const title = day.querySelector("h4");

    if (!title) {
      return;
    }

    const existingCounter = title.querySelector(".day-counter");

    if (existingCounter) {
      existingCounter.remove();
    }

    const visibleEvents = day.querySelectorAll(".event-item:not(.hidden-event)");

    const counter = document.createElement("span");
    counter.className = "day-counter";

    const total = visibleEvents.length;
    counter.textContent = `${total} evento${total === 1 ? "" : "s"}`;

    title.appendChild(counter);

    if (total === 0) {
      day.classList.add("empty-day");
    } else {
      day.classList.remove("empty-day");
    }
  });
}


// =====================================================
// 15. MENSAGEM DO MODAL
// =====================================================

function showEventFormMessage(message, type = "error") {
  if (!eventFormMessage) {
    return;
  }

  eventFormMessage.textContent = message;
  eventFormMessage.className = `event-form-message show ${type}`;
}

function clearEventFormMessage() {
  if (!eventFormMessage) {
    return;
  }

  eventFormMessage.textContent = "";
  eventFormMessage.className = "event-form-message";
}

function clearEventInvalidFields() {
  document.querySelectorAll(".event-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 16. DADOS DE DATA/HORA
// =====================================================

function getCurrentTimeLabel() {
  const now = new Date();

  return now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getTodayKey() {
  const now = new Date();

  return toLocalDateKey(now);
}

function getTomorrowKey() {
  const today = new Date(`${getTodayKey()}T00:00:00`);
  today.setDate(today.getDate() + 1);

  return toLocalDateKey(today);
}

function formatReminderDateLabel(dateKey) {
  if (dateKey === getTodayKey()) {
    return "Hoje";
  }

  if (dateKey === getTomorrowKey()) {
    return "Amanhã";
  }

  const date = new Date(`${dateKey}T00:00:00`);

  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
}

function getUpcomingReminders(limit = 3) {
  const savedTasks = JSON.parse(localStorage.getItem("fluir-tasks")) || [];
  const todayKey = getTodayKey();

  return savedTasks
    .filter((task) => !task.completed && task.date && task.date >= todayKey)
    .sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }

      return (a.time || "").localeCompare(b.time || "");
    })
    .slice(0, limit);
}

function renderUpcomingReminders() {
  const reminderList = document.getElementById("reminderList");

  if (!reminderList) {
    return;
  }

  const reminders = getUpcomingReminders();

  if (reminders.length === 0) {
    reminderList.innerHTML = `<p class="reminder-empty">Nenhum lembrete próximo.</p>`;
    return;
  }

  reminderList.innerHTML = reminders.map((task) => {
    return `
      <div>
        <time>${escapeHTML(task.time || "--:--")}</time>
        <p>
          <strong>${escapeHTML(task.title)}</strong>
          ${escapeHTML(formatReminderDateLabel(task.date))}
        </p>
      </div>
    `;
  }).join("");
}

function formatOverdueLabel(dateKey) {
  const today = new Date(`${getTodayKey()}T00:00:00`);
  const taskDate = new Date(`${dateKey}T00:00:00`);
  const diffDays = Math.round((today - taskDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    return "Atrasada há 1 dia";
  }

  return `Atrasada há ${diffDays} dias`;
}

function getOverdueReminders(limit = 3) {
  const savedTasks = JSON.parse(localStorage.getItem("fluir-tasks")) || [];
  const todayKey = getTodayKey();

  return savedTasks
    .filter((task) => !task.completed && task.date && task.date < todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

function renderOverdueReminders() {
  const overdueList = document.getElementById("overdueRemindersList");

  if (!overdueList) {
    return;
  }

  const overdueTasks = getOverdueReminders();

  if (overdueTasks.length === 0) {
    overdueList.innerHTML = `<p class="reminder-empty">Nenhuma tarefa atrasada.</p>`;
    return;
  }

  overdueList.innerHTML = overdueTasks.map((task) => {
    return `
      <div>
        <time>${escapeHTML(task.time || "--:--")}</time>
        <p>
          <strong>${escapeHTML(task.title)}</strong>
          ${escapeHTML(formatOverdueLabel(task.date))}
        </p>
      </div>
    `;
  }).join("");
}

// =====================================================
// 17. LOCALSTORAGE — SALVAR EVENTO
// =====================================================

function saveEventToLocalStorage(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}


// =====================================================
// 18. CRIAR HTML DO EVENTO
// =====================================================

function createEventElement(eventData) {
  const eventItem = document.createElement("div");

  eventItem.className = "event-item user-created-event";
  eventItem.dataset.type = eventData.category;

  eventItem.innerHTML = `
    <time>${eventData.time}</time>

    <span class="event-dot"></span>

    <div class="event-icon">${getCategoryIcon(eventData.category)}</div>

    <div class="event-content">
      <strong>${escapeHTML(eventData.title)}</strong>
      <p>${escapeHTML(eventData.description || "Evento registrado manualmente.")}</p>
    </div>

    <span class="event-tag">${getCategoryLabel(eventData.category)}</span>
  `;

  return eventItem;
}


// =====================================================
// 19. EVITAR HTML INDESEJADO NO EVENTO
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
// 20. ADICIONAR EVENTO NA TELA
// =====================================================
// Antes, os eventos eram sempre inseridos no topo (prepend).
// Isso só ficava correto se a ordem de inserção fosse sempre
// igual à ordem cronológica real — o que não acontecia quando
// eventos de módulos diferentes (tarefas, hábitos, água...)
// eram salvos fora de ordem, ou quando a página era recarregada.
// Agora, todo evento é inserido e a lista é reordenada pelo
// horário real (campo <time>), então a ordem exibida sempre
// bate com o horário do evento, não com a ordem de inserção.

function parseTimeToMinutes(timeLabel) {
  if (!timeLabel) {
    return -1;
  }

  const [hours, minutes] = timeLabel.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return -1;
  }

  return hours * 60 + minutes;
}

function sortEventListByTime(eventList) {
  if (!eventList) {
    return;
  }

  const items = Array.from(eventList.querySelectorAll(".event-item"));

  items.sort((a, b) => {
    const timeA = parseTimeToMinutes(a.querySelector("time")?.textContent.trim());
    const timeB = parseTimeToMinutes(b.querySelector("time")?.textContent.trim());
    return timeA - timeB;
  });

  items.forEach((item) => eventList.appendChild(item));
}

function addEventToTimeline(eventData) {
  const todayEventList = document.querySelector(".timeline-day .event-list");

  if (!todayEventList) {
    return;
  }

  const eventElement = createEventElement(eventData);

  todayEventList.appendChild(eventElement);
  sortEventListByTime(todayEventList);
}


// =====================================================
// 21. CARREGAR EVENTOS SALVOS
// =====================================================

function loadSavedTimelineEvents() {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  if (!savedEvents.length) {
    return;
  }

  savedEvents.forEach((eventData) => {
    addEventToTimeline(eventData);
  });
}


// =====================================================
// 22. LIMPAR CAMPOS DO MODAL
// =====================================================

function clearEventModalFields() {
  if (eventTitleInput) {
    eventTitleInput.value = "";
  }

  if (eventDescriptionInput) {
    eventDescriptionInput.value = "";
  }

  if (eventCategorySelect) {
    eventCategorySelect.value = "tasks";
  }

  clearEventFormMessage();
  clearEventInvalidFields();
}


// =====================================================
// 23. FECHAR MODAL
// =====================================================

function closeEventModal() {
  if (!eventModal) {
    return;
  }

  eventModal.classList.remove("active");
}


// =====================================================
// 24. SALVAR NOVO EVENTO
// =====================================================

function saveNewEvent() {
  clearEventFormMessage();
  clearEventInvalidFields();

  const title = eventTitleInput?.value.trim();
  const category = eventCategorySelect?.value;
  const description = eventDescriptionInput?.value.trim();

  if (!title || title.length < 2) {
    if (eventTitleInput) {
      eventTitleInput.classList.add("invalid");
      eventTitleInput.focus();
    }

    showEventFormMessage("Digite um título válido para o evento.");
    return;
  }

  if (!category) {
    if (eventCategorySelect) {
      eventCategorySelect.classList.add("invalid");
      eventCategorySelect.focus();
    }

    showEventFormMessage("Escolha uma categoria para o evento.");
    return;
  }

  const newEvent = {
    id: Date.now(),
    title,
    category,
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  };

  saveEventToLocalStorage(newEvent);
  addEventToTimeline(newEvent);

  // Correção principal:
  // depois de criar o evento, reaplica filtro e módulos
  applyTimelineVisibility();

  showEventFormMessage("Evento salvo com sucesso.", "success");

  setTimeout(() => {
    closeEventModal();
    clearEventModalFields();
  }, 450);
}


// =====================================================
// 25. MODAL DE NOVO EVENTO
// =====================================================

function setupEventModal() {
  if (newEventBtn && eventModal) {
    newEventBtn.addEventListener("click", () => {
      clearEventModalFields();
      eventModal.classList.add("active");

      setTimeout(() => {
        if (eventTitleInput) {
          eventTitleInput.focus();
        }
      }, 100);
    });
  }

  if (closeEventModalBtn && eventModal) {
    closeEventModalBtn.addEventListener("click", () => {
      closeEventModal();
      clearEventModalFields();
    });
  }

  if (saveEventBtn) {
    saveEventBtn.addEventListener("click", () => {
      saveNewEvent();
    });
  }

  if (eventTitleInput) {
    eventTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveNewEvent();
      }
    });
  }

  if (eventDescriptionInput) {
    eventDescriptionInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveNewEvent();
      }
    });
  }

  if (eventModal) {
    eventModal.addEventListener("click", (event) => {
      if (event.target === eventModal) {
        closeEventModal();
        clearEventModalFields();
      }
    });
  }
}


// =====================================================
// 26. BOTÕES DE HUMOR
// =====================================================

function setupMoodButtons() {
  const moodButtons = document.querySelectorAll(".mood-options button");

  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      moodButtons.forEach((item) => {
        item.classList.remove("selected-mood");
      });

      button.classList.add("selected-mood");
    });
  });
}


// =====================================================
// 27. INICIALIZAÇÃO
// =====================================================

function initTimeline() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  // Primeiro carrega os eventos salvos
  loadSavedTimelineEvents();

  // Depois aplica o filtro correto
  applyTimelineVisibility();

    // Carrega os lembretes reais a partir das tarefas cadastradas
  renderUpcomingReminders();
  renderOverdueReminders();

  setupTimelineFilters();
  setupEventModal();
  setupMoodButtons();
}

initTimeline();

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
  const displayName = nickname || name || "Deibson";

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