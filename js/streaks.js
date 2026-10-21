/* Fluir: sequências consecutivas derivadas dos registros reais. */
(function () {
  "use strict";
  const DAY_MS = 86400000;
  const CATEGORIES = [
    { key: "water", title: "Hidratação", icon: "💧", detail: "Dias em que a meta de água foi atingida." },
    { key: "habits", title: "Hábitos", icon: "✦", detail: "Dias com ao menos um hábito concluído." },
    { key: "training", title: "Treinos", icon: "↗", detail: "Dias com um treino registrado em Saúde física." }
  ];

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function validKey(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
  }

  function dateKey(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  }

  function shiftKey(key, days) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
  }

  function asKeys(values) {
    return new Set(Array.from(values).filter(validKey));
  }

  function summarize(values, today) {
    const days = asKeys(values);
    const sorted = Array.from(days).sort();
    let longest = 0;
    let run = 0;
    let previous = "";
    sorted.forEach(function (day) {
      run = previous && shiftKey(previous, 1) === day ? run + 1 : 1;
      longest = Math.max(longest, run);
      previous = day;
    });
    const start = days.has(today) ? today : shiftKey(today, -1);
    let current = 0;
    let cursor = start;
    while (days.has(cursor)) {
      current++;
      cursor = shiftKey(cursor, -1);
    }
    return { current: current, longest: longest, days: days, total: days.size };
  }

  function getOverview() {
    const water = read("fluir-water", { goal: 2000, logs: {} });
    const habits = read("fluir-habits", []);
    const training = read("fluir-physical-health", []);
    const goal = Number(water && water.goal) || 2000;
    const validGoal = goal > 0 && Number.isFinite(goal) ? goal : 2000;

    const waterDays = Object.entries(water && water.logs && typeof water.logs === "object" ? water.logs : {})
      .filter(function (entry) { return Number(entry[1]) >= validGoal && validKey(entry[0]); })
      .map(function (entry) { return entry[0]; });

    const habitDays = [];
    (Array.isArray(habits) ? habits : []).forEach(function (habit) {
      if (habit && Array.isArray(habit.completedDates)) habitDays.push.apply(habitDays, habit.completedDates);
    });

    const trainingDays = (Array.isArray(training) ? training : [])
      .filter(function (record) { return record && record.type === "training" && validKey(record.date); })
      .map(function (record) { return record.date; });

    const today = dateKey(new Date());
    return {
      water: summarize(waterDays, today),
      habits: summarize(habitDays, today),
      training: summarize(trainingDays, today),
      today: today
    };
  }

  function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content != null) element.textContent = String(content);
    return element;
  }

  function render(target) {
    if (!target) return;
    const overview = getOverview();
    target.textContent = "";
    const heading = createElement("div", "streak-heading");
    const copy = createElement("div", "");
    copy.appendChild(createElement("span", "streak-eyebrow", "CONSTÂNCIA"));
    copy.appendChild(createElement("h2", "", "Suas sequências"));
    copy.appendChild(createElement("p", "", "Cada dia conta. O dia de hoje ainda pode ser concluído."));
    heading.appendChild(copy);
    heading.appendChild(createElement("span", "streak-heading-mark", "✦"));
    target.appendChild(heading);

    const grid = createElement("div", "streak-grid");
    CATEGORIES.forEach(function (category) {
      const result = overview[category.key];
      const card = createElement("article", "streak-card");
      const title = createElement("div", "streak-card-title");
      title.appendChild(createElement("span", "streak-card-icon", category.icon));
      title.appendChild(createElement("h3", "", category.title));
      card.appendChild(title);

      const metric = createElement("div", "streak-metric");
      metric.appendChild(createElement("strong", "", result.current));
      metric.appendChild(createElement("span", "", result.current === 1 ? "dia seguido" : "dias seguidos"));
      card.appendChild(metric);
      card.appendChild(createElement("p", "streak-record", "Recorde: " + result.longest + " " + (result.longest === 1 ? "dia" : "dias")));
      card.appendChild(createElement("p", "streak-detail", category.detail));

      const dots = createElement("div", "streak-days");
      dots.setAttribute("aria-label", "Últimos 14 dias");
      for (let offset = -13; offset <= 0; offset++) {
        const key = shiftKey(overview.today, offset);
        const completed = result.days.has(key);
        const dot = createElement("span", "streak-dot" + (completed ? " is-done" : ""), completed ? "✓" : "·");
        dot.setAttribute("title", key + (completed ? ": realizado" : ": sem registro"));
        dot.setAttribute("aria-label", key + (completed ? ", realizado" : ", sem registro"));
        dots.appendChild(dot);
      }
      card.appendChild(dots);
      grid.appendChild(card);
    });
    target.appendChild(grid);
    target.appendChild(createElement("p", "streak-footnote", "Os números usam apenas registros salvos neste navegador. A sequência atual considera hoje ou ontem; o recorde preserva os melhores dias consecutivos, mesmo depois de uma pausa."));
  }

  window.FluirStreaks = Object.freeze({ getOverview: getOverview, summarize: summarize, render: render });
  render(document.getElementById("streakDashboard"));
}());
