// =====================================================
// FLUIR — PLANOS E PREÇOS
// JavaScript puro para controlar planos, acesso e modal
// Preparado para futura integração com backend
// =====================================================


// =====================================================
// 1. ELEMENTOS PRINCIPAIS
// =====================================================

const body = document.body;

const welcomeTitle = document.getElementById("welcomeTitle");
const avatarBtn = document.getElementById("avatarBtn");
const currentPlanName = document.getElementById("currentPlanName");

const moduleLinks = document.querySelectorAll(".module-link");

const billingButtons = document.querySelectorAll(".billing-btn");
const priceValues = document.querySelectorAll(".price-area strong");
const pricePeriods = document.querySelectorAll(".price-period");
const planButtons = document.querySelectorAll(".plan-button[data-plan]");
const planCards = document.querySelectorAll("[data-plan-card]");

const planModal = document.getElementById("planModal");
const closePlanModal = document.getElementById("closePlanModal");
const cancelPlanModal = document.getElementById("cancelPlanModal");
const confirmPlanModal = document.getElementById("confirmPlanModal");

const modalSymbol = document.getElementById("modalSymbol");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalAccessTitle = document.getElementById("modalAccessTitle");
const modalAccessList = document.getElementById("modalAccessList");


// =====================================================
// 2. CONFIGURAÇÃO DOS PLANOS
// Esta parte já deixa pronto para backend.
// Futuramente o backend pode devolver uma estrutura parecida.
// =====================================================

const PLAN_CONFIG = {
  Gratuito: {
    id: "free",
    name: "Gratuito",
    symbol: "◌",
    level: 1,
    accessTitle: "Acesso básico liberado",
    description: "Você continuará com os recursos essenciais do Fluir.",
    features: [
      "Dashboard básico",
      "Timeline local",
      "Tarefas",
      "Hábitos",
      "Sono",
      "Água"
    ],
    permissions: {
      dashboard: true,
      timeline: true,
      tasks: true,
      habits: true,
      sleep: true,
      water: true,
      finances: false,
      diary: false,
      nutrition: false,
      physicalHealth: false,
      menstrualCycle: false,
      attachments: false,
      achievements: false,
      advancedReports: false,
      aiInsights: false
    }
  },

  Pessoal: {
    id: "personal",
    name: "Pessoal",
    symbol: "♡",
    level: 2,
    accessTitle: "Acesso ampliado liberado",
    description: "Você terá mais módulos, metas, conquistas e personalização.",
    features: [
      "Tudo do plano Gratuito",
      "Finanças básicas",
      "Diário emocional completo",
      "Alimentação básica",
      "Saúde física",
      "Ciclo menstrual",
      "Conquistas e metas",
      "Relatórios simples"
    ],
    permissions: {
      dashboard: true,
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
      attachments: true,
      achievements: true,
      advancedReports: false,
      aiInsights: false
    }
  },

  Completo: {
    id: "complete",
    name: "Completo",
    symbol: "♕",
    level: 3,
    accessTitle: "Acesso total liberado",
    description: "Você terá acesso total aos módulos avançados e recursos futuros.",
    features: [
      "Tudo do plano Pessoal",
      "Finanças completas",
      "Contas, cartões, dívidas e orçamentos",
      "Relatórios avançados",
      "Diário estilo Daylio",
      "Alimentação com calorias",
      "Saúde mental e física avançada",
      "Backup futuro na nuvem",
      "Insights futuros com IA"
    ],
    permissions: {
      dashboard: true,
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
      attachments: true,
      achievements: true,
      advancedReports: true,
      aiInsights: true
    }
  }
};

let selectedPlanToConfirm = null;


// =====================================================
// 3. FUNÇÕES DE LOCALSTORAGE
// =====================================================

function getStorageJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    console.warn(`Erro ao ler ${key}:`, error);
    return fallback;
  }
}

function saveStorageJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


// =====================================================
// 4. TEMA
// Nesta tela o tema apenas é aplicado.
// A troca principal fica em Configurações ou Perfil.
// =====================================================

function applySavedTheme() {
  const savedTheme = localStorage.getItem("fluir-theme") || "light";

  if (savedTheme === "dark") {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }
}


// =====================================================
// 5. DADOS DO USUÁRIO
// =====================================================

function getSetupData() {
  return getStorageJSON("fluir-setup", {
    user: {
      name: "Usuário",
      nickname: "Usuário"
    },
    modules: {}
  });
}

function getDisplayName() {
  const setupData = getSetupData();
  const user = setupData.user || {};

  return user.nickname || user.name || "Usuário";
}

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase() || "F";
}

