/* ===================================================== */
/* FLUIR — CONFIGURAÇÕES */
/* JS PURO, COMENTADO E ORGANIZADO */
/* Controla tema, abas, perfil e dados locais */
/* ===================================================== */


/* ===================================================== */
/* 1. INICIALIZAÇÃO */
/* Quando a página carregar, chamamos todas as funções */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  loadUserProfile();
  hideDisabledModules();

  setupSecretThemeUnlock();
  setupThemeOptions();
  setupFontOptions();
  setupDensityOptions();
  setupTabs();
  setupResetPanel();
  setupResetButtons();
  setupPreferenceSaves();
  setupQuickSetupEditor();
});


/* ===================================================== */
/* 2. FUNÇÃO AUXILIAR PARA LER JSON DO LOCALSTORAGE */
/* Evita erro caso algum dado esteja vazio ou corrompido */
/* ===================================================== */

function getStorageJSON(key, fallback = {}) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    console.warn(`Erro ao ler ${key}:`, error);
    return fallback;
  }
}


/* ===================================================== */
/* 3. TEMAS */
/* Claro e escuro continuam públicos. Os cafés são secretos. */
/* ===================================================== */

const SECRET_THEME_STORAGE_KEY = "fluir-unlocked-themes";

const SECRET_THEME_CODES = {
  "FLUIR-LATTE": {
    theme: "cafe-light",
    name: "Café com Leite"
  },
  "FLUIR-ESPRESSO": {
    theme: "cafe-dark",
    name: "Café Espresso"
  }
};

function getUnlockedThemes() {
  const savedThemes = getStorageJSON(SECRET_THEME_STORAGE_KEY, []);

  return Array.isArray(savedThemes) ? savedThemes : [];
}

function saveUnlockedThemes(themes) {
  localStorage.setItem(
    SECRET_THEME_STORAGE_KEY,
    JSON.stringify([...new Set(themes)])
  );
}

function isThemeAvailable(theme) {
  if (theme === "light" || theme === "dark") {
    return true;
  }

  return getUnlockedThemes().includes(theme);
}

function applyTheme(theme) {
  const safeTheme = isThemeAvailable(theme) ? theme : "light";

  document.body.classList.remove(
    "dark",
    "theme-cafe-light",
    "theme-cafe-dark"
  );

  if (safeTheme === "dark" || safeTheme === "cafe-dark") {
    document.body.classList.add("dark");
  }

  if (safeTheme === "cafe-light") {
    document.body.classList.add("theme-cafe-light");
  }

  if (safeTheme === "cafe-dark") {
    document.body.classList.add("theme-cafe-dark");
  }

  if (safeTheme !== theme) {
    localStorage.setItem("fluir-theme", safeTheme);
  }

  return safeTheme;
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("fluir-theme") || "light";
  const activeTheme = applyTheme(savedTheme);

  refreshSecretThemeOptions();
  updateThemeButtons(activeTheme);
  updateThemeStatusIcon(activeTheme);
}

function setupThemeOptions() {
  const themeButtons = document.querySelectorAll(".theme-option");

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTheme = button.dataset.theme;

      if (!isThemeAvailable(selectedTheme)) {
        return;
      }

      localStorage.setItem("fluir-theme", selectedTheme);

      const activeTheme = applyTheme(selectedTheme);

      updateThemeButtons(activeTheme);
      updateThemeStatusIcon(activeTheme);
    });
  });
}

function refreshSecretThemeOptions() {
  const unlockedThemes = new Set(getUnlockedThemes());

  document.querySelectorAll("[data-secret-theme='true']").forEach((button) => {
    button.hidden = !unlockedThemes.has(button.dataset.theme);
  });
}

