// =============================
// FLUIR — LOGIN E CADASTRO
// JavaScript puro, protegido e comentado
// =============================


// =============================
// 1. SELEÇÃO DOS ELEMENTOS
// =============================

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const passwordButtons = document.querySelectorAll(".password-toggle");


// =============================
// 2. APLICAR TEMA SALVO
// Agora o login/cadastro apenas aplica o tema salvo.
// A troca principal de tema fica em settings.html.
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
// 3. TROCAR LOGIN PARA CADASTRO
// =============================

if (showRegister && loginForm && registerForm) {
  showRegister.addEventListener("click", () => {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
  });
}


// =============================
// 4. TROCAR CADASTRO PARA LOGIN
// =============================

if (showLogin && loginForm && registerForm) {
  showLogin.addEventListener("click", () => {
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  });
}


// =====================================================
// 5. ALTERAR TEMA CLARO / ESCURO
// Mantido protegido caso o botão volte futuramente.
// Se o botão não existir no HTML, o JS não quebra.
// =====================================================

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


// =============================
// 6. MOSTRAR / ESCONDER SENHA
// =============================

passwordButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.parentElement.querySelector(".password");

    if (!input) {
      return;
    }

    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  });
});


// =============================
// 7. ENVIO DO LOGIN
// Depois conectaremos com o backend Spring Boot
// =============================

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = loginForm.querySelector('input[type="email"]');
    const senha = loginForm.querySelector('input[type="password"]');

    if (!email.value.trim() || !senha.value.trim()) {
      alert("Preencha seu e-mail e sua senha para entrar.");
      return;
    }

    if (senha.value.length < 6) {
      alert("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    alert("Login pronto para integração com o banco de dados.");
  });
}


// =============================
// 8. ENVIO DO CADASTRO
// Depois conectaremos com o backend Spring Boot
// =============================

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = registerForm.querySelector('input[type="text"]');
    const email = registerForm.querySelector('input[type="email"]');
    const senha = registerForm.querySelector('input[type="password"]');

    if (!nome.value.trim() || !email.value.trim() || !senha.value.trim()) {
      alert("Preencha nome, e-mail e senha para criar sua conta.");
      return;
    }

    if (senha.value.length < 6) {
      alert("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    alert("Cadastro pronto para integração com o banco de dados.");
  });
}


// =============================
// 9. INICIALIZAÇÃO
// =============================

applySavedTheme();