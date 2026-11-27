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

  function getNavItems() {
    const setup = getStorageJSON("fluir-setup", {});
    const saved = setup.modules || setup.activeModules;
    const selected = Array.isArray(saved) ? new Set(saved) :
      saved && typeof saved === "object" ? new Set(Object.keys(saved).filter(k => saved[k] === true)) : null;
    return window.FluirSections.getAll().filter(section =>
      section.type === window.FluirSections.TYPES.CORE || selected === null || selected.has(section.key)
    ).map(section => ({href:section.href,icon:"",label:section.key === "dashboard" ? "Início" : section.key === "timeline" ? "Timeline" : section.label,
      type:section.type,key:section.key}));
  }

  function currentFileName() {
    const file = window.location.pathname.split("/").pop();
    return file || "dashboard.html";
  }

  function isCurrent(href) {
    return currentFileName() === href;
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
    return JSON.parse(FluirStorage.getItem(key)) || fallback;
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

  let savedScrollY = 0;
  let scrollLocked = false;
  const overlaySelectors = [
    ".attachment-modal-overlay", ".attachment-details-overlay", ".confirm-modal-overlay",
    ".finance-modal-overlay", ".delete-modal-overlay", ".cycle-modal-overlay",
    ".task-modal-overlay", ".habit-modal-overlay", ".water-modal-overlay",
    ".sleep-modal-overlay", ".diary-modal-overlay", ".event-modal-overlay",
    ".nutrition-modal-overlay", ".health-modal-overlay"
  ];
  function syncScrollLock() {
    const modalActive = overlaySelectors.some(sel => document.querySelector(sel + ".active"));
    document.body.classList.toggle("mobile-modal-open", modalActive);
    const lock = modalActive || document.body.classList.contains("mobile-drawer-open");
    if (lock && !scrollLocked) {
      savedScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = "-" + savedScrollY + "px";
      document.body.style.width = "100%";
      scrollLocked = true;
    } else if (!lock && scrollLocked) {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      scrollLocked = false;
      window.scrollTo(0, savedScrollY);
    }
  }
  function openDrawer() {
    if (document.body.classList.contains("mobile-modal-open")) return;
    document.body.classList.add("mobile-drawer-open");
    document.querySelector(".mobile-menu-btn")?.setAttribute("aria-expanded", "true");
    syncScrollLock();
  }

  function closeDrawer() {
    document.body.classList.remove("mobile-drawer-open");
    document.querySelector(".mobile-menu-btn")?.setAttribute("aria-expanded", "false");
    syncScrollLock();
  }

  function escapeMobileText(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function buildTopbar() {
  if (document.querySelector(".mobile-topbar")) return;

  const user = getMobileUserData();

  const topbar = document.createElement("header");
  topbar.className = "mobile-topbar";
  topbar.innerHTML = `
    <a class="mobile-brand mobile-profile-brand" href="profile.html" aria-label="Ir para o perfil">
      <span class="mobile-profile-avatar">${escapeMobileText(user.initial)}</span>

      <span class="mobile-brand-meta">
        <strong>${escapeMobileText(user.name)}</strong>
        <span class="mobile-brand-subtitle">${escapeMobileText(user.email)}</span>
      </span>
    </a>

    <button class="mobile-menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false">

    </button>
  `;

  document.body.prepend(topbar);

  const menuButton = topbar.querySelector(".mobile-menu-btn");

  menuButton.addEventListener("click", () => {
    if (document.body.classList.contains("mobile-drawer-open")) closeDrawer();
    else openDrawer();
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
            <strong>${window.FluirI18n.t("Menu")}</strong>
            <span>${window.FluirI18n.t("Escolha uma área do Fluir")}</span>
          </div>
          <button class="mobile-drawer-close" type="button" aria-label="Fechar menu"></button>
        </div>
        <nav class="mobile-drawer-nav"></nav>
      </aside>
    `;

    const drawerNav = overlay.querySelector(".mobile-drawer-nav");

    getNavItems().forEach((item) => {
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

    const navItems = getNavItems();
    const primary = navItems.filter(item => ["dashboard","timeline"].includes(item.key) || item.type === window.FluirSections.TYPES.MODULE);
    const bottomItems = primary.slice(0, 4);
    const extraItems = navItems.filter(item => !bottomItems.includes(item)).map(item => item.href);
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
    moreButton.innerHTML = `<i></i><span>${window.FluirI18n.t("Mais")}</span>`;
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

    const observer = new MutationObserver(syncScrollLock);
    overlaySelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => observer.observe(el, {
        attributes: true, attributeFilter: ["class"]
      }));
    });
    syncScrollLock();

    // O botão de hoje ativa o filtro da data quando o módulo o oferece.
    document.querySelectorAll(".date-btn:not([id])").forEach(button => {
      button.addEventListener("click", () => {
        const todayFilter = document.querySelector('.filter-btn[data-filter="today"]');
        if (todayFilter) todayFilter.click();
        else {
          const today = new Date().toLocaleDateString("pt-BR");
          button.textContent = window.FluirI18n.t("Hoje · ") + today;
          button.setAttribute("aria-label", "Data de hoje: " + today);
        }
      });
    });

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
