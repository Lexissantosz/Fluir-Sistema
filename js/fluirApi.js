/* ===================================================== */
/* FLUIR API — CAMADA DE DADOS COMPARTILHADA              */
/* Hoje fala com localStorage. Quando o backend estiver   */
/* pronto, só o "miolo" destas funções muda — nenhum      */
/* outro arquivo (water.js, habits.js, etc.) precisa ser  */
/* alterado.                                               */
/* ===================================================== */

const FluirAPI = {

  // ---------------------------------------------------
  // GENÉRICO: ler/gravar JSON no localStorage com segurança
  // ---------------------------------------------------
  _getJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`Erro ao ler ${key}:`, error);
      return fallback;
    }
  },

  _setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // ---------------------------------------------------
  // SETUP (perfil do usuário + módulos ativos)
  // ---------------------------------------------------
  getSetup(defaultSetup) {
    return this._getJSON("fluir-setup", defaultSetup);
  },

  saveSetup(setupData) {
    setupData.atualizadoEm = new Date().toISOString();
    this._setJSON("fluir-setup", setupData);
  },

  // ---------------------------------------------------
  // TEMA (claro/escuro)
  // ---------------------------------------------------
  getTheme() {
    return localStorage.getItem("fluir-theme") || "light";
  },

  saveTheme(theme) {
    localStorage.setItem("fluir-theme", theme);
  },

  // ---------------------------------------------------
  // TIMELINE (eventos de todos os módulos)
  // ---------------------------------------------------
  getTimelineEvents() {
    return this._getJSON("fluir-timeline-events", []);
  },

  saveTimelineEvent(eventData) {
    const savedEvents = this.getTimelineEvents();
    savedEvents.unshift(eventData);
    this._setJSON("fluir-timeline-events", savedEvents);
  }

};