// =====================================================
// FLUIR — TAREFAS
// JavaScript puro para controlar a tela de tarefas
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

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskListSubtitle = document.getElementById("taskListSubtitle");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const priorityTasks = document.getElementById("priorityTasks");

const sidebarTaskPercent = document.getElementById("sidebarTaskPercent");
const sidebarTaskBar = document.getElementById("sidebarTaskBar");
const sidebarTaskText = document.getElementById("sidebarTaskText");

const focusRecommendation = document.getElementById("focusRecommendation");
const focusMiniList = document.getElementById("focusMiniList");
const categoryList = document.getElementById("categoryList");
const taskMiniTimeline = document.getElementById("taskMiniTimeline");

const filterButtons = document.querySelectorAll(".filter-btn");

const newTaskBtn = document.getElementById("newTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeTaskModalBtn = document.getElementById("closeTaskModalBtn");
const saveTaskBtn = document.getElementById("saveTaskBtn");

const taskTitleInput = document.getElementById("taskTitleInput");
const taskCategorySelect = document.getElementById("taskCategorySelect");
const taskPrioritySelect = document.getElementById("taskPrioritySelect");
const taskTimeInput = document.getElementById("taskTimeInput");
const taskDescriptionInput = document.getElementById("taskDescriptionInput");
const taskFormMessage = document.getElementById("taskFormMessage");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");


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
// 3. DADOS PADRÃO DE TAREFAS
// Usados quando ainda não existe nenhuma tarefa salva
// =====================================================

const defaultTasks = [
  {
    id: 1,
    title: "Revisar proposta do projeto",
    description: "Conferir detalhes antes de enviar.",
    category: "Trabalho",
    priority: "high",
    time: "09:00",
    completed: false,
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Responder e-mails importantes",
    description: "Priorizar mensagens pendentes.",
    category: "Trabalho",
    priority: "medium",
    time: "11:00",
    completed: false,
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Estudar capítulo 4",
    description: "Marketing e posicionamento.",
    category: "Estudos",
    priority: "medium",
    time: "14:00",
    completed: false,
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: "Treino de força",
    description: "Registrar disposição depois do treino.",
    category: "Saúde",
    priority: "high",
    time: "18:00",
    completed: true,
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: "Ler 20 páginas",
    description: "Leitura leve antes de dormir.",
    category: "Pessoal",
    priority: "low",
    time: "20:30",
    completed: true,
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  }
];


// =====================================================
// 4. ESTADO DA TELA
// =====================================================

let tasks = [];
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
// 8. TEMA CLARO / ESCURO
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
// 9. SAUDAÇÃO PERSONALIZADA
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
    calmo: "Organize o essencial com calma. Uma tarefa por vez.",
    direto: "Veja suas pendências, escolha uma prioridade e avance.",
    motivador: "Cada tarefa concluída é um passo real de progresso.",
    delicado: "Com leveza, sua rotina pode ficar mais clara.",
    neutro: "Acompanhe suas tarefas, prioridades e próximos passos."
  };

  return subtitles[tone] || subtitles.calmo;
}


// =====================================================
// 10. ESCONDER MÓDULOS NÃO ATIVOS NO MENU
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
// 11. LOCALSTORAGE — TAREFAS
// =====================================================

