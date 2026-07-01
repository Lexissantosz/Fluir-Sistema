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

  setupThemeOptions();
  setupFontOptions();
  setupDensityOptions();
  setupTabs();
  setupResetPanel();
  setupResetButtons();
  setupPreferenceSaves();
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
/* 3. TEMA CLARO / ESCURO */
/* O tema continua salvo em fluir-theme */
/* ===================================================== */

function applySavedTheme() {
  const savedTheme = localStorage.getItem("fluir-theme") || "light";

  document.body.classList.toggle("dark", savedTheme === "dark");

  updateThemeButtons(savedTheme);
  updateThemeStatusIcon(savedTheme);
}

function setupThemeOptions() {
  const themeButtons = document.querySelectorAll(".theme-option");

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTheme = button.dataset.theme;

      localStorage.setItem("fluir-theme", selectedTheme);

      document.body.classList.toggle("dark", selectedTheme === "dark");

      updateThemeButtons(selectedTheme);
      updateThemeStatusIcon(selectedTheme);
    });
  });
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

  themeStatusBtn.textContent = activeTheme === "dark" ? "☾" : "☼";
  themeStatusBtn.title = activeTheme === "dark" ? "Tema escuro ativo" : "Tema claro ativo";
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