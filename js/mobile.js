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
    { href: "dashboard.html", icon: "", label: "Início" },
    { href: "timeline.html", icon: "", label: "Linha" },
    { href: "tasks.html", icon: "", label: "Tarefas" },
    { href: "habits.html", icon: "", label: "Hábitos" },
    { href: "sleep.html", icon: "", label: "Sono" },
    { href: "water.html", icon: "", label: "Água" },
    { href: "finances.html", icon: "", label: "Finanças" },
    { href: "diary.html", icon: "", label: "Diário" },
    { href: "nutrition.html", icon: "", label: "Alimentação" },
    { href: "physical-health.html", icon: "", label: "Saúde física" },
    { href: "menstrual-cycle.html", icon: "", label: "Ciclo menstrual" },
    { href: "attachments.html", icon: "", label: "Anexos" },
    { href: "achievements.html", icon: "", label: "Conquistas" },
    { href: "settings.html", icon: "", label: "Configurações" },
    { href: "profile.html", icon: "", label: "Perfil" },
    { href: "plans.html", icon: "", label: "Planos" }
  ];

  function currentFileName() {
    const file = window.location.pathname.split("/").pop();
    return file || "dashboard.html";
  }

  function isCurrent(href) {
    return currentFileName() === href;
  }

  function isModuleEnabled(href) {
    const moduleByPage = {
      "tasks.html": "tasks", "habits.html": "habits", "sleep.html": "sleep",
      "water.html": "water", "finances.html": "finances", "diary.html": "diary",
      "nutrition.html": "nutrition", "physical-health.html": "physicalHealth",
      "menstrual-cycle.html": "menstrualCycle", "attachments.html": "attachments"
    };
    const key = moduleByPage[href];
    const modules = getStorageJSON("fluir-setup", {}).modules || {};
    return !key || modules[key] !== false;
  }

  function createBrandIcon() {
    return `
      <img
        src="../Assets/brand/fluir-symbol.svg"
        alt=""
        class="mobile-brand-symbol"
        aria-hidden="true"
      />
    `;
  }

  function getStorageJSON(key, fallback = {}) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    console.warn(`Erro ao ler ${key}:`, error);
    return fallback;
  }
}

