// =====================================================
// FLUIR — ÁGUA
// JavaScript puro para controlar a tela de água
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

const addCupBtn = document.getElementById("addCupBtn");
const waterQuickButtons = document.querySelectorAll(".water-quick-btn");
const addCupMainBtn = document.getElementById("addCupMainBtn");
const removeCupBtn = document.getElementById("removeCupBtn");
const resetWaterBtn = document.getElementById("resetWaterBtn");

const todayCups = document.getElementById("todayCups");
const waterProgress = document.getElementById("waterProgress");
const remainingCups = document.getElementById("remainingCups");
const weeklyAverage = document.getElementById("weeklyAverage");

const sidebarWaterPercent = document.getElementById("sidebarWaterPercent");
const sidebarWaterBar = document.getElementById("sidebarWaterBar");
const sidebarWaterText = document.getElementById("sidebarWaterText");

const waterCircleText = document.getElementById("waterCircleText");
const waterCircleSubtext = document.getElementById("waterCircleSubtext");
const waterCircle = document.querySelector(".water-circle");

const cupsArea = document.getElementById("cupsArea");
const goalText = document.getElementById("goalText");
const weekText = document.getElementById("weekText");
const waterMiniTimeline = document.getElementById("waterMiniTimeline");

const waterGoalModal = document.getElementById("waterGoalModal");
const openGoalModalBtn = document.getElementById("openGoalModalBtn");
const openGoalModalSideBtn = document.getElementById("openGoalModalSideBtn");
const closeWaterModalBtn = document.getElementById("closeWaterModalBtn");
const saveWaterGoalBtn = document.getElementById("saveWaterGoalBtn");
const waterGoalInput = document.getElementById("waterGoalInput");
const waterFormMessage = document.getElementById("waterFormMessage");


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
    water: {
      dailyGoal: 2000
    }
  }
};


// =====================================================
// 3. ESTADO
// =====================================================

let waterData = {
  goal: 2000,
  logs: {}
};


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
    calmo: "Hidratação simples, constante e fácil de acompanhar.",
    direto: "Registre sua agua e acompanhe sua meta.",
    motivador: "Cada copo conta. Continue cuidando de você.",
    delicado: "Cuidar do básico também pode ser leve.",
    neutro: "Acompanhe sua hidratação, meta e progresso diário."
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
// 9. LOCALSTORAGE — ÁGUA
// =====================================================

function loadWaterData() {
  const saved = localStorage.getItem("fluir-water");

  /*
    Agora a meta padrão é em ml.
    Antes era 8 copos, agora será 2000ml.
  */
  const setupGoal = Number(setupData.preferences?.water?.dailyGoal) || 2000;

  if (!saved) {
    waterData = {
      goal: setupGoal,
      logs: {}
    };

    saveWaterData();
    return;
  }

  try {
    waterData = JSON.parse(saved);

    if (!waterData.goal) {
      waterData.goal = setupGoal;
    }

    if (!waterData.logs) {
      waterData.logs = {};
    }

    /*
      MIGRAÇÃO AUTOMÁTICA:
      Se a meta antiga estava como 8, significa 8 copos.
      Então convertemos para 8 x 250ml = 2000ml.
    */
    if (waterData.goal > 0 && waterData.goal <= 30) {
      waterData.goal = waterData.goal * 250;
    }

    /*
      MIGRAÇÃO DOS REGISTROS ANTIGOS:
      Se algum dia tinha 3, significa 3 copos.
      Então vira 3 x 250ml = 750ml.
    */
    Object.keys(waterData.logs).forEach((dateKey) => {
      const value = Number(waterData.logs[dateKey]) || 0;

      if (value > 0 && value <= 30) {
        waterData.logs[dateKey] = value * 250;
      }
    });

    saveWaterData();
  } catch (error) {
    console.warn("Erro ao ler dados de água:", error);

    waterData = {
      goal: setupGoal,
      logs: {}
    };

    saveWaterData();
  }
}

function saveWaterData() {
  localStorage.setItem("fluir-water", JSON.stringify(waterData));
}


// =====================================================
// 10. TIMELINE
// =====================================================

function saveTimelineEvent(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}

function createWaterTimelineEvent(title, description) {
  saveTimelineEvent({
    id: Date.now(),
    title,
    category: "water",
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  });
}


