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
  let providerTimer = null;
  function clearProviderTimer() {
    if (providerTimer !== null) clearTimeout(providerTimer);
    providerTimer = null;
  }
  function providerStarted() {
    clearProviderTimer();
    message("Conclua a escolha da conta na janela do Google.");
    providerTimer = setTimeout(() => {
      providerTimer = null;
      if (!busy) message("O Google ainda não retornou a confirmação. Volte ao Fluir e tente novamente ou entre com e-mail e senha.", true);
    }, 60000);
  }

  function message(value, error = false) {
    if (isProfile) {
      const status = document.getElementById("googleLinkMessage");
      if (status) {
        status.textContent = window.FluirI18n.t(value);
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
    window.FluirRemember?.cancel();
    if (busy) return;
    clearProviderTimer();
    if (!result?.credential || typeof result.credential !== "string") {
      message("O Google não retornou uma identidade válida.", true);
      return;
    }
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
        window.dispatchEvent(new Event("fluir:google-linked"));
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
      if (!FluirStorage.getItem("fluir-language") && ["en-US","es"].includes(sessionStorage.getItem("fluir-guest-locale"))) FluirStorage.setItem("fluir-language",sessionStorage.getItem("fluir-guest-locale"));
      sessionStorage.removeItem("fluir-onboarding-completed");
      try {
        const completed = await hasCompletedOnboarding(data);
        await completeAuthenticatedLogin(completed);
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

  async function initializeNativeGoogle(clientId) {
    const plugin = window.Capacitor?.Plugins?.GoogleSignIn;
    if (!plugin || typeof plugin.initialize !== "function" || typeof plugin.signIn !== "function") {
      message("O login Google nativo não está disponível nesta versão. Use e-mail e senha ou a versão web.", true);
      return;
    }
    await plugin.initialize({ clientId });
    const tr = value => window.FluirI18n?.t?.(value) || value;
    const buttons = [];
    let nativeBusy = false;
    for (const mount of [loginTarget, registerTarget, linkTarget].filter(Boolean)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "fluir-native-google-button";
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox","0 0 48 48");icon.setAttribute("aria-hidden","true");icon.setAttribute("width","20");icon.setAttribute("height","20");
      for(const [fill,d] of [
        ["#4285F4","M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24v7.42h11.04c-.48 2.45-1.86 4.53-3.93 5.92v4.92h6.36c3.72-3.43 6.14-8.47 6.14-14.34z"],
        ["#34A853","M24 44c5.34 0 9.82-1.77 13.09-4.8l-6.36-4.92c-1.76 1.18-4.02 1.88-6.73 1.88-5.16 0-9.53-3.48-11.1-8.16H6.34v5.08A20 20 0 0 0 24 44z"],
        ["#FBBC05","M12.9 28a12 12 0 0 1 0-8v-5.08H6.34a20 20 0 0 0 0 18.16L12.9 28z"],
        ["#EA4335","M24 11.84c2.91 0 5.52 1 7.58 2.96l5.69-5.69A19.2 19.2 0 0 0 24 4 20 20 0 0 0 6.34 14.92L12.9 20C14.47 15.32 18.84 11.84 24 11.84z"]
      ]){const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("fill",fill);p.setAttribute("d",d);icon.append(p);}
      const label=document.createElement("span");label.textContent=tr(isProfile ? "Vincular conta Google" : mount === registerTarget ? "Cadastrar com Google" : "Entrar com Google");
      button.append(icon,label);
      button.addEventListener("click", async () => {
        if (nativeBusy || busy) return;
        nativeBusy = true;
        buttons.forEach(item => { item.disabled = true; });
        try {
          const result = await plugin.signIn();
          if (typeof result?.idToken !== "string" || !result.idToken) {
            message(tr("O Google não retornou uma identidade válida."), true);
            return;
          }
          await credentialReceived({ credential: result.idToken });
        } catch (error) {
          // Do not expose credential material or raw provider errors.
          message(tr("Não foi possível concluir o login Google no aplicativo. Tente novamente ou use a versão web."), true);
        } finally {
          nativeBusy = false;
          buttons.forEach(item => { item.disabled = false; });
        }
      });
      buttons.push(button);
      mount.replaceChildren(button);
      mount.hidden = false;
    }
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
        const status = await fetch(base.replace(/\/usuarios$/, "/conta/seguranca"), {headers:{Authorization:"Bearer "+current.token},cache:"no-store"});
        if (!status.ok || (await status.json()).google?.vinculado !== false) return;
      }
      // Google web sign-in is not supported inside an Android WebView.
      // The native SDK obtains an ID token for the same web client audience.
      if (window.Capacitor?.getPlatform?.() === "android") {
        await initializeNativeGoogle(data.clientId);
        return;
      }
      await loadGoogleScript();
      window.google.accounts.id.initialize({
        client_id: data.clientId,
        ux_mode: "popup",
        auto_select: false,
        use_fedcm_for_button: true,
        button_auto_select: false,
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
          locale: window.FluirI18n.language==="en-US"?"en":window.FluirI18n.language==="es"?"es":"pt_BR",
          logo_alignment: "left",
          click_listener: providerStarted,
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