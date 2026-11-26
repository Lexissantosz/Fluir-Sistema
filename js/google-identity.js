/* Google Identity Services do Fluir.
 * Só carrega o botão quando existe um Client ID configurado no Supabase.
 * O token de identidade é enviado exclusivamente à Edge Function para validação.
 * Não usar token OAuth de acesso, nem copiar credenciais para localStorage.
 */
(function () {
  "use strict";

  const base = "https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api/usuarios";
  const loginTarget = document.getElementById("googleLoginMount");
  const registerTarget = document.getElementById("googleRegisterMount");
  const linkTarget = document.getElementById("googleProfileMount");
  if (!loginTarget && !registerTarget && !linkTarget) return;

  const isProfile = Boolean(linkTarget);
  let busy = false;

  function message(value, error = false) {
    if (isProfile) {
      const status = document.getElementById("googleLinkMessage");
      if (status) {
        status.textContent = value;
        status.dataset.state = error ? "error" : "success";
      }
    } else if (typeof showMessage === "function") {
      const onRegister = document.getElementById("registerForm")?.classList.contains("active");
      showMessage(onRegister ? registerMessage : loginMessage, value, error ? "error" : "info");
    }
  }

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch(base + path, { ...options, cache: "no-store", signal: controller.signal });
      const data = await response.json().catch(() => ({}));
      return { response, data };
    } finally {
      clearTimeout(timeout);
    }
  }

  async function credentialReceived(result) {
    if (busy || !result?.credential || typeof result.credential !== "string") return;
    busy = true;
    try {
      if (isProfile) {
        const saved = JSON.parse(sessionStorage.getItem("fluir-user") || "null");
        if (!saved?.id || !saved?.token) {
          message("Entre na sua conta do Fluir antes de vincular o Google.", true);
          return;
        }
        message("Vinculando sua conta Google...");
        const { response, data } = await request("/google/vincular", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + saved.token },
          body: JSON.stringify({ idToken: result.credential })
        });
        if (!response.ok || !data?.token || data.id !== saved.id) {
          message(data.mensagem || "Não foi possível vincular a conta. Use o mesmo e-mail do Fluir.", true);
          return;
        }
        sessionStorage.setItem("fluir-user", JSON.stringify({ ...saved, ...data }));
        message("Conta Google vinculada com segurança. Você já pode entrar com o Google.");
        linkTarget.hidden = true;
        return;
      }

      message("Confirmando a conta Google...");
      const { response, data } = await request("/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: result.credential })
      });
      if (!response.ok) {
        if (response.status === 409) {
          const isRegister = registerTarget?.closest("form")?.classList.contains("active");
          message(isRegister
            ? "Este e-mail já tem uma conta no Fluir. Escolha outra conta Google para cadastrar ou entre com sua senha e vincule o Google no Perfil."
            : "Este e-mail já tem uma conta no Fluir. Entre com sua senha uma vez e vincule o Google no Perfil para os próximos acessos.", true);
        } else {
          message(data.mensagem || "O Google não pôde autenticar sua conta.", true);
        }
        return;
      }
      if (!data?.id || typeof data.token !== "string" || data.token.length < 20) {
        message("O servidor não retornou uma sessão válida.", true);
        return;
      }
      sessionStorage.setItem("fluir-user", JSON.stringify(data));
      sessionStorage.removeItem("fluir-onboarding-completed");
      try {
        const completed = await hasCompletedOnboarding(data);
        completeAuthenticatedLogin(completed);
      } catch (error) {
        if (error?.code === "AUTH_REJECTED") {
          sessionStorage.removeItem("fluir-user");
          message("Sessão rejeitada pelo servidor. Tente entrar novamente.", true);
        } else {
          message("Conta Google confirmada, mas não foi possível consultar suas preferências.", true);
          if (typeof showVerificationRetry === "function") showVerificationRetry(data);
        }
      }
    } catch (error) {
      message(error?.name === "AbortError"
        ? "O login Google demorou demais. Tente novamente."
        : "Não foi possível acessar o Google agora. Verifique sua conexão.", true);
    } finally {
      busy = false;
    }
  }

  function loadGoogleScript() {
    if (window.google?.accounts?.id) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const tag = document.createElement("script");
      tag.src = "https://accounts.google.com/gsi/client";
      tag.async = true;
      tag.defer = true;
      tag.onload = () => window.google?.accounts?.id ? resolve() : reject(new Error("Google não carregou"));
      tag.onerror = () => reject(new Error("Biblioteca Google indisponível"));
      document.head.appendChild(tag);
    });
  }

  async function initialize() {
    try {
      const { response, data } = await request("/google/config");
      if (!response.ok || data.habilitado !== true ||
          typeof data.clientId !== "string" ||
          !/^[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(data.clientId)) return;
      if (isProfile) {
        const current = JSON.parse(sessionStorage.getItem("fluir-user") || "null");
        if (!current?.token) return;
      }
      await loadGoogleScript();
      window.google.accounts.id.initialize({
        client_id: data.clientId,
        ux_mode: "popup",
        auto_select: false,
        callback: credentialReceived
      });
      const mounts = [loginTarget, registerTarget, linkTarget].filter(Boolean);
      const renderedWidths = new WeakMap();
      function render(mount) {
        const available = mount.clientWidth || loginTarget?.clientWidth ||
          registerTarget?.clientWidth || 280;
        const width = Math.min(400, Math.floor(available));
        if (width <= 0 || renderedWidths.get(mount) === width) return;
        renderedWidths.set(mount, width);
        mount.replaceChildren();
        window.google.accounts.id.renderButton(mount, {
          type: "standard", theme: "outline", size: "large",
          shape: "rectangular",
          text: isProfile ? "continue_with" :
            mount === registerTarget ? "signup_with" : "signin_with",
          logo_alignment: "left",
          width: String(width)
        });
      }
      for (const mount of mounts) {
        mount.hidden = false;
        render(mount);
      }
      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(entries => {
          for (const entry of entries) {
            if (entry.target.clientWidth > 0) render(entry.target);
          }
        });
        mounts.forEach(mount => observer.observe(mount));
      }
    } catch (error) {
      // Não bloquear o acesso normal por e-mail e senha quando o Google falhar.
      if (isProfile) message("Login Google temporariamente indisponível.", true);
    }
  }
  initialize();
})();