// =====================================================
// 11. DADOS DO DIA
// =====================================================

function getTodayCups() {
  /*
    Mantemos o nome getTodayCups por compatibilidade,
    mas agora ele retorna o total de água em ml do dia.
  */

  const today = getTodayKey();

  return Number(waterData.logs[today] || 0);
}

function setTodayCups(value) {
  /*
    Mantemos o nome setTodayCups por compatibilidade,
    mas agora ele salva o total em ml.
  */

  const today = getTodayKey();

  if (!waterData.logs) {
    waterData.logs = {};
  }

  waterData.logs[today] = Math.max(0, Number(value) || 0);

  saveWaterData();
}


// =====================================================
// 12. RENDERIZAÇÃO
// =====================================================

function renderWaterPage() {
  /*
    Agora getTodayCups() retorna o total de água em ml.
    Mantemos o nome da função por compatibilidade com o resto do código.
  */

  const todayMl = getTodayCups();
  const goalMl = Number(waterData.goal || 2000);

  const percent = goalMl === 0
    ? 0
    : Math.min(100, Math.round((todayMl / goalMl) * 100));

  const remainingMl = Math.max(0, goalMl - todayMl);

  if (todayCups) {
    todayCups.textContent = `${todayMl}ml`;
  }

  if (waterProgress) {
    waterProgress.textContent = `${percent}%`;
  }

  if (remainingCups) {
    remainingCups.textContent = `${remainingMl}ml`;
  }

  if (sidebarWaterPercent) {
    sidebarWaterPercent.textContent = `${percent}%`;
  }

  if (sidebarWaterBar) {
    sidebarWaterBar.style.width = `${percent}%`;
  }

  if (sidebarWaterText) {
    sidebarWaterText.textContent = `${todayMl}ml de ${goalMl}ml registrados hoje.`;
  }

  if (waterCircleText) {
    waterCircleText.textContent = `${percent}%`;
  }

  if (waterCircleSubtext) {
    waterCircleSubtext.textContent = `${todayMl}ml de ${goalMl}ml`;
  }

  if (waterCircle) {
    waterCircle.style.setProperty("--water-percent", `${percent}%`);
  }

  if (goalText) {
    goalText.textContent = `Sua meta atual é de ${goalMl}ml por dia.`;
  }

  renderCups();
  renderWeekGrid();
  renderMiniTimeline();
  updateWeeklyAverage();
}


// =====================================================
// 13. RENDERIZAR COPOS
// =====================================================
function renderCups() {
  if (!cupsArea) {
    return;
  }

  /*
    Agora a água é registrada em ml.
    Para não criar 2000 elementos na tela, mostramos 10 blocos visuais.
    Cada bloco representa uma parte da meta diária.
  */

  const todayMl = getTodayCups();
  const goalMl = Number(waterData.goal || 2000);

  const totalBlocks = 10;
  const mlPerBlock = goalMl / totalBlocks;

  cupsArea.innerHTML = "";

  for (let index = 1; index <= totalBlocks; index++) {
    const blockLimit = Math.round(index * mlPerBlock);
    const isFilled = todayMl >= blockLimit;

    const waterBlock = document.createElement("button");

    waterBlock.type = "button";
    waterBlock.className = `cup-item ${isFilled ? "filled" : ""}`;
    waterBlock.textContent = isFilled ? "♢" : "◇";
    waterBlock.title = `${blockLimit}ml`;

    /*
      Ao clicar em um bloco, o sistema ajusta o total de água
      para o valor correspondente daquele ponto da meta.
      Exemplo:
      bloco 5 em meta de 2000ml = 1000ml.
    */
    waterBlock.addEventListener("click", () => {
      setTodayCups(blockLimit);

      createWaterTimelineEvent(
        "Água ajustada",
        `Total de água ajustado para ${blockLimit}ml hoje.`
      );

      renderWaterPage();
    });

    cupsArea.appendChild(waterBlock);
  }
}


// =====================================================
// 14. SEMANA
// =====================================================

