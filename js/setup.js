// =====================================================
// FLUIR — CONFIGURAÇÃO INICIAL
// JavaScript puro para controlar o setup em etapas
// =====================================================


// =====================================================
// 1. SELEÇÃO DOS ELEMENTOS PRINCIPAIS
// =====================================================

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const setupForm = document.getElementById("setupForm");
const setupSteps = document.querySelectorAll(".setup-step");

const stepLabel = document.getElementById("stepLabel");
const stepTitle = document.getElementById("stepTitle");
const progressFill = document.getElementById("progressFill");

const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

const miniCards = document.querySelectorAll(".mini-card");

const moduleQuestions = document.getElementById("moduleQuestions");
const reviewBox = document.getElementById("reviewBox");

const userPronouns = document.getElementById("userPronouns");
const customPronounsField = document.getElementById("customPronounsField");

// =====================================================
// ELEMENTOS DE FEEDBACK E MODAL
// Se algum deles não existir no HTML, o JS não pode quebrar.
// =====================================================

const formMessage = document.getElementById("formMessage");

const successModal = document.getElementById("successModal");
const reviewSetupBtn = document.getElementById("reviewSetupBtn");
const closeSuccessModalBtn = document.getElementById("closeSuccessModalBtn");
// =====================================================
// 2. ESTADO PRINCIPAL DO SETUP
// Aqui ficam os dados preenchidos pelo usuário
// =====================================================

let currentStep = 1;
const totalSteps = setupSteps.length;
let isFinishingSetup = false;
let previouslySavedOnboarding = null; // evita repetir POST ao retentar o ciclo

// Sessões pertencem à origem e à aba. 127.0.0.1 e Vercel não compartilham token.
// Modo QA é apenas uma simulação visual local, sem acesso às APIs.
const isLoopbackSetup = ["127.0.0.1", "localhost"].includes(location.hostname);
const isLocalVisualQA = isLoopbackSetup &&
  new URLSearchParams(location.search).get("qa") === "1";

function readOnboardingSession() {
  try {
    const data = JSON.parse(sessionStorage.getItem("fluir-user") || "null");
    if (!data || !Number.isInteger(Number(data.id)) || Number(data.id) <= 0 ||
        typeof data.token !== "string" || data.token.trim().length < 20) return null;
    return data;
  } catch { return null; }
}

function showSetupSessionNotice() {
  if (isLocalVisualQA) {
    const badge = document.createElement("span");
    badge.className = "setup-qa-indicator";
    badge.id = "setupSessionNotice";
    badge.textContent = "Prévia local · dados não salvos";
    badge.title = "As escolhas deste teste não serão enviadas ao servidor nem gravadas.";
    document.querySelector(".setup-top")?.append(badge);
    return;
  }
  const note = document.createElement("section");
  note.className = "setup-session-notice";
  note.id = "setupSessionNotice";
  note.setAttribute("role", "status");
  const heading = document.createElement("strong");
  const explanation = document.createElement("p");
  note.append(heading, explanation);
  if (!readOnboardingSession()) {
    heading.textContent = "Entre na sua conta para salvar";
    explanation.textContent =
      "Não encontramos login neste endereço e nesta aba. Isso não significa que sua sessão expirou.";
    const login = document.createElement("a");
    login.href = "login.html";
    login.className = "secondary-btn";
    login.textContent = "Ir para o login";
    note.append(login);
    if (isLoopbackSetup) {
      const qa = document.createElement("a");
      qa.href = "setup.html?qa=1";
      qa.className = "secondary-btn";
      qa.textContent = "Avaliar a interface sem salvar";
      note.append(qa);
    }
    setupForm.inert = true;
  } else {
    return;
  }
  document.querySelector(".setup-top")?.after(note);
}
showSetupSessionNotice();

window.addEventListener("pageshow", (event) => {
  if (event.persisted && isFinishingSetup) {
    isFinishingSetup = false;
    nextBtn.disabled = false;
    nextBtn.textContent = "Finalizar";
  }
});

const setupData = {
  user: {
    name: "",
    nickname: "",
    sexAtBirth: "",
    pronouns: "",
    customPronouns: "",
    age: "",
    communicationTone: ""
  },

  modules: {
    timeline: true,
    tasks: false,
    habits: false,
    sleep: false,
    water: false,
    finances: false,
    diary: false,
    nutrition: false,
    physicalHealth: false,
    menstrualCycle: false,
    attachments: false
  },

  preferences: {}
};

function preencherDadosDaConta() {
  try {
    const usuarioSalvo = sessionStorage.getItem("fluir-user");

    if (!usuarioSalvo) {
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);
    const nameField = document.getElementById("userName");

    if (nameField && usuario?.nome && !nameField.value.trim()) {
      nameField.value = usuario.nome;
      setupData.user.name = usuario.nome;
    }
  } catch (error) {
    console.warn("Não foi possível reaproveitar os dados da conta:", error);
  }
}

preencherDadosDaConta();


// =====================================================
// 3. NOMES VISUAIS DOS MÓDULOS
// Usados na revisão final
// =====================================================

const moduleLabels = {
  timeline: "Timeline",
  tasks: "Tarefas",
  habits: "Hábitos",
  sleep: "Sono",
  water: "Água",
  finances: "Finanças",
  diary: "Diário emocional",
  nutrition: "Alimentação",
  physicalHealth: "Saúde física",
  menstrualCycle: "Ciclo menstrual",
  attachments: "Anexos"
};

