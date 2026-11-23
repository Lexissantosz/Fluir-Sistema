(function () {
  "use strict";
  // O WebView nativo do Capacitor não precisa do Service Worker da PWA.
  if (window.Capacitor?.isNativePlatform?.()) return;
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
      .catch(function (error) {
        console.warn("Fluir PWA: registro offline indisponível.", error);
      });
  });
})();
