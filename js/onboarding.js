// =============================
// FLUIR — ONBOARDING
// Configuração inicial do usuário
// =============================


// =============================
// 1. SELEÇÃO DOS ELEMENTOS
// =============================

const onboardingForm = document.getElementById("onboardingForm");
const onboardingMessage = document.getElementById("onboardingMessage");

const currentStepText = document.getElementById("currentStepText");
const onboardingSteps = document.querySelectorAll(".onboarding-step");
const progressSteps = document.querySelectorAll(".step-item");

const backStepBtn = document.getElementById("backStepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");
const finishOnboardingBtn = document.getElementById("finishOnboardingBtn");

const nomeInput = document.getElementById("nome");
const pronomesInput = document.getElementById("pronomes");
const generoNascimentoInput = document.getElementById("generoNascimento");
const alturaInput = document.getElementById("altura");
const pesoInput = document.getElementById("peso");

const selectAllModulesBtn = document.getElementById("selectAllModules");
const clearModulesBtn = document.getElementById("clearModules");

const waterPreferenceSection = document.getElementById("waterPreferenceSection");
const calculatedWaterGoal = document.getElementById("calculatedWaterGoal");
const customWaterGoalInput = document.getElementById("customWaterGoal");

const tasksSetupSection = document.getElementById("tasksSetupSection");
const firstTaskTitleInput = document.getElementById("firstTaskTitle");
const firstTaskTimeInput = document.getElementById("firstTaskTime");
const firstTaskEnergyCostInput = document.getElementById("firstTaskEnergyCost");
const currentEnergyInput = document.getElementById("currentEnergy");

const habitsSetupSection = document.getElementById("habitsSetupSection");
const firstHabitTitleInput = document.getElementById("firstHabitTitle");
const firstHabitFrequencyInput = document.getElementById("firstHabitFrequency");
const firstHabitTimeInput = document.getElementById("firstHabitTime");

const emptyModuleSetup = document.getElementById("emptyModuleSetup");

let currentStep = 1;
const totalSteps = 3;


// =============================
// 2. FUNÇÕES AUXILIARES
// =============================

function showMessage(message, type) {
  if (!onboardingMessage) {
    return;
  }

  onboardingMessage.textContent = message;
  onboardingMessage.className = `form-message ${type}`;
}

function clearMessage() {
  showMessage("", "info");
}

function getSelectedModules() {
  const checkedModules = document.querySelectorAll(".module-options input:checked");

  return Array.from(checkedModules).map(function (input) {
    return input.value;
  });
}

function calculateWaterGoal(peso) {
  return Math.round(Number(peso) * 35);
}

function getFinalWaterGoal(peso) {
  const calculatedGoal = calculateWaterGoal(peso);
  const customGoal = Number(customWaterGoalInput?.value || 0);

  if (customGoal >= 500 && customGoal <= 8000) {
    return customGoal;
  }

  return calculatedGoal;
}

function getWaterPreference() {
  const selectedPreference = document.querySelector('input[name="waterPreference"]:checked');

  return selectedPreference ? selectedPreference.value : "ml";
}

function isModuleSelected(moduleName) {
  const moduleInput = document.querySelector(`.module-options input[value="${moduleName}"]`);

  return moduleInput ? moduleInput.checked : false;
}

function setAllModulesChecked(isChecked) {
  const moduleInputs = document.querySelectorAll(".module-options input");

  moduleInputs.forEach(function (input) {
    input.checked = isChecked;
  });

  updateModuleSetupVisibility();
}

function updateCalculatedWaterText() {
  if (!calculatedWaterGoal) {
    return;
  }

  const peso = Number(pesoInput?.value || 0);

  if (!peso || peso < 20 || peso > 300) {
    calculatedWaterGoal.textContent = "Informe seu peso";
    return;
  }

  calculatedWaterGoal.textContent = `${calculateWaterGoal(peso)} ml por dia`;
}