function loadTasks() {
  const savedTasks = localStorage.getItem("fluir-tasks");

  if (!savedTasks) {
    tasks = [...defaultTasks];
    saveTasks();
    return;
  }

  try {
    tasks = JSON.parse(savedTasks);
  } catch (error) {
    console.warn("Erro ao ler tarefas salvas:", error);
    tasks = [...defaultTasks];
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem("fluir-tasks", JSON.stringify(tasks));
}


// =====================================================
// 12. LOCALSTORAGE — EVENTOS DA TIMELINE
// Quando cria/conclui/remove tarefa, registramos um evento
// =====================================================

function saveTimelineEvent(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}

function createTaskTimelineEvent(title, description) {
  saveTimelineEvent({
    id: Date.now(),
    title,
    category: "tasks",
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  });
}


// =====================================================
// 13. FORMATAR PRIORIDADE
// =====================================================

function getPriorityLabel(priority) {
  const labels = {
    low: "Baixa",
    medium: "Média",
    high: "Alta"
  };

  return labels[priority] || "Média";
}

function getPriorityClass(priority) {
  const classes = {
    low: "priority-low",
    medium: "priority-medium",
    high: "priority-high"
  };

  return classes[priority] || "priority-medium";
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
// 15. FILTRAR TAREFAS
// =====================================================

function taskMatchesFilter(task) {
  if (activeFilter === "all") {
    return true;
  }

  if (activeFilter === "pending") {
    return !task.completed;
  }

  if (activeFilter === "completed") {
    return task.completed;
  }

  if (activeFilter === "high") {
    return task.priority === "high";
  }

  if (activeFilter === "today") {
    return task.date === getTodayKey();
  }

  return true;
}

function getFilteredTasks() {
  return tasks.filter(taskMatchesFilter);
}


// =====================================================
// 16. RENDERIZAR LISTA DE TAREFAS
// =====================================================

function renderTasks() {
  if (!taskList) {
    return;
  }

  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    taskList.appendChild(taskCard);
  });

  updateEmptyState(filteredTasks.length);
  updateTaskListSubtitle(filteredTasks.length);
  updateSummaryCards();
  updateSidebarProgress();
  renderFocusMiniList();
  renderCategoryList();
  renderMiniTimeline();
}


// =====================================================
// 17. CRIAR CARD DE TAREFA
// =====================================================

function createTaskCard(task) {
  const card = document.createElement("article");

  card.className = `task-card ${task.completed ? "completed" : ""}`;
  card.dataset.id = task.id;

  card.innerHTML = `
    <input 
      type="checkbox" 
      ${task.completed ? "checked" : ""} 
      aria-label="Marcar tarefa como concluída"
    >

    <div class="task-info">
      <strong>${escapeHTML(task.title)}</strong>
      <p>${escapeHTML(task.description || "Sem observação.")}</p>

      <div class="task-meta">
        <span>${escapeHTML(task.category || "Pessoal")}</span>
        <span class="${getPriorityClass(task.priority)}">${getPriorityLabel(task.priority)}</span>
        <span>${task.time ? escapeHTML(task.time) : "Sem horário"}</span>
      </div>
    </div>

    <div class="task-actions">
      <button class="task-action-btn delete-task-btn" type="button" title="Excluir tarefa">
        ×
      </button>
    </div>
  `;

  const checkbox = card.querySelector('input[type="checkbox"]');
  const deleteButton = card.querySelector(".delete-task-btn");

  checkbox.addEventListener("change", () => {
    toggleTaskCompleted(task.id);
  });

  deleteButton.addEventListener("click", () => {
    deleteTask(task.id);
  });

  return card;
}


// =====================================================
// 18. EMPTY STATE
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

function updateTaskListSubtitle(visibleCount) {
  if (!taskListSubtitle) {
    return;
  }

  const subtitles = {
    all: `${visibleCount} tarefa${visibleCount === 1 ? "" : "s"} no total.`,
    pending: `${visibleCount} tarefa${visibleCount === 1 ? "" : "s"} pendente${visibleCount === 1 ? "" : "s"}.`,
    completed: `${visibleCount} tarefa${visibleCount === 1 ? "" : "s"} concluída${visibleCount === 1 ? "" : "s"}.`,
    high: `${visibleCount} tarefa${visibleCount === 1 ? "" : "s"} de alta prioridade.`,
    today: `${visibleCount} tarefa${visibleCount === 1 ? "" : "s"} para hoje.`
  };

  taskListSubtitle.textContent = subtitles[activeFilter] || subtitles.all;
}


// =====================================================
// 19. CARDS DE RESUMO
// =====================================================

function updateSummaryCards() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.filter((task) => !task.completed).length;
  const high = tasks.filter((task) => task.priority === "high" && !task.completed).length;

  if (totalTasks) {
    totalTasks.textContent = total;
  }

  if (completedTasks) {
    completedTasks.textContent = completed;
  }

  if (pendingTasks) {
    pendingTasks.textContent = pending;
  }

  if (priorityTasks) {
    priorityTasks.textContent = high;
  }
}


// =====================================================
// 20. PROGRESSO DA SIDEBAR
// =====================================================

