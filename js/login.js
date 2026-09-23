// =============================
// FLUIR — LOGIN E CADASTRO
// Preparado para integração com backend
// =============================


// =============================
// 1. SELEÇÃO DOS ELEMENTOS
// =============================

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const passwordButtons = document.querySelectorAll(".password-toggle");

const API_BASE_URL = "https://fluir-sistema.onrender.com/api/usuarios";

const ONBOARDING_API_BASE_URL =
  "https://fluir-sistema.onrender.com/api/onboarding";

// =============================
// 2. FUNÇÕES AUXILIARES
// =============================

function showMessage(element, message, type) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `form-message ${type}`;
}

function clearMessages() {
  showMessage(loginMessage, "", "info");
  showMessage(registerMessage, "", "info");
}

function hydrateSetupFromOnboarding(usuario, onboarding) {
  let localSetup = {};

  try {
    const salvo = JSON.parse(
      localStorage.getItem("fluir-setup") || "null"
    );

    const pertenceAoUsuario =
      salvo?.usuarioId != null &&
      String(salvo.usuarioId) === String(usuario.id);

    if (pertenceAoUsuario) {
      localSetup = salvo;
    }
  } catch (error) {
    console.warn("Erro ao ler setup local:", error);
  }

  const preferences = {
    ...(localSetup.preferences || {})
  };

  if (onboarding.tarefas) {
    preferences.tasks = onboarding.tarefas;
  }

  if (onboarding.habitos) {
    preferences.habits = onboarding.habitos;
  }

  if (onboarding.sono) {
    preferences.sleep = onboarding.sono;
  }

  if (onboarding.agua) {
    preferences.water = {
      ...(preferences.water || {}),
      dailyGoal:
        onboarding.agua.dailyGoal ||
        onboarding.agua.metaFinalMl ||
        "",
      unit: onboarding.agua.unit || "",
      reminders: onboarding.agua.reminders || "",
      reminderFrequency:
        onboarding.agua.reminderFrequency || ""
    };
  }

  if (onboarding.financas) {
    preferences.finances = onboarding.financas;
  }

  if (onboarding.diario) {
    preferences.diary = onboarding.diario;
  }

  if (onboarding.alimentacao) {
    preferences.nutrition = onboarding.alimentacao;
  }

  if (onboarding.saudeFisica) {
    preferences.physicalHealth = onboarding.saudeFisica;
  }

  if (onboarding.cicloMenstrual) {
    preferences.menstrualCycle = onboarding.cicloMenstrual;
  }

  if (onboarding.anexos) {
    preferences.attachments = onboarding.anexos;
  }

  const setup = {
    ...localSetup,
    usuarioId: usuario.id,
    onboardingConcluido:
      onboarding.onboardingConcluido === true,

    user: {
      ...(localSetup.user || {}),
      name: onboarding.nome || usuario.nome || "",
      nickname: onboarding.apelido || "",
      pronouns: onboarding.pronomes || "",
      sexAtBirth: onboarding.generoNascimento || "",
      age: onboarding.idade ?? "",
      communicationTone:
        onboarding.tomComunicacao || "calmo",
      energy: onboarding.energiaAtual || "",
      email: usuario.email || ""
    },

    modules: onboarding.modulos || {},
    preferences,
    atualizadoEm: new Date().toISOString()
  };

  localStorage.setItem(
    "fluir-setup",
    JSON.stringify(setup)
  );
}

async function hasCompletedOnboarding(usuario) {
  sessionStorage.removeItem("fluir-onboarding");

  const response = await fetch(
    `${ONBOARDING_API_BASE_URL}/usuario/${usuario.id}`,
    {
      headers: {
        Authorization: `Bearer ${usuario.token}`
      }
    }
  );

  const onboarding = await readResponse(response);

  if (response.ok) {
    const respostaValida =
      onboarding &&
      typeof onboarding.onboardingConcluido === "boolean" &&
      String(onboarding.usuarioId) === String(usuario.id);

    if (!respostaValida) {
      throw new Error(
        "Resposta inválida ao verificar o onboarding."
      );
    }

    sessionStorage.setItem(
      "fluir-onboarding",
      JSON.stringify(onboarding)
    );

    hydrateSetupFromOnboarding(
      usuario,
      onboarding
    );

    return onboarding.onboardingConcluido;
  }

  const onboardingNaoEncontrado =
    response.status === 400 &&
    onboarding.mensagem ===
      "Onboarding não encontrado para este usuário";

  if (onboardingNaoEncontrado) {
    return false;
  }

  throw new Error(
    "Não foi possível verificar o onboarding."
  );
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setButtonLoading(button, isLoading, loadingText, normalText) {
  if (!button) {
    return;
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : normalText;
}

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return {
      mensagem: text
    };
  }
}


// =============================
// 3. APLICAR TEMA SALVO
// =============================

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


// =============================
// 4. TROCAR LOGIN PARA CADASTRO
// =============================

if (showRegister && loginForm && registerForm) {
  showRegister.addEventListener("click", function (event) {
    event.preventDefault();

    clearMessages();

    loginForm.classList.remove("active");
    registerForm.classList.add("active");
  });
}


// =============================
// 5. TROCAR CADASTRO PARA LOGIN
// =============================

if (showLogin && loginForm && registerForm) {
  showLogin.addEventListener("click", function (event) {
    event.preventDefault();

    clearMessages();

    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  });
}


