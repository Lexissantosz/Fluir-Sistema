/* Fluir: editor visual de recipientes e atalhos de capacidade. */
(function () {
  "use strict";
  const STORAGE_KEY = "fluir-water-vessels";
  const shapes = { glass: "Copo", mug: "Caneca", bottle: "Garrafa" };
  const colors = ["#b8c5c9", "#9fb9a7", "#d2b3a0", "#a9b4d5", "#e2c68b", "#9e9e9e"];
  const MAX_ML = 1000;
  const starter = [
    { id: "preset-glass", name: "Meu copo", shape: "glass", color: colors[0], capacity: 250, pattern: "none" }
  ];
  const $ = (id) => document.getElementById(id);
  function valid(v) {
    return v && typeof v === "object" && typeof v.name === "string" && v.name.trim().length > 0 && v.name.length <= 32 &&
      Object.hasOwn(shapes, v.shape) && colors.includes(v.color) && ["none", "dots", "lines"].includes(v.pattern) &&
      Number.isInteger(v.capacity) && v.capacity >= 1 && v.capacity <= MAX_ML && typeof v.id === "string";
  }
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(value) ? value.filter(valid).slice(0, 12) : starter.slice();
    } catch (_error) { return starter.slice(); }
  }
  let vessels = read();
  let selectedId = vessels[0]?.id || null;
  let editingId = null;
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(vessels)); return true; }
    catch (_error) { setStatus("Não foi possível salvar neste navegador."); return false; }
  }
  function setStatus(value) {
    if ($("vesselEditorStatus")) $("vesselEditorStatus").textContent = value;
  }
  function svg(vessel) {
    const outline = {
      glass: '<path d="M50 35H150L138 168Q136 178 124 178H76Q64 178 62 168Z"/>',
      mug: '<path d="M50 38H147V158Q147 176 129 176H68Q50 176 50 158Z"/><path d="M147 61H161Q184 61 184 91Q184 122 147 122"/>',
      bottle: '<path d="M80 24H120V56Q120 67 135 83L143 101V163Q143 177 129 177H71Q57 177 57 163V101L65 83Q80 67 80 56Z"/>'
    }[vessel.shape];
    const pattern = vessel.pattern === "dots"
      ? '<g fill="currentColor" stroke="none" opacity=".55"><circle cx="84" cy="100" r="4"/><circle cx="111" cy="121" r="4"/><circle cx="91" cy="145" r="4"/></g>'
      : vessel.pattern === "lines"
      ? '<path d="M73 100H127M73 116H127M73 132H127" fill="none" stroke="currentColor" opacity=".45" stroke-width="3"/>'
      : "";
    return '<svg viewBox="0 0 200 200" role="img" aria-label="' + shapes[vessel.shape] + ' personalizado" xmlns="http://www.w3.org/2000/svg"><g fill="' + vessel.color + '" stroke="currentColor" stroke-width="4" stroke-linejoin="round">' + outline + '</g>' + pattern + '</svg>';
  }
  function getDraft() {
    return {
      id: editingId || "vessel-" + Date.now(),
      name: $("vesselName").value.trim(),
      shape: $("vesselShape").value,
      color: $("vesselColor").value,
      pattern: $("vesselPattern").value,
      capacity: Number($("vesselCapacity").value)
    };
  }
  function preview() {
    const draft = getDraft();
    $("vesselPreview").innerHTML = svg({ ...draft, shape: shapes[draft.shape] ? draft.shape : "glass" });
    $("vesselPreviewCapacity").textContent = Number.isFinite(draft.capacity) ? draft.capacity + " ml" : "0 ml";
  }
  function render() {
    const grid = $("vesselGrid");
    grid.replaceChildren();
    if (!vessels.length) grid.appendChild(Object.assign(document.createElement("p"), { textContent: "Crie seu primeiro recipiente para registrar água." }));
    vessels.forEach(function (v) {
      const card = document.createElement("div");
      card.className = "vessel-card" + (selectedId === v.id ? " selected" : "");
      const visual = document.createElement("div");
      visual.className = "vessel-card-art";
      visual.innerHTML = svg(v);
      card.appendChild(visual);
      const label = document.createElement("strong");
      label.textContent = v.name;
      card.appendChild(label);
      const count = document.createElement("span");
      count.textContent = v.capacity + " ml";
      card.appendChild(count);
      const actions = document.createElement("div");
      actions.className = "vessel-card-actions";
      [["Registrar", function () {
        const submit = window.addWaterAmount;
        if (typeof submit !== "function") { setStatus("O módulo de água não está disponível."); return; }
        if (submit(v.capacity)) {
          selectedId = v.id;
          render();
          setStatus(v.capacity + " ml registrados com " + v.name + ".");
        } else {
          setStatus("Confira o limite de registro ou a meta diária no painel de água.");
        }
      }], ["Editar", function () { open(v); }], ["Excluir", function () {
        vessels = vessels.filter(x => x.id !== v.id);
        if (selectedId === v.id) selectedId = vessels[0]?.id || null;
        save(); render(); setStatus("Recipiente excluído.");
      }]].forEach(function (entry) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = entry[0];
        button.addEventListener("click", entry[1]);
        actions.appendChild(button);
      });
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }
  function open(v) {
    editingId = v?.id || null;
    const source = v || { name: "", shape: "glass", color: colors[0], pattern: "none", capacity: 250 };
    $("vesselName").value = source.name;
    $("vesselShape").value = source.shape;
    $("vesselColor").value = source.color;
    $("vesselPattern").value = source.pattern;
    $("vesselCapacity").value = source.capacity;
    $("vesselEditorTitle").textContent = editingId ? "Editar recipiente" : "Criar recipiente";
    $("vesselEditor").hidden = false;
    preview();
    $("vesselName").focus();
  }
  function close() {
    $("vesselEditor").hidden = true;
    $("vesselNewButton").focus();
  }
  function submit(event) {
    event.preventDefault();
    const draft = getDraft();
    if (!valid(draft)) { setStatus("Informe um nome e uma capacidade entre 1 e 1.000 ml."); return; }
    if (!editingId && vessels.length >= 12) { setStatus("Limite de 12 recipientes. Exclua um para criar outro."); return; }
    const index = vessels.findIndex(v => v.id === editingId);
    if (index >= 0) vessels[index] = draft;
    else vessels.push(draft);
    selectedId = draft.id;
    if (!save()) return;
    close();
    render();
    setStatus("Recipiente salvo! Agora é só registrar a água.");
  }
  function init() {
    if (!$("vesselGrid")) return;
    $("vesselNewButton").addEventListener("click", function () { open(null); });
    $("vesselCancelButton").addEventListener("click", close);
    $("vesselForm").addEventListener("submit", submit);
    ["vesselName", "vesselShape", "vesselColor", "vesselPattern", "vesselCapacity"].forEach(id => $(id).addEventListener("input", preview));
    render();
  }
  init();
}());
