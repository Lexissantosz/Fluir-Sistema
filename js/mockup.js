(() => {
  "use strict";

  const nav = [
    ["dashboard","Dashboard","dashboard.html","⌂"],
    ["tasks","Tarefas","tasks.html","✓"],
    ["habits","Hábitos","habits.html","↻"],
    ["water","Água","water.html","◌"],
    ["diary","Diário","diary.html","□"],
    ["settings","Configurações","settings.html","⚙"]
  ];

  function applyTheme() {
    const theme = localStorage.getItem("fluir-mockup-theme") || "light";
    document.documentElement.dataset.theme = theme;
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("fluir-mockup-theme", next);
  }

  function renderShell() {
    const page = document.body.dataset.page;
    const desktop = document.querySelector("[data-shell-nav]");
    const mobile = document.querySelector("[data-mobile-nav]");
    if (!desktop || !mobile) return;

    desktop.innerHTML = `
      <a class="sidebar-brand" href="../index.html"><span>F</span><div><strong>Fluir</strong><small>organização da vida</small></div></a>
      <nav>${nav.map(([key,label,href,icon]) => `
        <a class="${key===page?"active":""}" href="${href}"><i>${icon}</i><span>${label}</span></a>
      `).join("")}</nav>
      <div class="sidebar-note"><strong>Um dia de cada vez.</strong><span>Organize sem transformar sua rotina em cobrança.</span></div>
    `;

    mobile.innerHTML = nav.map(([key,label,href,icon]) => `
      <a class="${key===page?"active":""}" href="${href}"><i>${icon}</i><span>${label}</span></a>
    `).join("");
  }

  function setupAuthTabs() {
    document.querySelectorAll("[data-auth-tab]").forEach(btn => btn.addEventListener("click", () => {
      const target = btn.dataset.authTab;
      document.querySelectorAll("[data-auth-tab]").forEach(x => x.classList.toggle("active", x===btn));
      document.querySelectorAll("[data-auth-panel]").forEach(x => x.classList.toggle("hidden", x.dataset.authPanel!==target));
    }));
  }

  function setupNavigation() {
    document.querySelectorAll("[data-nav]").forEach(btn => btn.addEventListener("click", () => {
      window.location.href = btn.dataset.nav;
    }));
  }

  function setupSteps() {
    const steps = [...document.querySelectorAll(".setup-step")];
    if (!steps.length) return;
    let current = 0;
    const next = document.querySelector("[data-step-next]");
    const back = document.querySelector("[data-step-back]");
    const number = document.querySelector("[data-step-number]");
    const progress = document.querySelector("[data-progress]");

    const render = () => {
      steps.forEach((step, i) => step.classList.toggle("active", i===current));
      number.textContent = current + 1;
      progress.style.width = `${((current+1)/steps.length)*100}%`;
      back.disabled = current === 0;
      next.textContent = current === steps.length - 1 ? "Entrar no Fluir" : "Continuar";
    };
    next.addEventListener("click", () => {
      if (current < steps.length - 1) { current++; render(); }
      else window.location.href = "dashboard.html";
    });
    back.addEventListener("click", () => { if (current>0) { current--; render(); }});
    render();
  }

  function setupWater() {
    let amount = 1400;
    const amountEl = document.querySelector("[data-water-amount]");
    const leftEl = document.querySelector("[data-water-left]");
    const history = document.querySelector("[data-water-history]");
    document.querySelectorAll("[data-add-water]").forEach(btn => btn.addEventListener("click", () => {
      const add = Number(btn.dataset.addWater);
      amount = Math.min(3000, amount + add);
      if (amountEl) amountEl.textContent = amount;
      if (leftEl) leftEl.textContent = Math.max(0, 2000 - amount) + " ml";
      if (history) {
        const now = new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
        history.insertAdjacentHTML("afterbegin", `<div><time>${now}</time><span></span><p><strong>${add} ml</strong><small>Registro demonstrativo</small></p></div>`);
      }
    }));
  }

  function setupTasks() {
    const list = document.querySelector("[data-task-list]");
    const add = document.querySelector("[data-task-add]");
    if (!list || !add) return;
    add.addEventListener("click", () => {
      list.insertAdjacentHTML("afterbegin", `<label class="list-row"><input type="checkbox"><span><strong>Nova tarefa demonstrativa</strong><small>Agora · Mockup</small></span><em>Normal</em></label>`);
    });
  }

  function setupMood() {
    document.querySelectorAll("[data-moods] button").forEach(btn => btn.addEventListener("click", () => {
      btn.parentElement.querySelectorAll("button").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
    }));
    const save = document.querySelector("[data-save-note]");
    if (save) save.addEventListener("click", () => {
      save.textContent = "Registro salvo";
      setTimeout(() => save.textContent = "Salvar registro", 1400);
    });
  }

  applyTheme();
  renderShell();
  setupAuthTabs();
  setupNavigation();
  setupSteps();
  setupWater();
  setupTasks();
  setupMood();
  document.querySelectorAll("[data-theme-toggle]").forEach(btn => btn.addEventListener("click", toggleTheme));
})();