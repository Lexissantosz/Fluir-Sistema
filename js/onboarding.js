// =============================
// FLUIR — ONBOARDING
// Configuração inicial do usuário
// =============================


// =============================
// 1. SELEÇÃO DOS ELEMENTOS
// =============================

const onboardingForm = document.getElementById("onboardingForm");
const onboardingMessage = document.getElementById("onboardingMessage");

const nomeInput = document.getElementById("nome");
const pronomesInput = document.getElementById("pronomes");
const generoNascimentoInput = document.getElementById("generoNascimento");
const alturaInput = document.getElementById("altura");
const pesoInput = document.getElementById("peso");
const selectAllModulesBtn = document.getElementById("selectAllModules");
const clearModulesBtn = document.getElementById("clearModules");


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

function getSelectedModules() {
  const checkedModules = document.querySelectorAll(".module-options input:checked");

  return Array.from(checkedModules).map(function (input) {
    return input.value;
  });
}

function calculateWaterGoal(peso) {
  return Math.round(peso * 35);
}

function setAllModulesChecked(isChecked) {
  const moduleInputs = document.querySelectorAll(".module-options input");

  moduleInputs.forEach(function (input) {
    input.checked = isChecked;
  });
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


// =============================
// 3. ENVIO DO FORMULÁRIO
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

    if (!nome || !pronomes || !generoNascimento || !altura || !peso) {
      showMessage("Preencha todos os dados básicos antes de continuar.", "error");
      return;
    }

    if (nome.length < 3) {
      showMessage("O nome precisa ter pelo menos 3 caracteres.", "error");
      return;
    }

    if (altura < 50 || altura > 250) {
      showMessage("Digite uma altura válida em centímetros.", "error");
      return;
    }

    if (peso < 20 || peso > 300) {
      showMessage("Digite um peso válido em kg.", "error");
      return;
    }

    if (modulos.length === 0) {
      showMessage("Escolha pelo menos um módulo para começar.", "error");
      return;
    }

    const selectedModules = {
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
    weight: peso
  },

  modules: selectedModules,

  preferences: {
    water: {
      dailyGoal: calculateWaterGoal(peso)
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
  metaAguaMl: calculateWaterGoal(peso),
  onboardingConcluido: true,
  atualizadoEm: new Date().toISOString()
}));

    showMessage("Configuração salva com sucesso.", "success");

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 800);
  });
}