function setupSecretThemeUnlock() {
  const codeInput = document.getElementById("secretThemeCode");
  const unlockButton = document.getElementById("unlockSecretThemeBtn");
  const message = document.getElementById("secretThemeMessage");

  if (!codeInput || !unlockButton || !message) {
    return;
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.classList.remove("success", "error");
    message.classList.add(type);
  }

  function unlockTheme() {
    const normalizedCode = codeInput.value.trim().toUpperCase();
    const reward = SECRET_THEME_CODES[normalizedCode];

    if (!reward) {
      showMessage("Código não reconhecido. Confira e tente novamente.", "error");
      return;
    }

    const unlockedThemes = getUnlockedThemes();

    if (unlockedThemes.includes(reward.theme)) {
      showMessage(`${reward.name} já está desbloqueado em Aparência.`, "success");
      codeInput.value = "";
      refreshSecretThemeOptions();
      return;
    }

    unlockedThemes.push(reward.theme);
    saveUnlockedThemes(unlockedThemes);
    refreshSecretThemeOptions();

    showMessage(
      `Tema desbloqueado: ${reward.name}. Ele já está disponível em Aparência.`,
      "success"
    );

    codeInput.value = "";
  }

  unlockButton.addEventListener("click", unlockTheme);

  codeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      unlockTheme();
    }
  });

  refreshSecretThemeOptions();
}

function updateThemeButtons(activeTheme) {
  const themeButtons = document.querySelectorAll(".theme-option");

  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === activeTheme);
  });
}

function updateThemeStatusIcon(activeTheme) {
  const themeStatusBtn = document.getElementById("themeStatusBtn");

  if (!themeStatusBtn) return;

  const themeLabels = {
    light: "Tema claro ativo",
    dark: "Tema escuro ativo",
    "cafe-light": "Café com Leite ativo",
    "cafe-dark": "Café Espresso ativo"
  };

  const darkTheme = activeTheme === "dark" || activeTheme === "cafe-dark";

  themeStatusBtn.textContent = darkTheme ? "☾" : "☼";
  themeStatusBtn.title = themeLabels[activeTheme] || "Tema ativo";
}


/* ===================================================== */
/* 4. CARREGAR DADOS DO USUÁRIO */
/* Busca informações salvas pelo setup inicial */
/* ===================================================== */

function loadUserProfile() {
  const setupData = getStorageJSON("fluir-setup", {});

  /*
    O setup do Fluir salva os dados principais dentro de setupData.user.
    Mantemos fallbacks fora de user para continuar compatível com versões antigas.
  */
  const userData = setupData.user || {};

  const name =
    userData.nickname ||
    userData.name ||
    setupData.nickname ||
    setupData.name ||
    setupData.fullName ||
    "Usuário";

  const email =
    userData.email ||
    setupData.email ||
    "usuario@email.com";

  const firstLetter = name.trim().charAt(0).toUpperCase() || "F";

  const topGreeting = document.getElementById("topGreeting");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileAvatar = document.getElementById("profileAvatar");

  if (topGreeting) {
    topGreeting.textContent = `Olá, ${name}`;
  }

  if (profileName) {
    profileName.textContent = name;
  }

  if (profileEmail) {
    profileEmail.textContent = email;
  }

  if (profileAvatar) {
    profileAvatar.textContent = firstLetter;
  }
}


/* ===================================================== */
/* 5. ESCONDER MÓDULOS DESATIVADOS NO SETUP */
/* Mantém o menu respeitando as escolhas do usuário */
/* ===================================================== */
function hideDisabledModules() {
  const setupData = getStorageJSON("fluir-setup", {});
  const moduleLinks = document.querySelectorAll(".module-link");

  /*
    O setup pode salvar módulos em dois formatos:
    1. Objeto: modules: { tasks: true, habits: false }
    2. Array: modules: ["tasks", "habits"]

    Esta função aceita os dois formatos.
  */
  const savedModules =
    setupData.modules ||
    setupData.activeModules ||
    null;

  if (!savedModules) {
    return;
  }

  let activeModules = [];

  if (Array.isArray(savedModules)) {
    activeModules = savedModules;
  } else {
    activeModules = Object.keys(savedModules).filter((moduleName) => {
      return savedModules[moduleName] === true;
    });
  }

  if (activeModules.length === 0) {
    return;
  }

  moduleLinks.forEach((link) => {
    const moduleName = link.dataset.module;

    if (!activeModules.includes(moduleName)) {
      link.style.display = "none";
    }
  });
}

