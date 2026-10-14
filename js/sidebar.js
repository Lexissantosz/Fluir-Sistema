/* =====================================================
   FLUIR — SIDEBAR DESKTOP COMPARTILHADA

   Responsabilidades:
   - renderizar a marca;
   - renderizar a navegação desktop;
   - renderizar a ilustração compartilhada;
   - identificar a página atual.

   O card contextual inferior continua pertencendo
   a cada página.
   ===================================================== */

(() => {
  "use strict";

  function sidebarT(key, fallback) {
    return window.FluirI18n
      ? window.FluirI18n.t(key, fallback)
      : fallback;
  }

  function getCurrentPage() {
    const fileName = window.location.pathname.split("/").pop();

    return fileName || "dashboard.html";
  }

  function renderBrand() {
    return `
      <div class="brand">
        <div class="brand-icon" aria-hidden="true">
          <img
            src="../Assets/brand/fluir-symbol.svg"
            alt=""
            class="brand-symbol"
          />
        </div>

        <div>
          <h1>Fluir</h1>
          <p data-i18n="sidebar.tagline">${sidebarT("sidebar.tagline", "Sistema de Organização da Vida")}</p>
        </div>
      </div>
    `;
  }

  function getActiveModuleKeys() {
    const savedSetup = localStorage.getItem("fluir-setup");

    if (!savedSetup) {
      return null;
    }

    try {
      const setupData = JSON.parse(savedSetup);

      const savedModules =
        setupData.modules ||
        setupData.activeModules ||
        null;

      if (!savedModules) {
        return null;
      }

      if (Array.isArray(savedModules)) {
        return new Set(savedModules);
      }

      return new Set(
        Object.keys(savedModules).filter(
          (moduleKey) => savedModules[moduleKey] === true
        )
      );
    } catch (error) {
      console.warn(
        "Não foi possível ler os módulos ativos do setup.",
        error
      );

      return null;
    }
  }

  function getNavigationItems() {
    const allSections = window.FluirSections.getAll();
    const activeModules = getActiveModuleKeys();

    if (activeModules === null) {
      return allSections;
    }

    return allSections.filter((section) => {
      if (section.type === window.FluirSections.TYPES.CORE) {
        return true;
      }

      return activeModules.has(section.key);
    });
  }

  function renderNavigation() {
    const currentPage = getCurrentPage();
    const navigationItems = getNavigationItems();

    const links = navigationItems.map((item) => {
        const isActive = item.href === currentPage;
        const classes = ["nav-item"];
        if (item.type === window.FluirSections.TYPES.MODULE) {
          classes.push("module-link");
        }

        if (isActive) {
        classes.push("active");
        }

        const ariaCurrent = isActive
        ? ' aria-current="page"'
        : "";

        const moduleAttribute =
          item.type === window.FluirSections.TYPES.MODULE
            ? ` data-module="${item.key}"`
            : "";

        return `
        <a
            href="${item.href}"
            class="${classes.join(" ")}"
            data-section="${item.key}"
            ${moduleAttribute}
            ${ariaCurrent}
        >
            <span aria-hidden="true"></span>

            <span data-i18n="nav.${item.key}">
              ${
                window.FluirI18n
                  ? window.FluirI18n.t(`nav.${item.key}`, item.label)
                  : item.label
              }
            </span>
        </a>
        `;
    }).join("");

    return `
        <nav
          class="sidebar-nav"
          aria-label="${sidebarT("sidebar.mainNavigation", "Navegação principal")}"
          data-i18n-aria-label="sidebar.mainNavigation"
        >
        ${links}
        </nav>
    `;
    }

  function renderIllustration(quote, quoteKey = "") {
    const translatedQuote = quoteKey
      ? sidebarT(quoteKey, quote)
      : quote;

    const quoteAttribute = quoteKey
      ? ` data-i18n="${quoteKey}"`
      : "";
    return `
      <div class="sidebar-illustration" aria-hidden="true">
        <div class="rain rain-1"></div>
        <div class="rain rain-2"></div>
        <div class="rain rain-3"></div>

        <div class="small-character">
          <div class="small-umbrella"></div>

          <div class="small-head">
            <span></span>
            <span></span>
          </div>

          <div class="small-body"></div>
        </div>

        <p>
          “<span${quoteAttribute}>${translatedQuote}</span>”
        </p>
      </div>
    `;
  }

  function initializeSidebar() {
    const sidebar = document.querySelector(
      ".sidebar[data-shared-sidebar]"
    );

    if (!sidebar) {
      return;
    }

    if (!window.FluirSections) {
        console.error(
            "Catálogo de áreas do Fluir não foi carregado antes da sidebar."
        );

        return;
        }

    if (sidebar.dataset.sidebarReady === "true") {
      return;
    }

    const contextualArea = sidebar.querySelector(
        "[data-sidebar-context]"
    );

    const quote =
        sidebar.dataset.sidebarQuote ||
        "Pequenas ações constantes constroem mudanças profundas.";

    const quoteKey =
        sidebar.dataset.sidebarQuoteKey ||
        "";

    if (!contextualArea) {
      console.warn(
        "Sidebar compartilhada encontrada sem área contextual."
      );

      return;
    }

    contextualArea.insertAdjacentHTML(
      "beforebegin",
      [
        renderBrand(),
        renderNavigation(),
        renderIllustration(quote, quoteKey)
      ].join("")
    );

    sidebar.dataset.sidebarReady = "true";
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeSidebar
    );
  } else {
    initializeSidebar();
  }
})();