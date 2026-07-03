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

// Quando o backend estiver pronto, troque para:
// const API_BASE_URL = "http://localhost:8080/api/usuarios";
const API_BASE_URL = "";


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

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          loginMessage,
          data.mensagem || "E-mail ou senha inválidos.",
          "error"
        );
        return;
      }

      sessionStorage.setItem("fluir-user", JSON.stringify(data.usuario));

      showMessage(loginMessage, "Login realizado com sucesso.", "success");

      setTimeout(function () {
        window.location.href = "dashboard.html";
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
    const senhaInput = registerForm.querySelector('input[type="password"]');
    const submitButton = registerForm.querySelector('button[type="submit"]');

    const nome = nomeInput ? nomeInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const senha = senhaInput ? senhaInput.value.trim() : "";

    showMessage(registerMessage, "", "info");

    if (!nome || !email || !senha) {
      showMessage(
        registerMessage,
        "Preencha nome, e-mail e senha para criar sua conta.",
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

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          registerMessage,
          data.mensagem || "Não foi possível criar a conta.",
          "error"
        );
        return;
      }

      showMessage(
        registerMessage,
        data.mensagem || "Conta criada com sucesso. Faça login para continuar.",
        "success"
      );

      registerForm.reset();

      setTimeout(function () {
        registerForm.classList.remove("active");
        loginForm.classList.add("active");
        showMessage(loginMessage, "Conta criada. Agora faça login.", "success");
      }, 900);
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