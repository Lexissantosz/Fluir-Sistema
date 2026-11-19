/* Fluir: login Google opcional, habilitado somente com OAuth configurado no backend.
   Android: Google Credential Manager via plugin NATIVO; nunca abrir OAuth em WebView.
   Web/iPhone PWA: Google Identity Services oficial. */
(function () {
  "use strict";

  const API = "https://fluir-sistema.onrender.com/api/usuarios";
  const slots = Array.from(document.querySelectorAll("[data-google-auth]"));
  if (!slots.length) return;

  function setMessage(slot, message) {
    const target = slot.querySelector(".google-auth-message");
    if (target) target.textContent = message || "";
  }

  async function request(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90000);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  async function readJson(response) {
    const text = await response.text();
    try { return text ? JSON.parse(text) : {}; }
    catch { return { mensagem: text }; }
  }

  async function exchangeToken(idToken, slot) {
    if (!idToken || typeof idToken !== "string") {
      throw new Error("Não recebemos uma credencial válida do Google.");
    }
    setMessage(slot, "Validando sua conta Google no Fluir...");
    const response = await request(API + "/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });
    const data = await readJson(response);
    if (!response.ok) {
      throw new Error(data.mensagem || "Não foi possível autenticar com Google.");
    }
    if (!window.FluirAuth || typeof window.FluirAuth.completeGoogleLogin !== "function") {
      throw new Error("O fluxo de autenticação não está disponível.");
    }
    await window.FluirAuth.completeGoogleLogin(data);
  }

  const capacitor = window.Capacitor;
  const native = capacitor && (
    (typeof capacitor.isNativePlatform === "function" && capacitor.isNativePlatform()) ||
    (typeof capacitor.getPlatform === "function" && capacitor.getPlatform() !== "web")
  );

  async function activateNative(clientId) {
    const plugin = window.Capacitor?.Plugins?.GoogleSignIn;
    if (!plugin) {
      for (const slot of slots) {
        slot.hidden = false;
        setMessage(slot, "Atualize o aplicativo para ativar o login Google.");
      }
      return;
    }
    try {
      await plugin.initialize({ clientId });
    } catch (error) {
      console.warn("Google nativo indisponível:", error);
      return;
    }
    for (const slot of slots) {
      slot.hidden = false;
      const holder = slot.querySelector(".google-auth-button");
      if (!holder) continue;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "google-auth-native";
      button.textContent = "Continuar com Google";
      button.addEventListener("click", async function () {
        button.disabled = true;
        try {
          setMessage(slot, "Abrindo sua conta Google...");
          const result = await plugin.signIn();
          await exchangeToken(result?.idToken, slot);
        } catch (error) {
          setMessage(slot, error?.name === "AbortError" ?
            "O servidor demorou para responder. Tente novamente." :
            (error?.message || "Não foi possível concluir o login Google."));
        } finally {
          button.disabled = false;
        }
      });
      holder.appendChild(button);
    }
  }

  function loadGis() {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) { resolve(); return; }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Não foi possível carregar o login Google."));
      document.head.appendChild(script);
    });
  }

  async function activateWeb(clientId) {
    await loadGis();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        // O Google retorna uma credencial; o backend é quem valida sua assinatura.
        const slot = slots.find((item) => !item.closest("form") ||
          item.closest("form").classList.contains("active")) || slots[0];
        try { await exchangeToken(credential, slot); }
        catch (error) { setMessage(slot, error.message || "Falha no login Google."); }
      }
    });
    for (const slot of slots) {
      slot.hidden = false;
      const holder = slot.querySelector(".google-auth-button");
      if (holder) window.google.accounts.id.renderButton(holder, {
        theme: "outline", size: "large", shape: "pill", text: "continue_with", width: 260
      });
    }
  }

  async function initialize() {
    try {
      // Se Render não estiver configurado, nenhuma opção decorativa aparece.
      const response = await request(API + "/google/config");
      if (!response.ok) return;
      const config = await readJson(response);
      if (config.habilitado !== true || !config.clientId) return;
      if (native) await activateNative(config.clientId);
      else await activateWeb(config.clientId);
    } catch (error) {
      // Login convencional continua disponível mesmo quando Google falha.
      console.info("Google Sign-In indisponível nesta sessão.");
    }
  }

  initialize();
})();
