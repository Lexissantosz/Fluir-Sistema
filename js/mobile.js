/* =====================================================
   FLUIR — UI MOBILE COMPARTILHADA
   Cria topo, menu lateral mobile e navegação inferior.
   ===================================================== */

(function () {
  const appPages = new Set([
    "dashboard.html",
    "timeline.html",
    "tasks.html",
    "habits.html",
    "sleep.html",
    "water.html",
    "finances.html",
    "diary.html",
    "nutrition.html",
    "physical-health.html",
    "menstrual-cycle.html",
    "attachments.html",
    "achievements.html",
    "settings.html",
    "profile.html",
    "plans.html"
  ]);

  const navItems = [
    { href: "dashboard.html", icon: "⌘", label: "Início" },
    { href: "timeline.html", icon: "☷", label: "Linha" },
    { href: "tasks.html", icon: "☑", label: "Tarefas" },
    { href: "habits.html", icon: "◌", label: "Hábitos" },
    { href: "sleep.html", icon: "☾", label: "Sono" },
    { href: "water.html", icon: "♢", label: "Água" },
    { href: "finances.html", icon: "$", label: "Finanças" },
    { href: "diary.html", icon: "▤", label: "Diário" },
    { href: "nutrition.html", icon: "◒", label: "Alimentação" },
    { href: "physical-health.html", icon: "✦", label: "Saúde física" },
    { href: "menstrual-cycle.html", icon: "◍", label: "Ciclo menstrual" },
    { href: "attachments.html", icon: "⌁", label: "Anexos" },
    { href: "achievements.html", icon: "✧", label: "Conquistas" },
    { href: "settings.html", icon: "⚙", label: "Configurações" },
    { href: "profile.html", icon: "♙", label: "Perfil" },
    { href: "plans.html", icon: "♕", label: "Planos" }
  ];

  function currentFileName() {
    const file = window.location.pathname.split("/").pop();
    return file || "dashboard.html";
  }

  function isCurrent(href) {
    return currentFileName() === href;
  }

  function createBrandIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M12 3C9 6.5 7.5 9.6 7.5 12.7a4.5 4.5 0 0 0 9 0C16.5 9.6 15 6.5 12 3Z"></path>
        <path d="M9.2 11.5c1.8.7 3.8.7 5.6 0"></path>
        <path d="M9.7 15c1.5.5 3.1.5 4.6 0"></path>
      </svg>
    `;
  }

  function openDrawer() {
    document.body.classList.add("mobile-drawer-open");
  }

  function closeDrawer() {
    document.body.classList.remove("mobile-drawer-open");
  }

  function buildTopbar() {
    if (document.querySelector(".mobile-topbar")) return;

    const topbar = document.createElement("header");
    topbar.className = "mobile-topbar";
    topbar.innerHTML = `
      <a class="mobile-brand" href="dashboard.html" aria-label="Ir para o início">
        <span class="mobile-brand-icon">${createBrandIcon()}</span>
        <span class="mobile-brand-meta">
          <strong>Fluir</strong>
          <span class="mobile-brand-subtitle">Organização da vida</span>
        </span>
      </a>

      <button class="mobile-menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false">
        ☰
      </button>
    `;

    document.body.prepend(topbar);

    const menuButton = topbar.querySelector(".mobile-menu-btn");
    menuButton.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("mobile-drawer-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function buildDrawer() {
    if (document.querySelector(".mobile-drawer-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "mobile-drawer-overlay";
    overlay.innerHTML = `
      <aside class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu do sistema">
        <div class="mobile-drawer-head">
          <div>
            <strong>Menu</strong>
            <span>Escolha uma área do Fluir</span>
          </div>
          <button class="mobile-drawer-close" type="button" aria-label="Fechar menu">×</button>
        </div>
        <nav class="mobile-drawer-nav"></nav>
      </aside>
    `;

    const drawerNav = overlay.querySelector(".mobile-drawer-nav");

    navItems.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.className = `mobile-drawer-link${isCurrent(item.href) ? " active" : ""}`;
      link.innerHTML = `<i>${item.icon}</i><span>${item.label}</span>`;
      drawerNav.appendChild(link);
    });

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeDrawer();
    });

    overlay.querySelector(".mobile-drawer-close").addEventListener("click", closeDrawer);

    document.body.appendChild(overlay);
  }

  function buildBottomNav() {
    if (document.querySelector(".mobile-bottom-nav")) return;

    const bottomItems = navItems.slice(0, 4);
    const extraItems = navItems.slice(4).map((item) => item.href);
    const bottomNav = document.createElement("nav");
    bottomNav.className = "mobile-bottom-nav";
    bottomNav.setAttribute("aria-label", "Navegação principal mobile");

    bottomItems.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.className = `mobile-nav-link${isCurrent(item.href) ? " active" : ""}`;
      link.innerHTML = `<i>${item.icon}</i><span>${item.label}</span>`;
      bottomNav.appendChild(link);
    });

    const moreButton = document.createElement("button");
    moreButton.type = "button";
    moreButton.className = `mobile-more-btn${extraItems.includes(currentFileName()) ? " active" : ""}`;
    moreButton.innerHTML = `<i>⋯</i><span>Mais</span>`;
    moreButton.addEventListener("click", openDrawer);
    bottomNav.appendChild(moreButton);

    document.body.appendChild(bottomNav);
  }

  function initMobileUI() {
    if (!appPages.has(currentFileName())) return;

    document.body.classList.add("mobile-ui-ready");
    buildTopbar();
    buildDrawer();
    buildBottomNav();

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDrawer();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileUI);
  } else {
    initMobileUI();
  }
})();