function updateUserArea() {
  const name = getDisplayName();

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${name}`;
  }

  if (avatarBtn) {
    avatarBtn.textContent = getInitial(name);
  }
}


// =====================================================
// 6. ESCONDER MÓDULOS DESATIVADOS PELO SETUP
// Isso respeita a configuração inicial do usuário.
// Plano é uma camada separada de permissão.
// =====================================================

function hideDisabledModules() {
  const setupData = getSetupData();
  const savedModules = setupData.modules;

  if (!savedModules) return;

  const activeModules = Object.keys(savedModules).filter((moduleName) => {
    return savedModules[moduleName] === true;
  });

  if (!activeModules.length) return;

  moduleLinks.forEach((link) => {
    const moduleName = link.dataset.module;

    if (!activeModules.includes(moduleName)) {
      link.style.display = "none";
    }
  });
}


// =====================================================
// 7. PLANO ATUAL E PERMISSÕES
// Por enquanto salva localmente.
// Depois, o backend pode substituir essas funções.
// =====================================================

function getCurrentPlan() {
  return localStorage.getItem("fluir-current-plan") || "Gratuito";
}

function getCurrentPlanConfig() {
  const currentPlan = getCurrentPlan();

  return PLAN_CONFIG[currentPlan] || PLAN_CONFIG.Gratuito;
}

function saveCurrentPlan(planName) {
  const plan = PLAN_CONFIG[planName];

  if (!plan) return;

  /*
    Estrutura pronta para backend futuramente:
    - fluir-current-plan: nome visual
    - fluir-plan-access: permissões do plano
    - fluir-plan-status: status de assinatura
  */
  localStorage.setItem("fluir-current-plan", plan.name);
  saveStorageJSON("fluir-plan-access", plan.permissions);

  saveStorageJSON("fluir-plan-status", {
    planId: plan.id,
    planName: plan.name,
    level: plan.level,
    status: "local-preview",
    updatedAt: new Date().toISOString()
  });
}

function updateCurrentPlanUI() {
  const currentPlan = getCurrentPlan();

  if (currentPlanName) {
    currentPlanName.textContent = currentPlan;
  }

  planCards.forEach((card) => {
    const cardPlan = card.dataset.planCard;

    card.classList.toggle("active-plan", cardPlan === currentPlan);
  });

  planButtons.forEach((button) => {
    const planName = button.dataset.plan;

    if (planName === currentPlan) {
      button.textContent = "Plano atual";
      button.classList.add("current-plan");
    } else {
      button.textContent = "Escolher plano";
      button.classList.remove("current-plan");
    }
  });
}


// =====================================================
// 8. ALTERNAR MENSAL / ANUAL
// =====================================================

function setupBillingToggle() {
  billingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedBilling = button.dataset.billing;

      billingButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      updatePrices(selectedBilling);
    });
  });
}

function updatePrices(type) {
  priceValues.forEach((price) => {
    if (type === "yearly") {
      price.textContent = price.dataset.yearly;
    } else {
      price.textContent = price.dataset.monthly;
    }
  });

  pricePeriods.forEach((period) => {
    period.textContent = type === "yearly" ? "/ano" : "/mês";
  });
}


// =====================================================
// 9. MODAL BONITO DE PLANO
// =====================================================

function openPlanModal(planName) {
  const plan = PLAN_CONFIG[planName];

  if (!plan || !planModal) return;

  selectedPlanToConfirm = planName;

  if (modalSymbol) {
    modalSymbol.textContent = plan.symbol;
  }

  if (modalTitle) {
    modalTitle.textContent = `Selecionar plano ${plan.name}`;
  }

  if (modalText) {
    modalText.textContent = plan.description;
  }

  if (modalAccessTitle) {
    modalAccessTitle.textContent = plan.accessTitle;
  }

  if (modalAccessList) {
    modalAccessList.innerHTML = plan.features
      .map((feature) => `<li>${escapeHTML(feature)}</li>`)
      .join("");
  }

  planModal.classList.add("show");
}

function closeModal() {
  if (!planModal) return;

  planModal.classList.remove("show");
  selectedPlanToConfirm = null;
}

function confirmSelectedPlan() {
  if (!selectedPlanToConfirm) return;

  saveCurrentPlan(selectedPlanToConfirm);
  updateCurrentPlanUI();
  closeModal();

  showTemporaryFeedback(`Plano ${selectedPlanToConfirm} ativado localmente.`);
}

function setupPlanModalEvents() {
  if (closePlanModal) {
    closePlanModal.addEventListener("click", closeModal);
  }

  if (cancelPlanModal) {
    cancelPlanModal.addEventListener("click", closeModal);
  }

  if (confirmPlanModal) {
    confirmPlanModal.addEventListener("click", confirmSelectedPlan);
  }

  if (planModal) {
    planModal.addEventListener("click", (event) => {
      if (event.target === planModal) {
        closeModal();
      }
    });
  }
}


// =====================================================
// 10. ESCOLHER PLANO
// =====================================================

function setupPlanButtons() {
  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedPlan = button.dataset.plan;

      if (!selectedPlan) return;

      const currentPlan = getCurrentPlan();

      if (selectedPlan === currentPlan) {
        openPlanModal(selectedPlan);
        return;
      }

      openPlanModal(selectedPlan);
    });
  });
}


// =====================================================
// 11. FEEDBACK VISUAL SIMPLES
// Pequena mensagem temporária sem usar alert.
// =====================================================

function showTemporaryFeedback(message) {
  const feedback = document.createElement("div");

  feedback.className = "floating-feedback";
  feedback.textContent = message;

  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.classList.add("show");
  }, 10);

  setTimeout(() => {
    feedback.classList.remove("show");

    setTimeout(() => {
      feedback.remove();
    }, 250);
  }, 2600);
}


// =====================================================
// 12. FUNÇÃO DE ESCAPE PARA SEGURANÇA
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
// 13. PONTO FUTURO PARA BACKEND
// Quando o backend estiver pronto, trocar localStorage por fetch.
// =====================================================

async function syncPlanWithBackend(planName) {
  /*
    FUTURO EXEMPLO:

    await fetch("http://localhost:8080/users/{userId}/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer TOKEN_DO_USUARIO"
      },
      body: JSON.stringify({
        plan: planName
      })
    });

    Depois disso, o backend retornaria:
    - plano ativo
    - status da assinatura
    - permissões liberadas
    - data de renovação
  */

  return planName;
}


// =====================================================
// 14. INICIALIZAÇÃO
// =====================================================

applySavedTheme();
updateUserArea();
hideDisabledModules();
setupBillingToggle();
setupPlanButtons();
setupPlanModalEvents();
updateCurrentPlanUI();