/* Ajustes visuais apenas no pacote nativo, mantendo a landing e login web originais. */
(function () {
  const cap = window.Capacitor;
  if (!cap) return;
  const native = typeof cap.isNativePlatform === "function"
    ? cap.isNativePlatform() : typeof cap.getPlatform === "function" && cap.getPlatform() !== "web";
  if (native) document.documentElement.classList.add("fluir-native-android");
})();
