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

const API_BASE_URL = "https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api/usuarios";

const ONBOARDING_API_BASE_URL =
  "https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api/onboarding";

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


// A API pode ficar indisponível durante inicialização do Render.
// Impede carregamento interminável e preserva as credenciais digitadas.
async function fetchWithDeadline(url, options, timeoutMs = 25000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      const timedOut = new Error("O servidor demorou mais do que o limite de espera.");
      timedOut.code = "API_TIMEOUT";
      throw timedOut;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function hasCompletedOnboarding(usuario) {
  sessionStorage.removeItem("fluir-onboarding");

  const response = await fetchWithDeadline(
    `${ONBOARDING_API_BASE_URL}/usuario/${usuario.id}`,
    {
      headers: {
        Authorization: `Bearer ${usuario.token}`
      }
    },
    18000
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

  if (response.status === 401) {
    const error = new Error("Sessão rejeitada pelo servidor.");
    error.code = "AUTH_REJECTED";
    throw error;
  }
  throw new Error("Não foi possível consultar o onboarding (HTTP " + response.status + ").");
}

// Uma falha de preferências não torna inválido o token emitido pelo login.
// Permitir tentar a consulta novamente SEM reenviar e-mail/senha ou criar novo token.
let retryOnboardingButton = null;
function clearVerificationRetry() {
  retryOnboardingButton?.remove();
  retryOnboardingButton = null;
}
function completeAuthenticatedLogin(completed) {
  clearVerificationRetry();
  sessionStorage.setItem("fluir-onboarding-completed", String(completed));
  showMessage(loginMessage, "Login realizado com sucesso.", "success");
  window.FluirTransition.navigate(
    completed ? "dashboard.html" : "setup.html",
    "Entrando no Fluir...",
    "Carregando sua experiência personalizada."
  );
}
function showVerificationRetry(usuario) {
  clearVerificationRetry();
  retryOnboardingButton = document.createElement("button");
  retryOnboardingButton.type = "button";
  retryOnboardingButton.className = "secondary";
  retryOnboardingButton.textContent = "Tentar carregar preferências novamente";
  loginMessage.insertAdjacentElement("afterend", retryOnboardingButton);
  retryOnboardingButton.addEventListener("click", async () => {
    retryOnboardingButton.disabled = true;
    try {
      const current = JSON.parse(sessionStorage.getItem("fluir-user") || "null");
      if (!current || current.id !== usuario.id || current.token !== usuario.token) {
        clearVerificationRetry();
        showMessage(loginMessage, "Entre novamente para continuar.", "error");
        return;
      }
      const completed = await hasCompletedOnboarding(usuario);
      completeAuthenticatedLogin(completed);
    } catch (error) {
      if (error?.code === "AUTH_REJECTED") {
        sessionStorage.removeItem("fluir-user");
        sessionStorage.removeItem("fluir-onboarding");
        clearVerificationRetry();
        showMessage(loginMessage, "Sessão rejeitada pelo servidor. Faça login novamente.", "error");
      } else {
        showMessage(loginMessage,
          "Ainda não foi possível consultar as preferências. Sua sessão foi mantida; tente novamente.", "error");
      }
    } finally {
      if (retryOnboardingButton) retryOnboardingButton.disabled = false;
    }
  });
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

let loginPending = false;
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (loginPending) return;

    const emailInput = loginForm.querySelector('input[type="email"]');
    const senhaInput = loginForm.querySelector('input[type="password"]');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    const email = emailInput ? emailInput.value.trim() : "";
    const senha = senhaInput ? senhaInput.value.trim() : "";

    clearVerificationRetry();
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

    loginPending = true;
    const slowNotice = setTimeout(() => {
      showMessage(loginMessage,
        "O servidor está demorando a responder. Você pode aguardar; a tentativa será encerrada se exceder o limite.",
        "info");
    }, 6500);
    try {
      setButtonLoading(submitButton, true, "Entrando...", "Entrar");

      const response = await fetchWithDeadline(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      }, 28000);

      const data = await readResponse(response);

      if (!response.ok) {
        showMessage(
          loginMessage,
          data.mensagem || "E-mail ou senha inválidos.",
          "error"
        );
        return;
      }

      if (!data || !data.id || typeof data.token !== "string" || !data.token.trim()) {
        showMessage(loginMessage, "O servidor não enviou uma sessão válida.", "error");
        return;
      }

      // A consulta de onboarding é autenticada; a sessão deve existir antes dela.
      sessionStorage.setItem("fluir-user", JSON.stringify(data));
      sessionStorage.removeItem("fluir-onboarding-completed");

      let onboardingConcluido;
      try {
        onboardingConcluido = await hasCompletedOnboarding(data);
      } catch (validationError) {
        // 401 rejeita a sessão. CORS, timeout e 503 não justificam removê-la.
        if (validationError?.code === "AUTH_REJECTED") {
          sessionStorage.removeItem("fluir-user");
          sessionStorage.removeItem("fluir-onboarding");
          showMessage(loginMessage, "Sessão rejeitada pelo servidor. Faça login novamente.", "error");
        } else {
          showMessage(loginMessage,
            "Login confirmado, mas não foi possível consultar suas preferências. Sua sessão foi mantida.",
            "error");
          showVerificationRetry(data);
        }
        return;
      }
      completeAuthenticatedLogin(onboardingConcluido);

    } catch (error) {
      showMessage(
        loginMessage,
        error?.code === "API_TIMEOUT"
          ? "O servidor demorou demais para responder. Nenhuma informação foi apagada; tente novamente."
          : "Não foi possível conectar ao servidor. Confira a rede e se esta versão está autorizada na API.",
        "error"
      );
    } finally {
      clearTimeout(slowNotice);
      loginPending = false;
      setButtonLoading(submitButton, false, "Entrando...", "Entrar");
    }
  });
}