function getMobileUserData() {
  const setupData = getStorageJSON("fluir-setup", {});
  const userData = setupData.user || {};

  const name =
    userData.nickname ||
    userData.name ||
    setupData.nickname ||
    setupData.name ||
    "Usuário";

  const email =
    userData.email ||
    setupData.email ||
    "Perfil do usuário";

  const initial = name.trim().charAt(0).toUpperCase() || "F";

  return {
    name,
    email,
    initial
  };
}

  let mobileMenuButton = null;
  let mobileDrawerOverlay = null;
  let drawerTrigger = null;
  let mobileMoreButton = null;

  function setDrawerState(isOpen) {
    document.body.classList.toggle("mobile-drawer-open", isOpen);

    if (mobileMenuButton) {
      mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    }

    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.setAttribute("aria-hidden", String(!isOpen));
      mobileDrawerOverlay.inert = !isOpen;
    }
    if (mobileMoreButton) mobileMoreButton.setAttribute("aria-expanded", String(isOpen));
  }

  function openDrawer() {
    drawerTrigger = document.activeElement;
    setDrawerState(true);
    mobileDrawerOverlay?.querySelector(".mobile-drawer-close")?.focus();
  }

  function closeDrawer() {
    const wasOpen = document.body.classList.contains("mobile-drawer-open");
    setDrawerState(false);
    if (wasOpen && drawerTrigger?.isConnected) drawerTrigger.focus();
  }

  function buildTopbar() {
  if (document.querySelector(".mobile-topbar")) return;

  const user = getMobileUserData();

  const topbar = document.createElement("header");
  topbar.className = "mobile-topbar";
  topbar.innerHTML = `
    <a class="mobile-brand mobile-profile-brand" href="profile.html" aria-label="Ir para o perfil">
      <span class="mobile-profile-avatar">${user.initial}</span>

      <span class="mobile-brand-meta">
        <strong>${user.name}</strong>
        <span class="mobile-brand-subtitle">${user.email}</span>
      </span>
    </a>

    <button class="mobile-menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobileDrawer">

    </button>
  `;

  document.body.prepend(topbar);

  mobileMenuButton = topbar.querySelector(".mobile-menu-btn");

  mobileMenuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("mobile-drawer-open");

    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
}

  function buildDrawer() {
    if (document.querySelector(".mobile-drawer-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "mobile-drawer-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.inert = true;
    overlay.innerHTML = `
      <aside
        class="mobile-drawer"
        id="mobileDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu do sistema"
      >
        <div class="mobile-drawer-head">
          <div>
            <strong>Menu</strong>
            <span>Escolha uma área do Fluir</span>
          </div>
          <button class="mobile-drawer-close" type="button" aria-label="Fechar menu"></button>
        </div>
        <nav class="mobile-drawer-nav"></nav>
      </aside>
    `;

    const drawerNav = overlay.querySelector(".mobile-drawer-nav");

    navItems.forEach((item) => {
      if (!isModuleEnabled(item.href)) return;
      const link = document.createElement("a");
      link.href = item.href;
      link.className = `mobile-drawer-link${isCurrent(item.href) ? " active" : ""}`;
      if (isCurrent(item.href)) link.setAttribute("aria-current", "page");
      link.innerHTML = `<i>${item.icon}</i><span>${item.label}</span>`;
      drawerNav.appendChild(link);
    });

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeDrawer();
      }
    });

    overlay.querySelector(".mobile-drawer-close").addEventListener("click", closeDrawer);

    drawerNav.addEventListener("click", (event) => {
      if (event.target.closest(".mobile-drawer-link")) {
        closeDrawer();
      }
    });

    document.body.appendChild(overlay);
    mobileDrawerOverlay = overlay;
  }

  function buildBottomNav() {
    if (document.querySelector(".mobile-bottom-nav")) return;

    const bottomItems = navItems.slice(0, 4).filter((item) => isModuleEnabled(item.href));
    const extraItems = navItems.slice(4).map((item) => item.href);
    const bottomNav = document.createElement("nav");
    bottomNav.className = "mobile-bottom-nav";
    bottomNav.setAttribute("aria-label", "Navegação principal mobile");
    bottomNav.style.gridTemplateColumns = `repeat(${bottomItems.length + 1}, minmax(0, 1fr))`;

    bottomItems.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.className = `mobile-nav-link${isCurrent(item.href) ? " active" : ""}`;
      if (isCurrent(item.href)) link.setAttribute("aria-current", "page");
      link.innerHTML = `<i>${item.icon}</i><span>${item.label}</span>`;
      bottomNav.appendChild(link);
    });

    const moreButton = document.createElement("button");
    moreButton.type = "button";
    moreButton.setAttribute("aria-controls", "mobileDrawer");
    moreButton.setAttribute("aria-expanded", "false");
    mobileMoreButton = moreButton;
    moreButton.className = `mobile-more-btn${extraItems.includes(currentFileName()) ? " active" : ""}`;
    moreButton.innerHTML = `<i></i><span>Mais</span>`;
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
      if (event.key === "Tab" && document.body.classList.contains("mobile-drawer-open")) {
        const focusable = mobileDrawerOverlay.querySelectorAll("button, a[href]");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
      if (
        event.key === "Escape" &&
        document.body.classList.contains("mobile-drawer-open")
      ) {
        closeDrawer();
      }
    });

    const mobileBreakpoint = window.matchMedia("(max-width: 760px)");
    // Reuse existing water buttons and their listeners; restore desktop positions.
    const waterControls = document.querySelector(".water-controls");
    const waterShortcuts = [...document.querySelectorAll(".water-actions [data-water-amount]")];
    let waterQuickGrid;
    const waterShortcutOrigins = waterShortcuts.map((button) => {
      const marker = document.createComment("water shortcut desktop position");
      button.before(marker);
      return { button, marker };
    });
    const arrangeWaterShortcuts = () => {
      if (!waterControls || waterShortcuts.length !== 4) return;
      if (mobileBreakpoint.matches) {
        if (!waterQuickGrid) {
          waterQuickGrid = document.createElement("div");
          waterQuickGrid.className = "mobile-water-quick-grid";
          waterQuickGrid.setAttribute("role", "group");
          waterQuickGrid.setAttribute("aria-label", "Adicionar água");
        }
        waterControls.prepend(waterQuickGrid);
        [...waterShortcuts].sort((a, b) => Number(a.dataset.waterAmount) - Number(b.dataset.waterAmount))
          .forEach((button) => waterQuickGrid.appendChild(button));
      } else {
        waterShortcutOrigins.forEach(({ button, marker }) => marker.after(button));
        if (waterQuickGrid) waterQuickGrid.remove();
      }
    };
    arrangeWaterShortcuts();

    // Mantém a opção escolhida visível dentro das abas roláveis.
    document.addEventListener("click", (event) => {
      if (!mobileBreakpoint.matches) return;
      const selected = event.target.closest(".filter-btn, .tab-btn, .segmented-control button");
      if (!selected) return;
      const rail = selected.closest(".filters-area, .achievement-filters, .settings-tabs, .segmented-control");
      if (rail && rail.scrollWidth > rail.clientWidth) {
        selected.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
      }
    });


    const handleBreakpointChange = (event) => {
      arrangeWaterShortcuts();
      if (!event.matches) {
        closeDrawer();
      }
    };

    if (typeof mobileBreakpoint.addEventListener === "function") {
      mobileBreakpoint.addEventListener("change", handleBreakpointChange);
    } else if (typeof mobileBreakpoint.addListener === "function") {
      mobileBreakpoint.addListener(handleBreakpointChange);
    }

    window.addEventListener("pageshow", () => {
      closeDrawer();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileUI);
  } else {
    initMobileUI();
  }
})();