/* ===================================================== */
/* 6. ABAS DE CONFIGURAÇÕES */
/* Ao clicar numa aba, ela destaca o card correspondente */
/* ===================================================== */

function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const cards = document.querySelectorAll(".settings-card");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTab = button.dataset.tab;

      tabButtons.forEach((tab) => {
        tab.classList.toggle("active", tab === button);
      });

      cards.forEach((card) => {
        const cardName = card.dataset.card;
        const isSelectedCard = cardName === selectedTab;

        card.classList.toggle("is-focused", isSelectedCard);
        card.classList.toggle("is-muted", !isSelectedCard);
      });

      /*
        Faz a tela levar o usuário até a seção selecionada,
        mas sem jogar a página inteira para o topo.
      */
      const selectedCard = document.querySelector(`[data-card="${selectedTab}"]`);

      if (selectedCard) {
        selectedCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    });
  });
}


/* ===================================================== */
/* 7. TAMANHO DA FONTE */
/* Salva preferência visual para uso futuro */
/* ===================================================== */

function setupFontOptions() {
  const savedFontSize = localStorage.getItem("fluir-font-size") || "medium";
  const fontButtons = document.querySelectorAll(".font-option");

  updateButtonGroup(fontButtons, savedFontSize, "font");

  fontButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFontSize = button.dataset.font;

      localStorage.setItem("fluir-font-size", selectedFontSize);
      updateButtonGroup(fontButtons, selectedFontSize, "font");

      document.body.dataset.fontSize = selectedFontSize;
    });
  });

  document.body.dataset.fontSize = savedFontSize;
}


/* ===================================================== */
/* 8. DENSIDADE DO LAYOUT */
/* Salva opção compacta ou confortável para uso futuro */
/* ===================================================== */

function setupDensityOptions() {
  const savedDensity = localStorage.getItem("fluir-layout-density") || "comfortable";
  const densityButtons = document.querySelectorAll(".density-option");

  updateButtonGroup(densityButtons, savedDensity, "density");

  densityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedDensity = button.dataset.density;

      localStorage.setItem("fluir-layout-density", selectedDensity);
      updateButtonGroup(densityButtons, selectedDensity, "density");

      document.body.dataset.layoutDensity = selectedDensity;
    });
  });

  document.body.dataset.layoutDensity = savedDensity;
}


/* ===================================================== */
/* 9. FUNÇÃO AUXILIAR PARA BOTÕES SEGMENTADOS */
/* Serve para fonte, densidade e outras opções parecidas */
/* ===================================================== */

function updateButtonGroup(buttons, activeValue, dataName) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset[dataName] === activeValue);
  });
}


/* ===================================================== */
/* 10. PAINEL DE RESET */
/* Abre e fecha a área de limpar dados locais */
/* ===================================================== */

function setupResetPanel() {
  const openResetArea = document.getElementById("openResetArea");
  const closeResetArea = document.getElementById("closeResetArea");
  const resetPanel = document.getElementById("resetPanel");

  if (!resetPanel) return;

  if (openResetArea) {
    openResetArea.addEventListener("click", () => {
      resetPanel.classList.add("show");

      resetPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    });
  }

  if (closeResetArea) {
    closeResetArea.addEventListener("click", () => {
      resetPanel.classList.remove("show");
    });
  }
}


/* ===================================================== */
/* 11. RESETAR DADOS ESPECÍFICOS */
/* Remove apenas a chave escolhida do localStorage */
/* ===================================================== */

function setupResetButtons() {
  const resetButtons = document.querySelectorAll("[data-reset]");

  resetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const storageKey = button.dataset.reset;

      const confirmed = confirm(
        "Tem certeza que deseja apagar estes dados? Essa ação não pode ser desfeita."
      );

      if (!confirmed) return;

      localStorage.removeItem(storageKey);

      alert("Dados apagados com sucesso.");
    });
  });
}


/* ===================================================== */
/* 12. SALVAR PREFERÊNCIAS SIMPLES */
/* Notificações, privacidade, idioma e horário do resumo */
/* ===================================================== */