function updateModuleSetupVisibility() {
  const waterSelected = isModuleSelected("agua");
  const tasksSelected = isModuleSelected("tarefas");
  const habitsSelected = isModuleSelected("habitos");

  if (waterPreferenceSection) {
    waterPreferenceSection.style.display = waterSelected ? "block" : "none";
  }

  if (tasksSetupSection) {
    tasksSetupSection.style.display = tasksSelected ? "block" : "none";
  }

  if (habitsSetupSection) {
    habitsSetupSection.style.display = habitsSelected ? "block" : "none";
  }

  if (emptyModuleSetup) {
    const hasAnyInitialSetup = waterSelected || tasksSelected || habitsSelected;
    emptyModuleSetup.style.display = hasAnyInitialSetup ? "none" : "flex";
  }

  updateCalculatedWaterText();
}


// =============================
// 3. CONTROLE DAS ETAPAS
// =============================

function updateStepView() {
  onboardingSteps.forEach(function (step) {
    const stepNumber = Number(step.dataset.step);
    step.classList.toggle("active", stepNumber === currentStep);
  });

  progressSteps.forEach(function (step) {
    const stepNumber = Number(step.dataset.progressStep);

    step.classList.toggle("active", stepNumber === currentStep);
    step.classList.toggle("completed", stepNumber < currentStep);
  });

  if (currentStepText) {
    currentStepText.textContent = String(currentStep);
  }

  if (backStepBtn) {
    backStepBtn.style.display = currentStep === 1 ? "none" : "inline-flex";
  }

  if (nextStepBtn) {
    nextStepBtn.style.display = currentStep < totalSteps ? "inline-flex" : "none";
  }

  if (finishOnboardingBtn) {
    finishOnboardingBtn.style.display = currentStep === totalSteps ? "inline-flex" : "none";
  }

  clearMessage();

  if (currentStep === 3) {
    updateModuleSetupVisibility();
  }
}

function goToNextStep() {
  if (!validateCurrentStep()) {
    return;
  }

  if (currentStep < totalSteps) {
    currentStep++;
    updateStepView();
  }
}

function goToPreviousStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepView();
  }
}


// =============================
// 4. VALIDAÇÕES
// =============================

function validateCurrentStep() {
  if (currentStep === 1) {
    return validatePersonalInfo();
  }

  if (currentStep === 2) {
    return validateModules();
  }

  return true;
}

function validatePersonalInfo() {
  const nome = nomeInput.value.trim();
  const pronomes = pronomesInput.value;
  const generoNascimento = generoNascimentoInput.value;
  const altura = Number(alturaInput.value);
  const peso = Number(pesoInput.value);

  if (!nome || !pronomes || !generoNascimento || !altura || !peso) {
    showMessage("Preencha todos os dados básicos antes de continuar.", "error");
    return false;
  }

  if (nome.length < 3) {
    showMessage("O nome precisa ter pelo menos 3 caracteres.", "error");
    return false;
  }

  if (altura < 50 || altura > 250) {
    showMessage("Digite uma altura válida em centímetros.", "error");
    return false;
  }

  if (peso < 20 || peso > 300) {
    showMessage("Digite um peso válido em kg.", "error");
    return false;
  }

  return true;
}

function validateModules() {
  const modulos = getSelectedModules();

  if (modulos.length === 0) {
    showMessage("Escolha pelo menos um módulo para começar.", "error");
    return false;
  }

  return true;
}


// =============================
// 5. MONTAGEM DOS DADOS
// =============================

function buildSelectedModules(modulos) {
  return {
    timeline: true,
    tasks: modulos.includes("tarefas"),
    habits: modulos.includes("habitos"),
    sleep: modulos.includes("sono"),
    water: modulos.includes("agua"),
    finances: modulos.includes("financas"),
    diary: modulos.includes("diario"),
    nutrition: modulos.includes("nutricao"),
    physicalHealth: modulos.includes("treinos"),
    menstrualCycle: modulos.includes("ciclo"),
    attachments: true
  };
}

