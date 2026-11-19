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
    "assistente.html",
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
    { href: "assistente.html", icon: "", label: "Assistente Fluir" },
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

  function openDrawer() {
    document.body.classList.add("mobile-drawer-open");
  }

  function closeDrawer() {
    document.body.classList.remove("mobile-drawer-open");
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

    <button class="mobile-menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false">

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
          <button class="mobile-drawer-close" type="button" aria-label="Fechar menu"></button>
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
    moreButton.innerHTML = `<i></i><span>Mais</span>`;
    moreButton.addEventListener("click", openDrawer);
    bottomNav.appendChild(moreButton);

    document.body.appendChild(bottomNav);
  }


  function buildAssistantWidget() {
    if (document.querySelector(".assistant-floating-root") || currentFileName() === "assistente.html") return;
    // Nunca confundir a conta real com a demonstracao.
    let account = null;
    try { account = JSON.parse(sessionStorage.getItem("fluir-user") || "null"); } catch {}
    const isDemo = new URLSearchParams(location.search).get("demo") === "1";
    if (isDemo || !account?.id || !account?.token) return;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "../css/assistant-widget.css";
    document.head.appendChild(css);

    const root = document.createElement("div");
    root.className = "assistant-floating-root";
    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "assistant-floating-trigger";
    launcher.setAttribute("aria-label", "Conversar com o Assistente Fluir");
    launcher.setAttribute("aria-expanded", "false");
    launcher.textContent = "✦";
    const panel = document.createElement("section");
    panel.className = "assistant-floating-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Chat do Assistente Fluir");
    panel.hidden = true;
    const heading = document.createElement("div");
    heading.className = "assistant-floating-heading";
    const title = document.createElement("strong");
    title.textContent = "Assistente Fluir";
    const links = document.createElement("div");
    const expand = document.createElement("a");
    expand.href = "assistente.html";
    expand.textContent = "Expandir";
    expand.setAttribute("aria-label", "Abrir o Assistente Fluir em tela completa");
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Fechar conversa");
    links.append(expand, close);
    heading.append(title, links);
    const frame = document.createElement("iframe");
    frame.title = "Conversa com Assistente Fluir";
    frame.loading = "lazy";
    panel.append(heading, frame);
    root.append(panel, launcher);
    document.body.appendChild(root);

    function toggle(open) {
      panel.hidden = !open;
      launcher.setAttribute("aria-expanded", String(open));
      if (open) {
        if (!frame.src) frame.src = "assistente.html?widget=1";
        close.focus();
      } else launcher.focus();
    }
    launcher.addEventListener("click", () => toggle(panel.hidden));
    close.addEventListener("click", () => toggle(false));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !panel.hidden) toggle(false);
    });
  }

  function initMobileUI() {
    if (!appPages.has(currentFileName())) return;

    document.body.classList.add("mobile-ui-ready");
    buildTopbar();
    buildDrawer();
    buildBottomNav();
    buildAssistantWidget();

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