function setupPreferenceSaves() {
  setupSelectSave("languageSelect", "fluir-language");
  setupSelectSave("summaryTime", "fluir-summary-time");

  setupCheckboxSaves();
}


function setupSelectSave(selectId, storageKey) {
  const select = document.getElementById(selectId);

  if (!select) return;

  const savedValue = localStorage.getItem(storageKey);

  if (savedValue) {
    select.value = savedValue;
  }

  select.addEventListener("change", () => {
    localStorage.setItem(storageKey, select.value);
  });
}

function setupCheckboxSaves() {
  const checkboxes = document.querySelectorAll('.toggle-row input[type="checkbox"]');

  checkboxes.forEach((checkbox, index) => {
    const storageKey = `fluir-setting-toggle-${index}`;
    const savedValue = localStorage.getItem(storageKey);

    if (savedValue !== null) {
      checkbox.checked = savedValue === "true";
    }

    checkbox.addEventListener("change", () => {
      localStorage.setItem(storageKey, String(checkbox.checked));
    });
  });
}

/* ===================================================== */
/* CONFIGURAÇÃO RÁPIDA */
/* Permite editar partes do setup sem voltar ao onboarding */
/* ===================================================== */

function setupQuickSetupEditor() {
  const nameInput = document.getElementById("quickNameInput");
  const waterGoalInput = document.getElementById("quickWaterGoalInput");
  const modulesList = document.getElementById("quickModulesList");
  const saveButton = document.getElementById("saveQuickSetupBtn");
  const message = document.getElementById("quickSetupMessage");

  if (!nameInput || !waterGoalInput || !modulesList || !saveButton) {
    return;
  }

  if (!window.FluirSections) {
    console.error("Catálogo de áreas do Fluir não foi carregado.");
    return;
  }

  window.FluirSections.getModules().forEach((module) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.dataset.quickModule = module.key;

    label.append(
      checkbox,
      document.createTextNode(module.label)
    );

    modulesList.appendChild(label);
  });

  const moduleCheckboxes = modulesList.querySelectorAll(
    "[data-quick-module]"
  );

  const setupData = getStorageJSON("fluir-setup", {
    user: {},
    modules: {},
    preferences: {}
  });

  const userData = setupData.user || {};
  const modulesData = setupData.modules || {};
  const preferencesData = setupData.preferences || {};
  const waterData = preferencesData.water || {};

  nameInput.value = userData.nickname || userData.name || "";
  waterGoalInput.value = waterData.dailyGoal || waterData.metaFinalMl || "";

  moduleCheckboxes.forEach((checkbox) => {
    const moduleName = checkbox.dataset.quickModule;
    checkbox.checked = modulesData[moduleName] === true;
  });

  saveButton.addEventListener("click", () => {
    const currentSetup = getStorageJSON("fluir-setup", {
      user: {},
      modules: {},
      preferences: {}
    });

    currentSetup.user = currentSetup.user || {};
    currentSetup.modules = currentSetup.modules || {};
    currentSetup.preferences = currentSetup.preferences || {};
    currentSetup.preferences.water = currentSetup.preferences.water || {};

    const newName = nameInput.value.trim();
    const newWaterGoal = Number(waterGoalInput.value);

    if (newName) {
      currentSetup.user.name = newName;
      currentSetup.user.nickname = newName;
    }

    if (newWaterGoal > 0) {
      currentSetup.preferences.water.dailyGoal = newWaterGoal;
      currentSetup.preferences.water.metaFinalMl = newWaterGoal;
    }

    moduleCheckboxes.forEach((checkbox) => {
      const moduleName = checkbox.dataset.quickModule;
      currentSetup.modules[moduleName] = checkbox.checked;
    });

    currentSetup.modules.timeline = true;
    currentSetup.onboardingConcluido = true;
    currentSetup.atualizadoEm = new Date().toISOString();

    localStorage.setItem("fluir-setup", JSON.stringify(currentSetup));

    if (message) {
      message.textContent = "Configurações salvas com sucesso.";
      message.classList.add("success");
    }

    loadUserProfile();
    hideDisabledModules();
  });
}