function buildInitialTask() {
  const title = firstTaskTitleInput?.value.trim();
  const estimatedTime = firstTaskTimeInput?.value || "";
  const energyCost = firstTaskEnergyCostInput?.value || "";

  if (!title) {
    return null;
  }

  return {
    id: `task-${Date.now()}`,
    title,
    category: "Primeira tarefa",
    time: "",
    estimatedMinutes: estimatedTime,
    energyCost,
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function buildInitialHabit() {
  const title = firstHabitTitleInput?.value.trim();
  const frequency = firstHabitFrequencyInput?.value || "";
  const preferredTime = firstHabitTimeInput?.value || "";

  if (!title) {
    return null;
  }

  return {
    id: `habit-${Date.now()}`,
    title,
    category: "Primeiro hábito",
    frequency,
    preferredTime,
    completedDates: [],
    createdAt: new Date().toISOString()
  };
}

function saveInitialTaskIfNeeded() {
  const initialTask = buildInitialTask();

  if (!initialTask) {
    return;
  }

  const savedTasks = JSON.parse(localStorage.getItem("fluir-tasks") || "[]");
  savedTasks.unshift(initialTask);

  localStorage.setItem("fluir-tasks", JSON.stringify(savedTasks));
}

function saveInitialHabitIfNeeded() {
  const initialHabit = buildInitialHabit();

  if (!initialHabit) {
    return;
  }

  const savedHabits = JSON.parse(localStorage.getItem("fluir-habits") || "[]");
  savedHabits.unshift(initialHabit);

  localStorage.setItem("fluir-habits", JSON.stringify(savedHabits));
}


// =============================
// 6. ENVIO DO FORMULÁRIO
// =============================

if (onboardingForm) {
  onboardingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = nomeInput.value.trim();
    const pronomes = pronomesInput.value;
    const generoNascimento = generoNascimentoInput.value;
    const altura = Number(alturaInput.value);
    const peso = Number(pesoInput.value);
    const modulos = getSelectedModules();

    if (!validatePersonalInfo() || !validateModules()) {
      return;
    }

    const selectedModules = buildSelectedModules(modulos);
    const finalWaterGoal = getFinalWaterGoal(peso);
    const waterPreference = getWaterPreference();

    const firstTask = buildInitialTask();
    const firstHabit = buildInitialHabit();

    const fluirSetup = {
      user: {
        name: nome,
        nickname: nome,
        sexAtBirth: generoNascimento,
        pronouns: pronomes,
        customPronouns: "",
        age: "",
        communicationTone: "calmo",
        height: altura,
        weight: peso,
        currentEnergy: currentEnergyInput?.value || ""
      },

      modules: selectedModules,

      preferences: {
        water: {
          dailyGoal: finalWaterGoal,
          calculatedGoal: calculateWaterGoal(peso),
          registrationMode: waterPreference
        },

        tasks: {
          currentEnergy: currentEnergyInput?.value || "",
          firstTask
        },

        habits: {
          firstHabit
        }
      },

      onboardingConcluido: true,
      atualizadoEm: new Date().toISOString()
    };

    localStorage.setItem("fluir-setup", JSON.stringify(fluirSetup));

    localStorage.setItem("fluir-onboarding", JSON.stringify({
      nome,
      pronomes,
      generoNascimento,
      altura,
      peso,
      modulos,
      metaAguaMl: finalWaterGoal,
      metaAguaCalculadaMl: calculateWaterGoal(peso),
      preferenciaAgua: waterPreference,
      energiaAtual: currentEnergyInput?.value || "",
      primeiraTarefa: firstTask,
      primeiroHabito: firstHabit,
      onboardingConcluido: true,
      atualizadoEm: new Date().toISOString()
    }));

    saveInitialTaskIfNeeded();
    saveInitialHabitIfNeeded();

    showMessage("Configuração salva com sucesso.", "success");

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 800);
  });
}


// =============================
// 7. EVENTOS
// =============================

if (nextStepBtn) {
  nextStepBtn.addEventListener("click", goToNextStep);
}

if (backStepBtn) {
  backStepBtn.addEventListener("click", goToPreviousStep);
}

if (selectAllModulesBtn) {
  selectAllModulesBtn.addEventListener("click", function () {
    setAllModulesChecked(true);
  });
}

if (clearModulesBtn) {
  clearModulesBtn.addEventListener("click", function () {
    setAllModulesChecked(false);
  });
}

document.querySelectorAll(".module-options input").forEach(function (input) {
  input.addEventListener("change", updateModuleSetupVisibility);
});

if (pesoInput) {
  pesoInput.addEventListener("input", updateCalculatedWaterText);
}


// =============================
// 8. INICIALIZAÇÃO
// =============================

updateStepView();
updateModuleSetupVisibility();