function updateSidebarProgress() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (sidebarTaskPercent) {
    sidebarTaskPercent.textContent = `${percent}%`;
  }

  if (sidebarTaskBar) {
    sidebarTaskBar.style.width = `${percent}%`;
  }

  if (sidebarTaskText) {
    if (total === 0) {
      sidebarTaskText.textContent = "Nenhuma tarefa registrada ainda.";
      return;
    }

    sidebarTaskText.textContent = `${completed} de ${total} tarefa${total === 1 ? "" : "s"} concluída${completed === 1 ? "" : "s"}.`;
  }
}


// =====================================================
// 21. FOCO RECOMENDADO
// =====================================================

function renderFocusMiniList() {
  if (!focusMiniList) {
    return;
  }

  const importantTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const priorityWeight = {
        high: 3,
        medium: 2,
        low: 1
      };

      return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    })
    .slice(0, 3);

  focusMiniList.innerHTML = "";

  if (importantTasks.length === 0) {
    if (focusRecommendation) {
      focusRecommendation.textContent = "Você concluiu suas pendências principais. Respire um pouco.";
    }

    focusMiniList.innerHTML = `
      <div class="focus-mini-item">
        <strong>Nada urgente agora</strong>
        <span>Ótimo momento para revisar ou descansar.</span>
      </div>
    `;

    return;
  }

  if (focusRecommendation) {
    focusRecommendation.textContent = "Comece pelas tarefas mais importantes ou mais sensíveis ao tempo.";
  }

  importantTasks.forEach((task) => {
    const item = document.createElement("div");

    item.className = "focus-mini-item";

    item.innerHTML = `
      <strong>${escapeHTML(task.title)}</strong>
      <span>${getPriorityLabel(task.priority)} prioridade · ${escapeHTML(task.category)}</span>
    `;

    focusMiniList.appendChild(item);
  });
}


// =====================================================
// 22. CATEGORIAS
// =====================================================

function renderCategoryList() {
  if (!categoryList) {
    return;
  }

  const categoryCounts = {};

  tasks.forEach((task) => {
    const category = task.category || "Pessoal";

    if (!categoryCounts[category]) {
      categoryCounts[category] = 0;
    }

    categoryCounts[category]++;
  });

  categoryList.innerHTML = "";

  const entries = Object.entries(categoryCounts);

  if (entries.length === 0) {
    categoryList.innerHTML = `
      <div class="category-item">
        <span>Nenhuma categoria</span>
        <strong>0</strong>
      </div>
    `;
    return;
  }

  entries.forEach(([category, count]) => {
    const item = document.createElement("div");

    item.className = "category-item";

    item.innerHTML = `
      <span>${escapeHTML(category)}</span>
      <strong>${count}</strong>
    `;

    categoryList.appendChild(item);
  });
}


// =====================================================
// 23. MINI TIMELINE DE AÇÕES
// =====================================================

