/* Fluir PWA: somente na web; o APK usa o WebView nativo do Capacitor. */
(function () {
  if (!("serviceWorker" in navigator)) return;
  if (window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform()) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js", { scope: "/" }).catch(function (error) {
      console.warn("Fluir PWA: service worker indisponivel.", error);
    });
  });
})();