// =============================
// 9. ENVIO DO CADASTRO
// Preparado para integração com backend Spring Boot
// =============================

let registrationPending = false;
if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (registrationPending) return;

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

    if (senha.length < 8) {
      showMessage(
        registerMessage,
        "A senha precisa ter pelo menos 8 caracteres.",
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

    let redirecting = false;
    registrationPending = true;
    const slowNotice = setTimeout(() => {
      window.FluirTransition.update(
        "Servidor iniciando...",
        "O cadastro está demorando. Se não responder, você poderá tentar novamente.");
    }, 6500);
    try {
      setButtonLoading(submitButton, true, "Cadastrando...", "Cadastrar");
      window.FluirTransition.show("Criando sua conta...", "Estamos preparando seu acesso ao Fluir.");

      const response = await fetchWithDeadline(`${API_BASE_URL}/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          senha
        })
      }, 28000);

      const data = await readResponse(response);

      if (!response.ok) {
        showMessage(
          registerMessage,
          data.mensagem || "Não foi possível criar a conta.",
          "error"
        );
        return;
      }
      if (!data?.id || typeof data.token !== "string" || !data.token.trim()) {
        showMessage(registerMessage, "O cadastro foi recebido, mas o servidor não retornou uma sessão válida.", "error");
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

      redirecting = true;
      window.FluirTransition.navigate(
        "setup.html",
        "Conta criada!",
        "Abrindo a configuração inicial do Fluir."
      );

      } catch (error) {
      showMessage(
        registerMessage,
        error?.code === "API_TIMEOUT"
          ? "O cadastro demorou para responder. Verifique se sua conta foi criada antes de tentar novamente."
          : "Não foi possível conectar ao servidor. Confira a rede e se esta prévia está autorizada na API.",
        "error"
      );
    } finally {
      clearTimeout(slowNotice);
      if (!redirecting) {
        registrationPending = false;
        window.FluirTransition.hide();
        setButtonLoading(submitButton, false, "Cadastrando...", "Cadastrar");
      }
    }
  });
}


// =============================
// 10. INICIALIZAÇÃO
// =============================

applySavedTheme();