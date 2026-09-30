/* =====================================================
   FLUIR — CATÁLOGO DE ÁREAS DO SISTEMA

   Fonte única de verdade para:
   - identificação das áreas;
   - ordem de navegação;
   - nomes exibidos;
   - rotas;
   - distinção entre áreas globais e módulos opcionais.

   Este arquivo NÃO armazena preferências do usuário.
   Ele descreve apenas a estrutura do produto.
   ===================================================== */

(() => {
  "use strict";

  const SECTION_TYPES = Object.freeze({
    CORE: "core",
    MODULE: "module"
  });

  const sections = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "dashboard.html",
      type: SECTION_TYPES.CORE
    },
    {
      key: "timeline",
      label: "Timeline",
      href: "timeline.html",
      type: SECTION_TYPES.CORE
    },
    {
      key: "tasks",
      label: "Tarefas",
      href: "tasks.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "habits",
      label: "Hábitos",
      href: "habits.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "sleep",
      label: "Sono",
      href: "sleep.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "water",
      label: "Água",
      href: "water.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "finances",
      label: "Finanças",
      href: "finances.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "diary",
      label: "Diário emocional",
      href: "diary.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "nutrition",
      label: "Alimentação",
      href: "nutrition.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "physicalHealth",
      label: "Saúde física",
      href: "physical-health.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "menstrualCycle",
      label: "Ciclo menstrual",
      href: "menstrual-cycle.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "attachments",
      label: "Anexos",
      href: "attachments.html",
      type: SECTION_TYPES.MODULE
    },
    {
      key: "achievements",
      label: "Conquistas",
      href: "achievements.html",
      type: SECTION_TYPES.CORE
    },
    {
      key: "settings",
      label: "Configurações",
      href: "settings.html",
      type: SECTION_TYPES.CORE
    },
    {
      key: "profile",
      label: "Perfil",
      href: "profile.html",
      type: SECTION_TYPES.CORE
    },
    {
      key: "plans",
      label: "Planos e preços",
      href: "plans.html",
      type: SECTION_TYPES.CORE
    }
  ];

  const frozenSections = Object.freeze(
    sections.map((section) => Object.freeze({ ...section }))
  );

  function getAll() {
    return frozenSections;
  }

  function getModules() {
    return frozenSections.filter(
      (section) => section.type === SECTION_TYPES.MODULE
    );
  }

  function getCoreSections() {
    return frozenSections.filter(
      (section) => section.type === SECTION_TYPES.CORE
    );
  }

  function getByKey(key) {
    return frozenSections.find(
      (section) => section.key === key
    ) || null;
  }

  function getByHref(href) {
    return frozenSections.find(
      (section) => section.href === href
    ) || null;
  }

  window.FluirSections = Object.freeze({
    TYPES: SECTION_TYPES,
    getAll,
    getModules,
    getCoreSections,
    getByKey,
    getByHref
  });
})();