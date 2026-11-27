/* Account-scoped browser data. Old unowned keys are never imported or deleted. */
(function () {
  "use strict";
  const raw = window.localStorage;
  function accountId() {
    try {
      const user = JSON.parse(sessionStorage.getItem("fluir-user") || "null");
      const id = String(user?.id ?? "");
      return /^[1-9][0-9]*$/.test(id) && typeof user?.token === "string" && user.token.length >= 20 ? id : null;
    } catch { return null; }
  }
  function scopeKey(key) {
    const id = accountId();
    if (id) return "fluir:account:" + id + ":" + String(key);
    return key === "fluir-theme" ? "fluir:guest:fluir-theme" : null;
  }
  window.FluirStorage = Object.freeze({
    accountId,
    getItem(key) {
      const scoped = scopeKey(key);
      return scoped === null ? null : raw.getItem(scoped);
    },
    setItem(key, value) {
      const scoped = scopeKey(key);
      if (scoped === null) throw new Error("No authenticated account for this storage operation");
      raw.setItem(scoped, value);
    },
    removeItem(key) {
      const scoped = scopeKey(key);
      if (scoped !== null) raw.removeItem(scoped);
    },
    databaseName(name) {
      const id = accountId();
      if (!id) throw new Error("No authenticated account for this database");
      return "fluir:account:" + id + ":" + name;
    }
  });
  const page = location.pathname.split("/").pop();
  const protectedPages = new Set(["setup.html","dashboard.html","timeline.html","tasks.html","habits.html","sleep.html","water.html","finances.html","diary.html","nutrition.html","physical-health.html","menstrual-cycle.html","attachments.html","achievements.html","settings.html","profile.html","plans.html"]);
  if (protectedPages.has(page) && !accountId()) location.replace("login.html");
})();