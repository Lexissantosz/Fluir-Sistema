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
          <p>Sistema de Organização da Vida</p>
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
            ${item.label}
        </a>
        `;
    }).join("");

    return `
        <nav class="sidebar-nav" aria-label="Navegação principal">
        ${links}
        </nav>
    `;
    }

  function renderIllustration(quote) {
    return `
      <div class="sidebar-illustration">
        <svg class="sidebar-character" width="100" height="92" viewBox="0 0 120 110" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 35a50 32 0 0 1 100 0M60 4v31" />
          <path d="M15 43l-4 8M103 43l-4 8" opacity=".3" />
          <rect x="43" y="38" width="34" height="38" rx="17" fill="var(--card-bg)" />
          <path d="M55 55v3M65 55v3" stroke-width="3" />
          <rect x="41" y="76" width="38" height="30" rx="12" fill="var(--card-bg)" />
        </svg>
        <p>“${quote}”</p>
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
        renderIllustration(quote)
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