function renderWeekGrid() {
  const weekKeys = getCurrentWeekKeys();

  weekKeys.forEach((dateKey, index) => {
    const dayElement = document.getElementById(`day${index}`);

    if (!dayElement) {
      return;
    }

    const cups = Number(waterData.logs[dateKey] || 0);

    if (cups > 0) {
      dayElement.textContent = cups >= waterData.goal ? "✓" : cups;
      dayElement.classList.add("done");
    } else {
      dayElement.textContent = "○";
      dayElement.classList.remove("done");
    }
  });

  const completedDays = weekKeys.filter((dateKey) => {
    return Number(waterData.logs[dateKey] || 0) >= Number(waterData.goal || 2000);
  }).length;

  if (weekText) {
    weekText.textContent = `${completedDays} dia${completedDays === 1 ? "" : "s"} com meta alcançada nesta semana.`;
  }
}

function updateWeeklyAverage() {
  const weekKeys = getCurrentWeekKeys();

  const totalMl = weekKeys.reduce((sum, dateKey) => {
    return sum + Number(waterData.logs[dateKey] || 0);
  }, 0);

  const averageMl = Math.round(totalMl / 7);

  if (weeklyAverage) {
    weeklyAverage.textContent = `${averageMl}ml`;
  }
}


// =====================================================
// 15. MINI TIMELINE
// =====================================================

