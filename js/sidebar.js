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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path d="M12 3C9 6.5 7.5 9.6 7.5 12.7a4.5 4.5 0 0 0 9 0C16.5 9.6 15 6.5 12 3Z"></path>
            <path d="M9.2 11.5c1.8.7 3.8.7 5.6 0"></path>
            <path d="M9.7 15c1.5.5 3.1.5 4.6 0"></path>
          </svg>
        </div>

        <div>
          <h1>Fluir</h1>
          <p>Sistema de Organização da Vida</p>
        </div>
      </div>
    `;
  }

  function renderNavigation() {
    const currentPage = getCurrentPage();
    const navigationItems = window.FluirSections.getAll();

    const links = navigationItems.map((item) => {
        const isActive = item.href === currentPage;
        const classes = ["nav-item"];

        if (isActive) {
        classes.push("active");
        }

        const ariaCurrent = isActive
        ? ' aria-current="page"'
        : "";

        return `
        <a
            href="${item.href}"
            class="${classes.join(" ")}"
            data-section="${item.key}"
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
        “${quote}”
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