// =====================================================
// FEEDBACK VISUAL
// Mostra mensagens elegantes sem quebrar se o elemento faltar.
// =====================================================

function showFormMessage(message, type = "error") {
  if (!formMessage) {
    alert(message);
    return;
  }

  formMessage.textContent = message;
  formMessage.className = `form-message show ${type}`;
}

function clearFormMessage() {
  if (!formMessage) {
    return;
  }

  formMessage.textContent = "";
  formMessage.className = "form-message";
}


// =====================================================
// LIMPAR / MARCAR CAMPOS INVÁLIDOS
// =====================================================

function clearInvalidFields() {
  document.querySelectorAll(".invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}

function markInvalidField(field) {
  if (field) {
    field.classList.add("invalid");
  }
}


// =====================================================
// VALIDAÇÃO DA ETAPA 1
// Impede avançar sem dados principais
// =====================================================

function validateStep1() {
  clearInvalidFields();
  clearFormMessage();

  const nameField = document.getElementById("userName");
  const nicknameField = document.getElementById("userNickname");
  const sexField = document.getElementById("sexAtBirth");
  const pronounsField = document.getElementById("userPronouns");
  const customPronounsInput = document.getElementById("customPronouns");
  const ageField = document.getElementById("userAge");
  const toneField = document.getElementById("communicationTone");

  let firstInvalidField = null;

  if (!nameField.value.trim()) {
    markInvalidField(nameField);
    firstInvalidField = firstInvalidField || nameField;
  }

  if (!nicknameField.value.trim()) {
    markInvalidField(nicknameField);
    firstInvalidField = firstInvalidField || nicknameField;
  }

  if (!sexField.value) {
    markInvalidField(sexField);
    firstInvalidField = firstInvalidField || sexField;
  }

  if (!pronounsField.value) {
    markInvalidField(pronounsField);
    firstInvalidField = firstInvalidField || pronounsField;
  }

  if (pronounsField.value === "personalizado" && !customPronounsInput.value.trim()) {
    markInvalidField(customPronounsInput);
    firstInvalidField = firstInvalidField || customPronounsInput;
  }

// Validação da idade
// Aceita apenas números inteiros entre 13 e 120 anos
const ageValue = Number(ageField.value);

if (
  !ageField.value ||
  !Number.isInteger(ageValue) ||
  ageValue < 13 ||
  ageValue > 120
) {
  markInvalidField(ageField);
  firstInvalidField = firstInvalidField || ageField;
}

  if (!toneField.value) {
    markInvalidField(toneField);
    firstInvalidField = firstInvalidField || toneField;
  }

  if (firstInvalidField) {
    showFormMessage(
      "Preencha os campos principais corretamente. A idade deve ser um número inteiro entre 13 e 120 anos."
    );
    firstInvalidField.focus();
    return false;
  }

  return true;
}


// =====================================================
// VALIDAÇÃO DA ETAPA 2
// Módulos adicionais são opcionais; Timeline permanece gratuita e ativa.
// =====================================================

function validateStep2() {
  clearFormMessage();

  // A Timeline é gratuita e permanece ativa. É válido continuar sem
  // nenhum módulo adicional, inclusive após retirar recursos pagos no passo 4.
  return true;
}

// =====================================================
// VALIDAÇÃO DA ETAPA 3
// Valida preferências opcionais somente quando preenchidas
// =====================================================

function validateStep3() {
  clearInvalidFields();
  clearFormMessage();

  const monthlyIncomeField = document.querySelector(
    '[data-pref="finances.monthlyIncome"]'
  );

  const lastPeriodDateField = document.querySelector(
    '[data-pref="menstrualCycle.lastPeriodDate"]'
  );

  let firstInvalidField = null;
  let errorMessage = "";

  if (monthlyIncomeField && monthlyIncomeField.value !== "") {
    const monthlyIncome = Number(monthlyIncomeField.value);

    if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0) {
      markInvalidField(monthlyIncomeField);
      firstInvalidField = firstInvalidField || monthlyIncomeField;
      errorMessage = "A renda mensal não pode ser negativa.";
    }
  }

  if (lastPeriodDateField && lastPeriodDateField.value) {
    const today = new Date();
    const todayKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (lastPeriodDateField.value > todayKey) {
      markInvalidField(lastPeriodDateField);
      firstInvalidField = firstInvalidField || lastPeriodDateField;

      if (!errorMessage) {
        errorMessage =
          "A data da última menstruação não pode estar no futuro.";
      }
    }
  }

  if (document.getElementById("fluirCycleBlock") && !window.FluirCycleOnboarding.validate()) {
    return false;
  }

  if (firstInvalidField) {
    showFormMessage(errorMessage);
    firstInvalidField.focus();
    return false;
  }

  return true;
}

// =====================================================
// 4. TÍTULOS DAS ETAPAS
// =====================================================

const stepTitles = {
  1: "Sobre você",
  2: "Funcionalidades",
  3: "Preferências",
  4: "Planos e escolhas",
  5: "Revisão final"
};


// =====================================================
// 5. TEMA CLARO / ESCURO
// Agora o setup apenas aplica o tema salvo.
// A troca principal de tema fica em settings.html.
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

window.addEventListener("load", () => {
  applySavedTheme();
});


// =====================================================
// MOSTRAR CAMPO DE PRONOME PERSONALIZADO
// Só roda se os elementos realmente existirem no HTML.
// =====================================================

if (userPronouns && customPronounsField) {
  userPronouns.addEventListener("change", () => {
    const selectedPronoun = userPronouns.value;
    const customPronounsInput = document.getElementById("customPronouns");

    if (selectedPronoun === "personalizado") {
      customPronounsField.classList.add("active");
    } else {
      customPronounsField.classList.remove("active");

      if (customPronounsInput) {
        customPronounsInput.value = "";
      }
    }
  });
}


// =====================================================
// 7. ATUALIZAR VISUAL DOS MÓDULOS SELECIONADOS
// Quando marca um checkbox, o card ganha destaque
// =====================================================

function updateModuleCardsVisual() {
  const moduleOptions = document.querySelectorAll(".module-option");

  moduleOptions.forEach((option) => {
    const checkbox = option.querySelector("input");

    if (checkbox && checkbox.checked) {
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  });
}

document.querySelectorAll(".module-option input").forEach((checkbox) => {
  checkbox.addEventListener("change", updateModuleCardsVisual);
});

updateModuleCardsVisual();
window.FluirPlansOnboarding.attach({
  get modules(){return setupData.modules;},
  get preferences(){return setupData.preferences;},
  updateCards:updateModuleCardsVisual
});

// =====================================================
// 8. ATUALIZAR ETAPA VISUAL
// Mostra etapa atual, progresso, botão voltar e texto do botão
// =====================================================

function updateStepView() {
  setupSteps.forEach((step) => {
    const stepNumber = Number(step.dataset.step);

    if (stepNumber === currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  stepLabel.textContent = `Etapa ${currentStep} de ${totalSteps}`;
  stepTitle.textContent = stepTitles[currentStep];

  const progressPercentage = (currentStep / totalSteps) * 100;
  progressFill.style.width = `${progressPercentage}%`;

  backBtn.disabled = currentStep === 1;

  if (currentStep === totalSteps) {
    nextBtn.textContent = "Finalizar";
  } else {
    nextBtn.textContent = "Continuar";
  }

  updateMiniCards();
}


// =====================================================
// 9. ATUALIZAR MINI CARDS DA ESQUERDA
// Como existem 3 mini cards e 4 etapas, a revisão mantém o 3 ativo
// =====================================================

function updateMiniCards() {
  miniCards.forEach((card) => {
    card.classList.toggle("active", Number(card.dataset.miniStep) === currentStep);
  });
}


// =====================================================
// 10. COLETAR DADOS DA ETAPA 1
// =====================================================

function collectUserData() {
  setupData.user.name = document.getElementById("userName").value.trim();
  setupData.user.nickname = document.getElementById("userNickname").value.trim();
  setupData.user.sexAtBirth = document.getElementById("sexAtBirth").value;
  setupData.user.pronouns = document.getElementById("userPronouns").value;
  setupData.user.customPronouns = document.getElementById("customPronouns").value.trim();
  setupData.user.age = document.getElementById("userAge").value;
  setupData.user.communicationTone = document.getElementById("communicationTone").value;
}


// =====================================================
// 11. COLETAR FUNCIONALIDADES ESCOLHIDAS
// =====================================================

function collectSelectedModules() {
  Object.keys(setupData.modules).forEach((moduleKey) => {
    setupData.modules[moduleKey] = moduleKey === "timeline";
  });

  const selectedCheckboxes = document.querySelectorAll(".module-option input:checked");

  selectedCheckboxes.forEach((checkbox) => {
    const moduleName = checkbox.value;

    if (moduleName && setupData.modules.hasOwnProperty(moduleName)) {
      setupData.modules[moduleName] = true;
    }
  });
}


// =====================================================
// 12. PEGAR LISTA DE MÓDULOS ATIVOS
// =====================================================

function getActiveModules() {
  return Object.keys(setupData.modules).filter((moduleKey) => {
    return setupData.modules[moduleKey] === true;
  });
}


// =====================================================
// 13. GERAR PERGUNTAS DA ETAPA 3
// Essa função cria perguntas de acordo com os módulos escolhidos
// =====================================================

function generateModuleQuestions() {
  collectUserData();
  collectSelectedModules();

  moduleQuestions.innerHTML = "";

  const activeModules = getActiveModules().filter((moduleKey) => {
    return moduleKey !== "timeline";
  });

  if (activeModules.length === 0) {
    moduleQuestions.innerHTML = `
      <div class="soft-note">
        Você deixou apenas a Timeline ativa. Tudo bem — ela será usada para registrar os eventos principais.
        Se quiser, volte e escolha mais funcionalidades para personalizar melhor o seu dashboard.
      </div>
    `;

    return;
  }

  activeModules.forEach((moduleKey) => {
    if (moduleKey === "tasks") {
      moduleQuestions.innerHTML += createTasksQuestions();
    }

    if (moduleKey === "habits") {
      moduleQuestions.innerHTML += createHabitsQuestions();
    }

    if (moduleKey === "sleep") {
      moduleQuestions.innerHTML += createSleepQuestions();
    }

    if (moduleKey === "water") {
      moduleQuestions.innerHTML += createWaterQuestions();
    }

    if (moduleKey === "finances") {
      moduleQuestions.innerHTML += createFinancesQuestions();
    }

    if (moduleKey === "diary") {
      moduleQuestions.innerHTML += createDiaryQuestions();
    }

    if (moduleKey === "nutrition") {
      moduleQuestions.innerHTML += createNutritionQuestions();
    }

    if (moduleKey === "physicalHealth") {
      moduleQuestions.innerHTML += createPhysicalHealthQuestions();
    }

    if (moduleKey === "menstrualCycle") {
      moduleQuestions.innerHTML += createMenstrualCycleQuestions();
    }

    if (moduleKey === "attachments") {
      moduleQuestions.innerHTML += createAttachmentsQuestions();
    }
  });
  window.FluirCycleOnboarding.mount(moduleQuestions);
}


// =====================================================
// 14. PERGUNTAS — TAREFAS
// =====================================================

function createTasksQuestions() {
  return `
    <div class="question-block" data-module="tasks">
      <h4>Tarefas</h4>
      <p class="question-block-description">
        Vamos ajustar como você quer organizar pendências, prioridades e lembretes.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Como prefere visualizar suas tarefas?</span>
          <select data-pref="tasks.preferredView">
            <option value="">Selecione</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Semana</option>
            <option value="prioridade">Prioridade</option>
            <option value="projeto">Projeto</option>
          </select>
        </label>

        <label class="field">
          <span>Quer receber lembretes?</span>
          <select data-pref="tasks.reminders">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>

        <div class="field question-full">
          <span>Categorias de tarefas</span>

          <div class="checkbox-list">
            ${createChoicePill("tasks.categories", "Trabalho")}
            ${createChoicePill("tasks.categories", "Estudos")}
            ${createChoicePill("tasks.categories", "Casa")}
            ${createChoicePill("tasks.categories", "Pessoal")}
            ${createChoicePill("tasks.categories", "Saúde")}
            ${createChoicePill("tasks.categories", "Projetos")}
          </div>
        </div>
      </div>
    </div>
  `;
}


// =====================================================
// 15. PERGUNTAS — HÁBITOS
// =====================================================

function createHabitsQuestions() {
  return `
    <div class="question-block" data-module="habits">
      <h4>Hábitos</h4>
      <p class="question-block-description">
        Escolha hábitos que você quer acompanhar com constância.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Como prefere acompanhar?</span>
          <select data-pref="habits.trackingType">
            <option value="">Selecione</option>
            <option value="sequencia">Por sequência</option>
            <option value="porcentagem">Por porcentagem</option>
            <option value="ambos">Sequência e porcentagem</option>
          </select>
        </label>

        <label class="field">
          <span>Meta semanal geral</span>
          <select data-pref="habits.weeklyGoal">
            <option value="">Selecione</option>
            <option value="3">3 vezes por semana</option>
            <option value="5">5 vezes por semana</option>
            <option value="7">Todos os dias</option>
            <option value="personalizado">Personalizado depois</option>
          </select>
        </label>

        <div class="field question-full">
          <span>Hábitos que deseja acompanhar</span>

          <div class="checkbox-list">
            ${createChoicePill("habits.selectedHabits", "Beber água")}
            ${createChoicePill("habits.selectedHabits", "Meditar")}
            ${createChoicePill("habits.selectedHabits", "Treinar")}
            ${createChoicePill("habits.selectedHabits", "Ler")}
            ${createChoicePill("habits.selectedHabits", "Dormir cedo")}
            ${createChoicePill("habits.selectedHabits", "Estudar")}
            ${createChoicePill("habits.selectedHabits", "Organizar o quarto")}
          </div>
        </div>
      </div>
    </div>
  `;
}


// =====================================================
// 16. PERGUNTAS — SONO
// =====================================================

function createSleepQuestions() {
  return `
    <div class="question-block" data-module="sleep">
      <h4>Sono</h4>
      <p class="question-block-description">
        Defina sua meta de sono e como deseja acompanhar sua rotina noturna.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Meta de sono por noite</span>
          <input type="text" data-pref="sleep.sleepGoal" placeholder="Ex: 7h30" />
        </label>

        <label class="field">
          <span>Horário em que costuma dormir</span>
          <input type="time" data-pref="sleep.usualSleepTime" />
        </label>

        <label class="field">
          <span>Horário em que costuma acordar</span>
          <input type="time" data-pref="sleep.usualWakeTime" />
        </label>

        <label class="field">
          <span>Quer registrar qualidade do sono?</span>
          <select data-pref="sleep.trackQuality">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Você tem dificuldade para dormir?</span>
          <select data-pref="sleep.sleepDifficulty">
            <option value="">Selecione</option>
            <option value="frequentemente">Frequentemente</option>
            <option value="as-vezes">Às vezes</option>
            <option value="raramente">Raramente</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Quer lembrete para dormir?</span>
          <select data-pref="sleep.sleepReminder">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 17. PERGUNTAS — ÁGUA
// =====================================================

function createWaterQuestions() {
  return `
    <div class="question-block" data-module="water">
      <h4>Água</h4>
      <p class="question-block-description">
        Configure sua meta diária de hidratação.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Meta diária de água</span>
          <input type="text" data-pref="water.dailyGoal" placeholder="Ex: 2 litros" />
        </label>

        <label class="field">
  <span>Como você prefere registrar?</span>

  <select data-pref="water.unit">
    <option value="ml" selected>Mililitros</option>
    <option value="litros">Litros</option>
    <option value="copos">Copos, futuramente</option>
    <option value="garrafas">Garrafas, futuramente</option>
  </select>
</label>

        <label class="field">
          <span>Quer lembretes?</span>
          <select data-pref="water.reminders">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>

        <label class="field">
          <span>Frequência do lembrete</span>
          <select data-pref="water.reminderFrequency">
            <option value="">Selecione</option>
            <option value="1h">A cada 1 hora</option>
            <option value="2h">A cada 2 horas</option>
            <option value="3h">A cada 3 horas</option>
            <option value="personalizado">Personalizar depois</option>
          </select>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 18. PERGUNTAS — FINANÇAS
// =====================================================

function createFinancesQuestions() {
  return `
    <div class="question-block" data-module="finances">
      <h4>Finanças</h4>
      <p class="question-block-description">
        Informe dados básicos para organizar renda, gastos, dívidas e metas.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Renda mensal aproximada</span>
          <input
            type="number"
            data-pref="finances.monthlyIncome"
            min="0"
            step="0.01"
            placeholder="Ex: 2500"
          />
        </label>

        <label class="field">
          <span>Você quer controlar gastos?</span>
          <select data-pref="finances.trackExpenses">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Você quer controlar dívidas?</span>
          <select data-pref="finances.trackDebts">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Meta financeira principal</span>
          <input type="text" data-pref="finances.financialGoal" placeholder="Ex: juntar dinheiro, quitar dívidas..." />
        </label>

        <div class="field question-full">
          <span>Categorias financeiras</span>

          <div class="checkbox-list">
            ${createChoicePill("finances.categories", "Alimentação")}
            ${createChoicePill("finances.categories", "Transporte")}
            ${createChoicePill("finances.categories", "Casa")}
            ${createChoicePill("finances.categories", "Lazer")}
            ${createChoicePill("finances.categories", "Saúde")}
            ${createChoicePill("finances.categories", "Estudos")}
            ${createChoicePill("finances.categories", "Dívidas")}
            ${createChoicePill("finances.categories", "Investimentos")}
          </div>
        </div>
      </div>
    </div>
  `;
}


// =====================================================
// 19. PERGUNTAS — DIÁRIO EMOCIONAL
// =====================================================

function createDiaryQuestions() {
  return `
    <div class="question-block" data-module="diary">
      <h4>Diário emocional</h4>
      <p class="question-block-description">
        Configure como deseja registrar pensamentos, sentimentos e humor.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Com que frequência quer escrever?</span>
          <select data-pref="diary.frequency">
            <option value="">Selecione</option>
            <option value="todos-os-dias">Todos os dias</option>
            <option value="algumas-vezes">Algumas vezes por semana</option>
            <option value="quando-eu-quiser">Só quando eu quiser</option>
          </select>
        </label>

        <label class="field">
          <span>Quer registrar humor?</span>
          <select data-pref="diary.trackMood">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Quer perguntas reflexivas?</span>
          <select data-pref="diary.dailyPrompt">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>

        <label class="field">
          <span>Quer acompanhar ansiedade/estresse?</span>
          <select data-pref="diary.trackStress">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 20. PERGUNTAS — ALIMENTAÇÃO
// =====================================================

function createNutritionQuestions() {
  return `
    <div class="question-block" data-module="nutrition">
      <h4>Alimentação</h4>
      <p class="question-block-description">
        Essas informações ajudam a montar uma área alimentar mais útil para sua rotina.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Altura</span>
          <input type="text" data-pref="nutrition.height" placeholder="Ex: 1,70m" />
        </label>

        <label class="field">
          <span>Peso atual</span>
          <input type="text" data-pref="nutrition.weight" placeholder="Ex: 65kg" />
        </label>

        <label class="field">
          <span>Objetivo alimentar</span>
          <select data-pref="nutrition.goal">
            <option value="">Selecione</option>
            <option value="melhorar-alimentacao">Melhorar alimentação</option>
            <option value="ganhar-massa">Ganhar massa</option>
            <option value="perder-peso">Perder peso</option>
            <option value="manter-peso">Manter peso</option>
            <option value="mais-energia">Ter mais energia</option>
            <option value="organizar-refeicoes">Organizar refeições</option>
          </select>
        </label>

        <label class="field">
          <span>Refeições por dia</span>
          <select data-pref="nutrition.mealsPerDay">
            <option value="">Selecione</option>
            <option value="2">2 refeições</option>
            <option value="3">3 refeições</option>
            <option value="4">4 refeições</option>
            <option value="5">5 refeições</option>
            <option value="6">6 ou mais</option>
          </select>
        </label>

        <label class="field question-full">
          <span>Restrições ou observações alimentares</span>
          <textarea data-pref="nutrition.restrictions" placeholder="Ex: lactose, glúten, vegetariano, alergias..."></textarea>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 21. PERGUNTAS — SAÚDE FÍSICA
// =====================================================

function createPhysicalHealthQuestions() {
  return `
    <div class="question-block" data-module="physicalHealth">
      <h4>Saúde física</h4>
      <p class="question-block-description">
        Configure acompanhamento de treinos, dores, disposição e evolução.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Você pratica atividade física?</span>
          <select data-pref="physicalHealth.exercises">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="quero-comecar">Quero começar</option>
          </select>
        </label>

        <label class="field">
          <span>Frequência semanal</span>
          <select data-pref="physicalHealth.weeklyFrequency">
            <option value="">Selecione</option>
            <option value="1-2">1 a 2 vezes</option>
            <option value="3-4">3 a 4 vezes</option>
            <option value="5+">5 ou mais vezes</option>
            <option value="ainda-nao-sei">Ainda não sei</option>
          </select>
        </label>

        <label class="field">
          <span>Tipo principal de treino</span>
          <select data-pref="physicalHealth.trainingType">
            <option value="">Selecione</option>
            <option value="musculacao">Musculação</option>
            <option value="cardio">Cardio</option>
            <option value="corrida">Corrida</option>
            <option value="caminhada">Caminhada</option>
            <option value="alongamento">Alongamento</option>
            <option value="outro">Outro</option>
          </select>
        </label>

        <label class="field">
          <span>Quer registrar dores ou disposição?</span>
          <select data-pref="physicalHealth.trackPainEnergy">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>

        <label class="field question-full">
          <span>Limitações físicas ou observações</span>
          <textarea data-pref="physicalHealth.limitations" placeholder="Ex: dor no joelho, lesão, restrição médica..."></textarea>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 22. PERGUNTAS — CICLO MENSTRUAL
// =====================================================

function createMenstrualCycleQuestions() {
  return window.FluirCycleOnboarding.html();
}

// 23. PERGUNTAS — ANEXOS
// =====================================================

function createAttachmentsQuestions() {
  return `
    <div class="question-block" data-module="attachments">
      <h4>Anexos</h4>
      <p class="question-block-description">
        Escolha que tipos de arquivos pretende guardar no Fluir.
      </p>

      <div class="question-grid">
        <div class="field question-full">
          <span>Tipos de arquivo</span>

          <div class="checkbox-list">
            ${createChoicePill("attachments.fileTypes", "PDFs")}
            ${createChoicePill("attachments.fileTypes", "Imagens")}
            ${createChoicePill("attachments.fileTypes", "Comprovantes")}
            ${createChoicePill("attachments.fileTypes", "Documentos pessoais")}
            ${createChoicePill("attachments.fileTypes", "Relatórios")}
            ${createChoicePill("attachments.fileTypes", "Arquivos de estudo")}
          </div>
        </div>

        <div class="field question-full">
          <span>Deseja vincular anexos com quais áreas?</span>

          <div class="checkbox-list">
            ${createChoicePill("attachments.linkToModules", "Tarefas")}
            ${createChoicePill("attachments.linkToModules", "Finanças")}
            ${createChoicePill("attachments.linkToModules", "Diário")}
            ${createChoicePill("attachments.linkToModules", "Saúde")}
            ${createChoicePill("attachments.linkToModules", "Alimentação")}
          </div>
        </div>
      </div>
    </div>
  `;
}


// =====================================================
// 24. CRIAR CHECKBOX PILL
// Função auxiliar para montar opções clicáveis
// =====================================================

function createChoicePill(prefKey, label) {
  return `
    <label class="choice-pill">
      <input type="checkbox" data-pref-array="${prefKey}" value="${label}">
      ${label}
    </label>
  `;
}


// =====================================================
// 25. COLETAR PREFERÊNCIAS DA ETAPA 3
// Lê todos os inputs/selects/textarea gerados dinamicamente
// =====================================================

function collectPreferences() {
  setupData.preferences = {};

  const simpleFields = document.querySelectorAll("[data-pref]");

  simpleFields.forEach((field) => {
    const path = field.dataset.pref;
    const value = field.value;

    setNestedValue(setupData.preferences, path, value);
  });

  const arrayFields = document.querySelectorAll("[data-pref-array]");

  arrayFields.forEach((checkbox) => {
    const path = checkbox.dataset.prefArray;

    if (!getNestedValue(setupData.preferences, path)) {
      setNestedValue(setupData.preferences, path, []);
    }

    if (checkbox.checked) {
      const currentArray = getNestedValue(setupData.preferences, path);
      currentArray.push(checkbox.value);
      setNestedValue(setupData.preferences, path, currentArray);
    }
  });
  if (setupData.modules.menstrualCycle) {
    setupData.preferences.menstrualCycle = window.FluirCycleOnboarding.legacy();
  }
}


// =====================================================
// 26. FUNÇÕES PARA SALVAR VALORES ANINHADOS
// Exemplo: sleep.sleepGoal dentro de preferences
// =====================================================

function setNestedValue(object, path, value) {
  const keys = path.split(".");
  let current = object;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) {
        current[key] = {};
      }

      current = current[key];
    }
  });
}

function getNestedValue(object, path) {
  const keys = path.split(".");
  let current = object;

  for (const key of keys) {
    if (!current || !current.hasOwnProperty(key)) {
      return undefined;
    }

    current = current[key];
  }

  return current;
}


// =====================================================
// 27. GERAR REVISÃO FINAL
// =====================================================

function escapeSetupHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
}
function generateReview() {
  collectUserData();
  collectSelectedModules();
  collectPreferences();

  const activeModules = getActiveModules();

  const displayName = setupData.user.nickname || setupData.user.name || "Você";

  const pronounsText = setupData.user.pronouns === "personalizado"
    ? setupData.user.customPronouns || "Personalizado"
    : setupData.user.pronouns || "Não informado";

  reviewBox.innerHTML = `
    <div class="review-section">
      <h4>Sobre você</h4>
      <p>
        Nome: <strong>${escapeSetupHtml(setupData.user.name) || "Não informado"}</strong><br>
        Como quer ser chamado(a): <strong>${escapeSetupHtml(displayName)}</strong><br>
        Sexo atribuído ao nascer: <strong>${formatText(setupData.user.sexAtBirth)}</strong><br>
        Pronomes: <strong>${formatText(pronounsText)}</strong><br>
        Idade: <strong>${escapeSetupHtml(setupData.user.age) || "Não informada"}</strong><br>
        Comunicação: <strong>${formatText(setupData.user.communicationTone)}</strong>
      </p>
    </div>

    <div class="review-section">
      <h4>Módulos escolhidos</h4>
      <p>Essas áreas serão consideradas na personalização. Recursos pagos planejados não são desbloqueados automaticamente.</p>

      <div class="review-list">
        ${activeModules.map((moduleKey) => {
          return `<span>${moduleLabels[moduleKey]}</span>`;
        }).join("")}
      </div>
    </div>

    <div class="review-section">
      <h4>Preferências configuradas</h4>
      <p>
        Suas preferências serão salvas no Fluir e usadas para personalizar sua experiência.
      </p>
    </div>
  `;
  if (setupData.modules.menstrualCycle) {
    reviewBox.insertAdjacentHTML("beforeend", window.FluirCycleOnboarding.reviewHtml());
  }
  reviewBox.insertAdjacentHTML("beforeend", window.FluirPlansOnboarding.summaryHtml());
}


// =====================================================
// 28. FORMATAR TEXTO PARA EXIBIÇÃO
// =====================================================

function formatText(value) {
  if (!value) {
    return "Não informado";
  }

  return escapeSetupHtml(String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()));
}


// =====================================================
// 29. AVANÇAR ETAPA
// =====================================================
const restartSetupBtn = document.getElementById("restartSetupBtn");
if (restartSetupBtn) restartSetupBtn.addEventListener("click", () => {
  if (previouslySavedOnboarding) {
    alert("O cadastro geral já foi salvo. Ajuste apenas a configuração do ciclo e finalize novamente.");
    return;
  }
  if (!confirm("Recomeçar todo o onboarding? As respostas ainda não salvas serão descartadas.")) return;
  setupForm.reset();
  window.FluirCycleOnboarding.reset();
  Object.keys(setupData.user).forEach(key => setupData.user[key] = "");
  Object.keys(setupData.modules).forEach(key => setupData.modules[key] = key === "timeline");
  setupData.preferences = {};
  window.FluirPlansOnboarding.reset();
  moduleQuestions.replaceChildren();
  reviewBox.replaceChildren();
  clearFormMessage();
  clearInvalidFields();
  preencherDadosDaConta();
  updateModuleCardsVisual();
  currentStep = 1;
  updateStepView();
});
nextBtn.addEventListener("click", () => {
  clearFormMessage();

  if (currentStep === 1) {
    if (!validateStep1()) {
      return;
    }

    collectUserData();
  }

  if (currentStep === 2) {
    if (!validateStep2()) {
      return;
    }

    collectSelectedModules();
    generateModuleQuestions();
  }

  if (currentStep === 3) {
    if (!validateStep3()) {
      return;
    }

    collectPreferences();
    window.FluirPlansOnboarding.render();
  }
  if (currentStep === 4) {
    generateReview();
  }

  if (currentStep < totalSteps) {
    currentStep++;
    updateStepView();
    return;
  }

  finishSetup();
});


// =====================================================
// 30. VOLTAR ETAPA
// =====================================================

backBtn.addEventListener("click", () => {
  clearFormMessage();
  clearInvalidFields();

  if (currentStep > 1) {
    currentStep--;
    updateStepView();
  }
});


// =====================================================
// 31. FINALIZAR SETUP
// Salva a configuração no backend
// Mantém também uma cópia local para telas que ainda dependem dela
// =====================================================

async function finishSetup() {
  let setupSaved = false;

  if (isFinishingSetup) {
    return;
  }

  isFinishingSetup = true;
  nextBtn.disabled = true;
  nextBtn.textContent = "Salvando...";

  collectUserData();
  collectSelectedModules();
  collectPreferences();
  setupData.planInterest = window.FluirPlansOnboarding.snapshot();

  clearFormMessage();

  try {
    if (isLocalVisualQA) {
      showFormMessage("Simulação concluída: os dados não foram enviados nem salvos. Para salvar de verdade, use uma conta autenticada em um ambiente de testes.");
      return;
    }
    const usuario = readOnboardingSession();
    if (!usuario) {
      showFormMessage("Nenhum login ativo neste endereço. Entre pela tela de login do mesmo site antes de salvar.");
      return;
    }

    window.FluirTransition.show(
      "Salvando suas preferências...",
      "Estamos preparando seu dashboard com as escolhas que você confirmou."
    );

    const pronomes =
      setupData.user.pronouns === "personalizado"
        ? setupData.user.customPronouns
        : setupData.user.pronouns;

    const payload = {
      usuarioId: usuario.id,
      nome: setupData.user.name,
      apelido: setupData.user.nickname,
      pronomes: pronomes,
      generoNascimento: setupData.user.sexAtBirth,
      idade: Number(setupData.user.age),
      tomComunicacao: setupData.user.communicationTone,
      modulos: setupData.modules,
      tarefas: setupData.preferences.tasks || null,
      habitos: setupData.preferences.habits || null,
      sono: setupData.preferences.sleep || null,
      agua: setupData.preferences.water || null,
      financas: setupData.preferences.finances
        ? {
            ...setupData.preferences.finances,
            monthlyIncome: setupData.preferences.finances.monthlyIncome
              ? Number(setupData.preferences.finances.monthlyIncome)
              : null
          }
        : null,
      diario: setupData.preferences.diary || null,
      alimentacao: setupData.preferences.nutrition || null,
      saudeFisica: setupData.preferences.physicalHealth || null,
      cicloMenstrual: setupData.preferences.menstrualCycle || null,
      anexos: setupData.preferences.attachments || null,
    };

    let data = previouslySavedOnboarding || {};
    if (!previouslySavedOnboarding) {
      const response = await fetch(
        "https://fluir-sistema.onrender.com/api/onboarding/salvar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuario.token}`
          },
          body: JSON.stringify(payload)
        }
      );
      const responseText = await response.text();
      try { data = JSON.parse(responseText); } catch { data = {}; }
      if (!response.ok) {
        if (response.status === 401) {
          showFormMessage("Sua sessão de 12 horas terminou ou foi invalidada pelo servidor. Faça login novamente neste mesmo site.");
        } else if (response.status === 403) {
          showFormMessage("Sua conta não tem permissão para salvar este cadastro. Confira qual conta está conectada.");
        } else if (response.status === 404) {
          showFormMessage("A versão do backend ainda não oferece o salvamento solicitado. Verifique o deploy de teste.");
        } else {
          showFormMessage(data.mensagem || responseText || "Falha ao salvar a configuração (HTTP " + response.status + ").");
        }
        return;
      }
      previouslySavedOnboarding = data;
    }
    if (setupData.modules.menstrualCycle) {
      await window.FluirCycleOnboarding.persist(usuario.token, setupData.user.nickname);
    }
    await window.FluirPlansOnboarding.persist(usuario.token);
    setupData.usuarioId = usuario.id;
    setupData.onboardingConcluido = true;
    setupData.atualizadoEm = new Date().toISOString();

    // Mantemos localmente porque outras telas ainda dependem disso.
    const publicSetup = { ...setupData, preferences: { ...setupData.preferences } };
    delete publicSetup.preferences.menstrualCycle;
    localStorage.setItem("fluir-setup", JSON.stringify(publicSetup));
    sessionStorage.setItem("fluir-onboarding", JSON.stringify(data));
    sessionStorage.setItem("fluir-onboarding-completed", "true");
    seedExampleContent();

    setupSaved = true;

    window.FluirTransition.navigate(
      "dashboard.html",
      "Tudo pronto!",
      "Abrindo seu dashboard personalizado."
    );
  } catch (error) {
    console.error("Erro ao salvar onboarding:", error);

    showFormMessage(
      error?.message?.startsWith("O cadastro geral foi salvo") ?
        error.message : "Não foi possível salvar sua configuração. Tente novamente."
    );
  } finally {
    if (!setupSaved) {
      window.FluirTransition.hide();
      isFinishingSetup = false;
      nextBtn.disabled = false;
      nextBtn.textContent = "Finalizar";
    }
  }
}

// =====================================================
// 31.1 CRIAR EXEMPLOS PARA ENSINAR A USAR O SISTEMA
// Só cria se o módulo correspondente foi selecionado,
// e só na primeira vez (não duplica se já existir algo).
// =====================================================

function getTodayKeyForSeed() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function seedExampleContent() {
  if (setupData.modules.tasks) {
    const existingTasks = JSON.parse(localStorage.getItem("fluir-tasks") || "[]");

    if (existingTasks.length === 0) {
      const exampleTask = {
        id: Date.now(),
        title: "Toque aqui para concluir sua primeira tarefa",
        description: "Essa é só um exemplo — pode apagar quando quiser.",
        category: "Pessoal",
        priority: "medium",
        time: "",
        completed: false,
        date: getTodayKeyForSeed(),
        createdAt: new Date().toISOString()
      };

      existingTasks.unshift(exampleTask);
      localStorage.setItem("fluir-tasks", JSON.stringify(existingTasks));
    }
  }

  if (setupData.modules.habits) {
    const existingHabits = JSON.parse(localStorage.getItem("fluir-habits") || "[]");

    if (existingHabits.length === 0) {
      const exampleHabit = {
        id: Date.now() + 1,
        title: "Beber um copo de água",
        description: "Marque quando completar — esse hábito é só um exemplo.",
        category: "Saúde",
        weeklyGoal: 7,
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        streak: 0,
        completedDates: [],
        createdAt: new Date().toISOString()
      };

      existingHabits.unshift(exampleHabit);
      localStorage.setItem("fluir-habits", JSON.stringify(existingHabits));
    }
  }
}


// =====================================================
// 32. INICIALIZAR TELA
// =====================================================

updateStepView();

// =====================================================
// MODAL DE SUCESSO
// Versão segura: só funciona se o modal existir no HTML.
// =====================================================

function openSuccessModal() {
  if (!successModal) {
    alert("Configuração inicial salva! Depois vamos levar você para o dashboard.");
    return;
  }

  successModal.classList.add("active");
}

function closeSuccessModal() {
  if (!successModal) {
    return;
  }

  successModal.classList.remove("active");
}

if (reviewSetupBtn) {
  reviewSetupBtn.addEventListener("click", () => {
    closeSuccessModal();
    currentStep = 5;
    updateStepView();
  });
}

if (closeSuccessModalBtn) {
  closeSuccessModalBtn.addEventListener("click", () => {
    closeSuccessModal();
  });
}