function renderMiniTimeline() {
  if (!taskMiniTimeline) {
    return;
  }

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  taskMiniTimeline.innerHTML = "";

  if (recentTasks.length === 0) {
    taskMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>Nenhuma ação ainda</strong>
          Crie sua primeira tarefa.
        </p>
      </div>
    `;
    return;
  }

  recentTasks.forEach((task) => {
    const item = document.createElement("div");

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${escapeHTML(task.time || "--:--")}</time>
      <p>
        <strong>${task.completed ? "Tarefa concluída" : "Tarefa criada"}</strong>
        ${escapeHTML(task.title)}
      </p>
    `;

    taskMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 24. MODAL — MENSAGENS
// =====================================================

function showTaskFormMessage(message, type = "error") {
  if (!taskFormMessage) {
    return;
  }

  taskFormMessage.textContent = message;
  taskFormMessage.className = `task-form-message show ${type}`;
}

function clearTaskFormMessage() {
  if (!taskFormMessage) {
    return;
  }

  taskFormMessage.textContent = "";
  taskFormMessage.className = "task-form-message";
}

function clearTaskInvalidFields() {
  document.querySelectorAll(".task-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 25. MODAL — ABRIR, FECHAR E LIMPAR
// =====================================================

function openTaskModal() {
  if (!taskModal) {
    return;
  }

  clearTaskModalFields();
  taskModal.classList.add("active");

  setTimeout(() => {
    if (taskTitleInput) {
      taskTitleInput.focus();
    }
  }, 100);
}

function closeTaskModal() {
  if (!taskModal) {
    return;
  }

  taskModal.classList.remove("active");
}

function clearTaskModalFields() {
  if (taskTitleInput) {
    taskTitleInput.value = "";
  }

  if (taskCategorySelect) {
    taskCategorySelect.value = "Pessoal";
  }

  if (taskPrioritySelect) {
    taskPrioritySelect.value = "low";
  }

  if (taskTimeInput) {
    taskTimeInput.value = "";
  }

  if (taskDescriptionInput) {
    taskDescriptionInput.value = "";
  }

  clearTaskFormMessage();
  clearTaskInvalidFields();
}


// =====================================================
// 26. CRIAR NOVA TAREFA
// =====================================================

function saveNewTask() {
  clearTaskFormMessage();
  clearTaskInvalidFields();

  const title = taskTitleInput?.value.trim();
  const category = taskCategorySelect?.value || "Pessoal";
  const priority = taskPrioritySelect?.value || "low";
  const time = taskTimeInput?.value || "";
  const description = taskDescriptionInput?.value.trim() || "";

  if (!title || title.length < 2) {
    if (taskTitleInput) {
      taskTitleInput.classList.add("invalid");
      taskTitleInput.focus();
    }

    showTaskFormMessage("Digite um título válido para a tarefa.");
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
    description,
    category,
    priority,
    time,
    completed: false,
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  saveTasks();

  createTaskTimelineEvent("Tarefa criada", title);

  renderTasks();

  showTaskFormMessage("Tarefa salva com sucesso.", "success");

  setTimeout(() => {
    closeTaskModal();
    clearTaskModalFields();
  }, 450);
}


// =====================================================
// 27. MARCAR / DESMARCAR TAREFA CONCLUÍDA
// =====================================================

function toggleTaskCompleted(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  task.completed = !task.completed;

  saveTasks();

  if (task.completed) {
    createTaskTimelineEvent("Tarefa concluída", task.title);
  } else {
    createTaskTimelineEvent("Tarefa reaberta", task.title);
  }

  renderTasks();
}


// =====================================================
// 28. EXCLUIR TAREFA
// =====================================================

function deleteTask(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  tasks = tasks.filter((item) => item.id !== taskId);

  saveTasks();

  if (task) {
    createTaskTimelineEvent("Tarefa removida", task.title);
  }

  renderTasks();
}


// =====================================================
// 29. LIMPAR TAREFAS CONCLUÍDAS
// =====================================================

function clearCompletedTasks() {
  const completedCount = tasks.filter((task) => task.completed).length;

  if (completedCount === 0) {
    return;
  }

  tasks = tasks.filter((task) => !task.completed);

  saveTasks();

  createTaskTimelineEvent("Tarefas concluídas limpas", `${completedCount} tarefa${completedCount === 1 ? "" : "s"} removida${completedCount === 1 ? "" : "s"} da lista.`);

  renderTasks();
}


// =====================================================
// 30. FILTROS
// =====================================================

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderTasks();
    });
  });
}


// =====================================================
// 31. CONFIGURAR EVENTOS DO MODAL
// =====================================================

function setupTaskModal() {
  if (newTaskBtn) {
    newTaskBtn.addEventListener("click", openTaskModal);
  }

  if (closeTaskModalBtn) {
    closeTaskModalBtn.addEventListener("click", () => {
      closeTaskModal();
      clearTaskModalFields();
    });
  }

  if (saveTaskBtn) {
    saveTaskBtn.addEventListener("click", saveNewTask);
  }

  if (taskTitleInput) {
    taskTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveNewTask();
      }
    });
  }

  if (taskDescriptionInput) {
    taskDescriptionInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveNewTask();
      }
    });
  }

  if (taskModal) {
    taskModal.addEventListener("click", (event) => {
      if (event.target === taskModal) {
        closeTaskModal();
        clearTaskModalFields();
      }
    });
  }
}


// =====================================================
// 32. CONFIGURAR BOTÃO DE LIMPAR CONCLUÍDAS
// =====================================================

function setupClearCompletedButton() {
  if (!clearCompletedBtn) {
    return;
  }

  clearCompletedBtn.addEventListener("click", clearCompletedTasks);
}


// =====================================================
// 33. INICIALIZAÇÃO
// =====================================================

function initTasksPage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadTasks();

  setupFilters();
  setupTaskModal();
  setupClearCompletedButton();

  renderTasks();
}

initTasksPage();