function renderMiniTimeline() {
  if (!waterMiniTimeline) {
    return;
  }

  const entries = Object.entries(waterData.logs)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    .slice(0, 3);

  waterMiniTimeline.innerHTML = "";

  if (entries.length === 0) {
    waterMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>Nenhum registro ainda</strong>
          Adicione seu primeiro copo.
        </p>
      </div>
    `;
    return;
  }

  entries.forEach(([date, cups]) => {
    const item = document.createElement("div");

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${date}</time>
      <p>
        <strong>Água registrada</strong>
        ${cups} copo${Number(cups) === 1 ? "" : "s"} no dia.
      </p>
    `;

    waterMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 16. AÇÕES PRINCIPAIS
// =====================================================
// =====================================================
// ADICIONAR ÁGUA EM ML
// Nova função para trabalhar com ml
// =====================================================

function addWaterAmount(amount) {
  const todayKey = getTodayKey();

  if (!waterData.logs) {
    waterData.logs = {};
  }

  /*
    Agora cada dia guarda o total em ml.
    Exemplo:
    waterData.logs["2026-05-20"] = 750
  */
  const currentAmount = Number(waterData.logs[todayKey]) || 0;

  waterData.logs[todayKey] = currentAmount + amount;

  saveWaterData();
  renderWater();

  createWaterTimelineEvent(
    "Água registrada",
    `${amount}ml adicionados · total de ${waterData.logs[todayKey]}ml hoje`
  );
}

function addCup() {
  /*
    Mantemos o nome addCup por compatibilidade,
    mas agora o botão adiciona 250ml em vez de 1 copo.
  */
  addWaterAmount(250);
}

// =====================================================
// ADICIONAR ÁGUA EM ML
// Agora cada registro diário guarda o total em mililitros.
// =====================================================

function addWaterAmount(amount) {
  const todayKey = getTodayKey();

  if (!waterData.logs) {
    waterData.logs = {};
  }

  const currentAmount = Number(waterData.logs[todayKey]) || 0;
  const newAmount = currentAmount + amount;

  waterData.logs[todayKey] = newAmount;

  saveWaterData();

  createWaterTimelineEvent(
    "Água registrada",
    `${amount}ml adicionados · total de ${newAmount}ml hoje.`
  );

  renderWaterPage();
}

function removeCup() {
  /*
    Mantemos o nome removeCup por compatibilidade,
    mas agora remove 250ml em vez de 1 copo.
  */

  const todayKey = getTodayKey();

  if (!waterData.logs) {
    waterData.logs = {};
  }

  const currentAmount = Number(waterData.logs[todayKey]) || 0;

  if (currentAmount <= 0) {
    return;
  }

  const newAmount = Math.max(currentAmount - 250, 0);

  waterData.logs[todayKey] = newAmount;

  saveWaterData();

  createWaterTimelineEvent(
    "Água removida",
    `250ml removidos · total de ${newAmount}ml hoje.`
  );

  renderWaterPage();
}

function resetTodayWater() {
  setTodayCups(0);

  createWaterTimelineEvent(
    "Água reiniciada",
    "A água de hoje foi reiniciada."
  );

  renderWaterPage();
}


// =====================================================
// 17. MODAL — MENSAGENS
// =====================================================

function showWaterFormMessage(message, type = "error") {
  if (!waterFormMessage) {
    return;
  }

  waterFormMessage.textContent = message;
  waterFormMessage.className = `water-form-message show ${type}`;
}

function clearWaterFormMessage() {
  if (!waterFormMessage) {
    return;
  }

  waterFormMessage.textContent = "";
  waterFormMessage.className = "water-form-message";
}

function clearWaterInvalidFields() {
  document.querySelectorAll(".water-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 18. MODAL — ABRIR / FECHAR
// =====================================================

function openWaterModal() {
  if (!waterGoalModal) {
    return;
  }

  clearWaterFormMessage();
  clearWaterInvalidFields();

  if (waterGoalInput) {
    waterGoalInput.value = waterData.goal;
  }

  waterGoalModal.classList.add("active");

  setTimeout(() => {
    if (waterGoalInput) {
      waterGoalInput.focus();
    }
  }, 100);
}

function closeWaterModal() {
  if (!waterGoalModal) {
    return;
  }

  waterGoalModal.classList.remove("active");
}


// =====================================================
// 19. SALVAR META
// =====================================================

function saveWaterGoal() {
  clearWaterFormMessage();
  clearWaterInvalidFields();

  const goal = Number(waterGoalInput?.value);

  /*
    Agora a meta é em ml.
    Limite mínimo: 300ml
    Limite máximo: 6000ml
  */
  if (!goal || goal < 300 || goal > 6000) {
    if (waterGoalInput) {
      waterGoalInput.classList.add("invalid");
      waterGoalInput.focus();
    }

    showWaterFormMessage("Informe uma meta entre 300ml e 6000ml.");
    return;
  }

  waterData.goal = goal;
  saveWaterData();

  createWaterTimelineEvent(
    "Meta de água alterada",
    `Nova meta diária: ${goal}ml.`
  );

  renderWaterPage();

  showWaterFormMessage("Meta salva com sucesso.", "success");

  setTimeout(() => {
    closeWaterModal();
    clearWaterFormMessage();
  }, 450);
}


// =====================================================
// 20. EVENTOS
// =====================================================
function setupWaterEvents() {
  /*
    Botão antigo principal.
    Agora ele soma a quantidade definida no data-water-amount.
    Se não tiver valor, usa 250ml como padrão.
  */
  if (addCupBtn) {
    addCupBtn.addEventListener("click", () => {
      const amount = Number(addCupBtn.dataset.waterAmount) || 250;
      addWaterAmount(amount);
    });
  }

  /*
    Botão principal antigo da tela, caso exista.
    Mantemos para não quebrar o layout atual.
  */
  if (addCupMainBtn) {
    addCupMainBtn.addEventListener("click", () => {
      addWaterAmount(250);
    });
  }

  /*
    Botões rápidos novos:
    +200ml
    +300ml
    +500ml
  */
  waterQuickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const amount = Number(button.dataset.waterAmount) || 250;
      addWaterAmount(amount);
    });
  });

  /*
    Por enquanto o botão de remover pode continuar usando a lógica antiga.
    Depois vamos mudar para remover 250ml em vez de remover 1 copo.
  */
  if (removeCupBtn) {
    removeCupBtn.addEventListener("click", removeCup);
  }

  if (resetWaterBtn) {
    resetWaterBtn.addEventListener("click", resetTodayWater);
  }

  if (openGoalModalBtn) {
    openGoalModalBtn.addEventListener("click", openWaterModal);
  }

  if (openGoalModalSideBtn) {
    openGoalModalSideBtn.addEventListener("click", openWaterModal);
  }

  if (closeWaterModalBtn) {
    closeWaterModalBtn.addEventListener("click", closeWaterModal);
  }

  if (saveWaterGoalBtn) {
    saveWaterGoalBtn.addEventListener("click", saveWaterGoal);
  }

  if (waterGoalInput) {
    waterGoalInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveWaterGoal();
      }
    });
  }

  if (waterGoalModal) {
    waterGoalModal.addEventListener("click", (event) => {
      if (event.target === waterGoalModal) {
        closeWaterModal();
      }
    });
  }
}

// =====================================================
// 21. INICIALIZAÇÃO
// =====================================================

function initWaterPage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadWaterData();
  setupWaterEvents();
  renderWaterPage();
}

initWaterPage();