// =============================
// 6. ALTERAR TEMA CLARO / ESCURO
// =============================

if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    body.classList.toggle("dark");

    const isDarkMode = body.classList.contains("dark");

    themeBtn.innerHTML = isDarkMode
      ? "<span>☼</span> Claro"
      : "<span>☾</span> Escuro";

    localStorage.setItem("fluir-theme", isDarkMode ? "dark" : "light");
  });
}


// =============================
// 7. MOSTRAR / ESCONDER SENHA
// =============================

passwordButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const input = button.parentElement.querySelector(".password");

    if (!input) {
      return;
    }

    input.type = input.type === "password" ? "text" : "password";
  });
});


// =============================
// 8. ENVIO DO LOGIN
// Preparado para integração com backend Spring Boot
// =============================

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailInput = loginForm.querySelector('input[type="email"]');
    const senhaInput = loginForm.querySelector('input[type="password"]');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    const email = emailInput ? emailInput.value.trim() : "";
    const senha = senhaInput ? senhaInput.value.trim() : "";

    showMessage(loginMessage, "", "info");

    if (!email || !senha) {
      showMessage(loginMessage, "Preencha seu e-mail e sua senha para entrar.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(loginMessage, "Digite um e-mail válido.", "error");
      return;
    }

    if (senha.length < 6) {
      showMessage(loginMessage, "A senha precisa ter pelo menos 6 caracteres.", "error");
      return;
    }

    if (!API_BASE_URL) {
      showMessage(
        loginMessage,
        "Login pronto. Aguardando conexão com o backend.",
        "info"
      );
      return;
    }

    try {
      setButtonLoading(submitButton, true, "Entrando...", "Entrar");

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      });

      const data = await readResponse(response);

      if (!response.ok) {
        showMessage(
          loginMessage,
          data.mensagem || "E-mail ou senha inválidos.",
          "error"
        );
        return;
      }

      sessionStorage.removeItem("fluir-user");
      sessionStorage.setItem("fluir-onboarding-completed", "false");

      const onboardingConcluido =
        await hasCompletedOnboarding(data);

      sessionStorage.setItem("fluir-user", JSON.stringify(data));
      sessionStorage.setItem(
        "fluir-onboarding-completed",
        String(onboardingConcluido)
      );

      showMessage(loginMessage, "Login realizado com sucesso.", "success");

      setTimeout(function () {
        const destination = onboardingConcluido
          ? "dashboard.html"
          : "setup.html";

        window.location.href = destination;
      }, 700);

    } catch (error) {
      showMessage(
        loginMessage,
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
        "error"
      );
    } finally {
      setButtonLoading(submitButton, false, "Entrando...", "Entrar");
    }
  });
}


// =============================
// 9. ENVIO DO CADASTRO
// Preparado para integração com backend Spring Boot
// =============================

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nomeInput = registerForm.querySelector('input[type="text"]');
    const emailInput = registerForm.querySelector('input[type="email"]');
    const senhaInput = document.getElementById("registerPassword");
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const confirmarSenhaInput = document.getElementById("registerConfirmPassword");

    const nome = nomeInput ? nomeInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const senha = senhaInput ? senhaInput.value.trim() : "";
    const confirmarSenha = confirmarSenhaInput
      ? confirmarSenhaInput.value.trim()
      : "";

    showMessage(registerMessage, "", "info");

    if (!nome || !email || !senha || !confirmarSenha) {
      showMessage(
        registerMessage,
        "Preencha nome, e-mail, senha e confirmação de senha para criar sua conta.",
        "error"
      );
      return;
    }

    if (nome.length < 3) {
      showMessage(registerMessage, "O nome precisa ter pelo menos 3 caracteres.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(registerMessage, "Digite um e-mail válido.", "error");
      return;
    }

    if (senha.length < 6) {
      showMessage(
        registerMessage,
        "A senha precisa ter pelo menos 6 caracteres.",
        "error"
      );
      return;
    }

    if (senha !== confirmarSenha) {
      showMessage(
        registerMessage,
        "As senhas não coincidem.",
        "error"
      );
      return;
    }

    if (!API_BASE_URL) {
      showMessage(
        registerMessage,
        "Cadastro pronto. Aguardando conexão com o backend.",
        "info"
      );
      return;
    }

    try {
      setButtonLoading(submitButton, true, "Cadastrando...", "Cadastrar");

      const response = await fetch(`${API_BASE_URL}/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          senha
        })
      });

      const data = await readResponse(response);

      if (!response.ok) {
        showMessage(
          registerMessage,
          data.mensagem || "Não foi possível criar a conta.",
          "error"
        );
        return;
      }
      sessionStorage.removeItem("fluir-onboarding");
      sessionStorage.setItem("fluir-onboarding-completed", "false");
      sessionStorage.setItem("fluir-user", JSON.stringify(data));

      showMessage(
        registerMessage,
        data.mensagem || "Conta criada com sucesso.",
        "success"
      );

      registerForm.reset();

      setTimeout(function () {
        window.location.href = "setup.html";
      }, 700);

      } catch (error) {
      showMessage(
        registerMessage,
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
        "error"
      );
    } finally {
      setButtonLoading(submitButton, false, "Cadastrando...", "Cadastrar");
    }
  });
}


// =============================
// 10. INICIALIZAÇÃO
// =============================

applySavedTheme();