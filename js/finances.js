// =====================================================
// FLUIR — FINANÇAS
// JavaScript puro para controlar a tela de finanças
// =====================================================


// =====================================================
// 1. ELEMENTOS PRINCIPAIS
// =====================================================

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");
const avatarBtn = document.getElementById("avatarBtn");

const moduleLinks = document.querySelectorAll(".module-link");

const newTransactionBtn = document.getElementById("newTransactionBtn");
const quickTransactionBtn = document.getElementById("quickTransactionBtn");

const financeModal = document.getElementById("financeModal");
const closeFinanceModalBtn = document.getElementById("closeFinanceModalBtn");
const saveTransactionBtn = document.getElementById("saveTransactionBtn");

const transactionTitleInput = document.getElementById("transactionTitleInput");
const transactionValueInput = document.getElementById("transactionValueInput");
const transactionTypeSelect = document.getElementById("transactionTypeSelect");
const transactionCategorySelect = document.getElementById("transactionCategorySelect");
const transactionNatureSelect = document.getElementById("transactionNatureSelect");
const financeFormMessage = document.getElementById("financeFormMessage");

const transactionList = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");
const transactionSubtitle = document.getElementById("transactionSubtitle");

const currentBalance = document.getElementById("currentBalance");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const expenseRatio = document.getElementById("expenseRatio");

const sidebarBalance = document.getElementById("sidebarBalance");
const sidebarFinanceBar = document.getElementById("sidebarFinanceBar");
const sidebarFinanceText = document.getElementById("sidebarFinanceText");

const categoryList = document.getElementById("categoryList");
const financeMiniTimeline = document.getElementById("financeMiniTimeline");

const clearTransactionsBtn = document.getElementById("clearTransactionsBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let transactionToDeleteId = null;

// =====================================================
// 2. CONFIGURAÇÃO PADRÃO
// =====================================================

const defaultSetup = {
  user: {
    name: "Deibson",
    nickname: "Deibson",
    communicationTone: "calmo"
  },

  modules: {
    timeline: true,
    tasks: true,
    habits: true,
    sleep: true,
    water: true,
    finances: true,
    diary: true,
    nutrition: false,
    physicalHealth: false,
    menstrualCycle: false,
    attachments: true
  },

  preferences: {
    finances: {
      monthlyIncome: ""
    }
  }
};


// =====================================================
// 3. ESTADO
// =====================================================

let transactions = [];
let activeFilter = "all";


// =====================================================
// 4. UTILITÁRIOS
// =====================================================

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentTimeLabel() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatCurrency(value) {
  const number = Number(value) || 0;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// =====================================================
// 5. LER SETUP SALVO
// =====================================================

function getSavedSetup() {
  const savedSetup = localStorage.getItem("fluir-setup");

  if (!savedSetup) {
    return defaultSetup;
  }

  try {
    return JSON.parse(savedSetup);
  } catch (error) {
    console.warn("Erro ao ler configuração do Fluir:", error);
    return defaultSetup;
  }
}

const setupData = getSavedSetup();


// =====================================================
// 6. TEMA
// =====================================================

function applySavedTheme() {
  const savedTheme = localStorage.getItem("fluir-theme");

  if (savedTheme === "dark") {
    body.classList.add("dark");

    if (themeBtn) {
      themeBtn.innerHTML = "<span>☼</span> Claro";
    }
  } else {
    body.classList.remove("dark");

    if (themeBtn) {
      themeBtn.innerHTML = "<span>☾</span> Escuro";
    }
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDarkMode = body.classList.contains("dark");

    themeBtn.innerHTML = isDarkMode
      ? "<span>☼</span> Claro"
      : "<span>☾</span> Escuro";

    localStorage.setItem("fluir-theme", isDarkMode ? "dark" : "light");
  });
}


// =====================================================
// 7. SAUDAÇÃO
// =====================================================

function updateWelcomeArea() {
  const nickname = setupData.user?.nickname?.trim();
  const name = setupData.user?.name?.trim();

  const displayName = nickname || name || "Deibson";

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${displayName}`;
  }

  if (avatarBtn) {
    avatarBtn.textContent = getInitial(displayName);
  }

  if (welcomeSubtitle) {
    welcomeSubtitle.textContent = getSubtitleByTone(setupData.user?.communicationTone);
  }
}

function getInitial(name) {
  if (!name) {
    return "F";
  }

  return name.trim().charAt(0).toUpperCase();
}

function getSubtitleByTone(tone) {
  const subtitles = {
    calmo: "Acompanhe entradas, saídas e seu saldo com clareza.",
    direto: "Registre lançamentos e acompanhe seu saldo.",
    motivador: "Clareza financeira ajuda você a avançar com mais segurança.",
    delicado: "Organizar o dinheiro também pode trazer leveza.",
    neutro: "Acompanhe receitas, despesas e categorias financeiras."
  };

  return subtitles[tone] || subtitles.calmo;
}


// =====================================================
// 8. MENU — ESCONDER MÓDULOS NÃO ATIVOS
// =====================================================

function applySelectedModulesToMenu() {
  const modules = setupData.modules || defaultSetup.modules;

  moduleLinks.forEach((link) => {
    const moduleName = link.dataset.module;

    if (modules[moduleName]) {
      link.classList.remove("module-hidden");
    } else {
      link.classList.add("module-hidden");
    }
  });
}


// =====================================================
// 9. LOCALSTORAGE — FINANÇAS
// =====================================================

function loadTransactions() {
  const saved = localStorage.getItem("fluir-finances");

  if (!saved) {
    transactions = [];
    saveTransactions();
    return;
  }

  try {
    transactions = JSON.parse(saved);
  } catch (error) {
    console.warn("Erro ao ler lançamentos financeiros:", error);
    transactions = [];
    saveTransactions();
  }
}

function saveTransactions() {
  localStorage.setItem("fluir-finances", JSON.stringify(transactions));
}


// =====================================================
// 10. TIMELINE
// =====================================================

function saveTimelineEvent(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}

function createFinanceTimelineEvent(title, description) {
  saveTimelineEvent({
    id: Date.now(),
    title,
    category: "finances",
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  });
}


// =====================================================
// 11. FILTROS
// =====================================================

function transactionMatchesFilter(transaction) {
  if (activeFilter === "all") {
    return true;
  }

  if (activeFilter === "income") {
    return transaction.type === "income";
  }

  if (activeFilter === "expense") {
  return transaction.type === "expense" || transaction.originalType === "debt";
}

  if (activeFilter === "fixed") {
    return transaction.nature === "fixed";
  }

  if (activeFilter === "variable") {
    return transaction.nature === "variable";
  }

  return true;
}

function getFilteredTransactions() {
  return transactions.filter(transactionMatchesFilter);
}


// =====================================================
// 12. RENDERIZAÇÃO
// =====================================================

function renderFinances() {
  renderTransactions();
  updateSummaryCards();
  renderCategoryList();
  renderMiniTimeline();
}

function renderTransactions() {
  if (!transactionList) {
    return;
  }

  const filtered = getFilteredTransactions();

  transactionList.innerHTML = "";

  filtered.forEach((transaction) => {
    transactionList.appendChild(createTransactionCard(transaction));
  });

  updateEmptyState(filtered.length);
  updateTransactionSubtitle(filtered.length);
}

function createTransactionCard(transaction) {
  const card = document.createElement("article");

  const isIncome = transaction.type === "income";
  const isDebt = transaction.isDebt === true || transaction.originalType === "debt";
  const isInstallment = transaction.isInstallment === true || Number(transaction.installments) > 1;
  const isPaid = transaction.paid === true;

  const needsConfirmation = isDebt || isInstallment;
const actionLabel = isIncome ? "Receber" : "Pagar";
const statusLabel = isPaid
  ? isIncome
    ? "Recebida"
    : "Paga"
  : "Pendente";

  const typeLabel = isIncome ? "Entrada" : isDebt ? "Dívida" : "Saída";
  const typeClass = isIncome ? "income" : "expense";
  const icon = isIncome ? "+" : isDebt ? "!" : "-";

  const installments = Number(transaction.installments || 1);
  const currentInstallment = Number(transaction.currentInstallment || 1);

  const dateLabel = formatFinanceDate(transaction.date);
  const note = transaction.note?.trim();

  card.className = `transaction-card ${isDebt ? "debt-card" : ""}`;
  card.dataset.id = transaction.id;

  card.innerHTML = `
    <div class="transaction-icon">
      ${icon}
    </div>

    <div class="transaction-info">
      <strong>${escapeHTML(transaction.title)}</strong>

      <p>
        ${typeLabel} registrada em ${escapeHTML(dateLabel)}.
      </p>

      <div class="transaction-meta">
        <span>${escapeHTML(transaction.category)}</span>
        <span>${transaction.nature === "fixed" ? "Fixo" : "Variável"}</span>
        <span>${typeLabel}</span>

        ${
          isInstallment
            ? `<span>Parcela ${currentInstallment}/${installments}</span>`
            : ""
        }

        ${
  needsConfirmation
    ? `<span class="${isPaid ? "paid-pill" : "pending-pill"}">
        ${statusLabel}
      </span>`
    : ""
}
      </div>

      ${
        note
          ? `<div class="transaction-note">${escapeHTML(note)}</div>`
          : ""
      }
    </div>

    <strong class="transaction-value ${typeClass}">
      ${isIncome ? "+" : "-"} ${formatCurrency(transaction.value)}
    </strong>

    <div class="transaction-actions">
      ${
  needsConfirmation
    ? `<button class="transaction-action-btn toggle-paid-btn" type="button" title="${isPaid ? "Marcar como pendente" : actionLabel}">
        ${isPaid ? "↺" : "✓"}
      </button>`
    : ""
}

      <button class="transaction-action-btn delete-transaction-btn" type="button" title="Excluir lançamento">
        ×
      </button>
    </div>
  `;

  const deleteButton = card.querySelector(".delete-transaction-btn");

if (deleteButton) {
  deleteButton.addEventListener("click", () => {
    openDeleteModal(transaction.id);
  });
}

  const togglePaidButton = card.querySelector(".toggle-paid-btn");

if (togglePaidButton) {
  togglePaidButton.addEventListener("click", () => {
    toggleTransactionPaid(transaction.id);
  });
}

  return card;
}

function formatFinanceDate(dateValue) {
  if (!dateValue) {
    return getTodayKey();
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("pt-BR");
}

function toggleTransactionPaid(transactionId) {
  transactions = transactions.map((transaction) => {
    if (transaction.id === transactionId) {
      return {
        ...transaction,
        paid: !transaction.paid
      };
    }

    return transaction;
  });

  saveTransactions();
  renderFinances();

  createFinanceTimelineEvent(
    "Status financeiro atualizado",
    "Um lançamento foi marcado como recebido, pago ou pendente."
  );
}

function toggleDebtPaid(transactionId) {
  transactions = transactions.map((transaction) => {
    if (transaction.id === transactionId) {
      return {
        ...transaction,
        paid: !transaction.paid
      };
    }

    return transaction;
  });

  saveTransactions();
  renderFinances();

  createFinanceTimelineEvent(
    "Status da dívida atualizado",
    "Uma dívida foi marcada como paga ou pendente."
  );
}

function updateEmptyState(visibleCount) {
  if (!emptyState) {
    return;
  }

  if (visibleCount === 0) {
    emptyState.classList.add("active");
  } else {
    emptyState.classList.remove("active");
  }
}

function updateTransactionSubtitle(visibleCount) {
  if (!transactionSubtitle) {
    return;
  }

  const texts = {
    all: `${visibleCount} lançamento${visibleCount === 1 ? "" : "s"} no total.`,
    income: `${visibleCount} entrada${visibleCount === 1 ? "" : "s"} registrada${visibleCount === 1 ? "" : "s"}.`,
    expense: `${visibleCount} saída${visibleCount === 1 ? "" : "s"} registrada${visibleCount === 1 ? "" : "s"}.`,
    fixed: `${visibleCount} lançamento${visibleCount === 1 ? "" : "s"} fixo${visibleCount === 1 ? "" : "s"}.`,
    variable: `${visibleCount} lançamento${visibleCount === 1 ? "" : "s"} variável${visibleCount === 1 ? "" : "s"}.`
  };

  transactionSubtitle.textContent = texts[activeFilter] || texts.all;
}


// =====================================================
// 13. RESUMOS
// =====================================================

function getTotals() {
  const confirmedTransactions = transactions.filter((item) => {
    // Registros antigos sem paid continuam contando normalmente
    return item.paid !== false;
  });

  const income = confirmedTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.value || 0), 0);

  const expense = confirmedTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.value || 0), 0);

  const balance = income - expense;
  const ratio = income === 0 ? 0 : Math.round((expense / income) * 100);

  return {
    income,
    expense,
    balance,
    ratio
  };
}

function updateSummaryCards() {
  const totals = getTotals();

  if (currentBalance) currentBalance.textContent = formatCurrency(totals.balance);
  if (totalIncome) totalIncome.textContent = formatCurrency(totals.income);
  if (totalExpense) totalExpense.textContent = formatCurrency(totals.expense);
  if (expenseRatio) expenseRatio.textContent = `${totals.ratio}%`;

  if (sidebarBalance) sidebarBalance.textContent = formatCurrency(totals.balance);

  const barPercent = totals.income === 0
    ? 0
    : Math.min(100, Math.round((Math.max(totals.balance, 0) / totals.income) * 100));

  if (sidebarFinanceBar) {
    sidebarFinanceBar.style.width = `${barPercent}%`;
  }

  if (sidebarFinanceText) {
    if (transactions.length === 0) {
      sidebarFinanceText.textContent = "Nenhum lançamento ainda.";
      return;
    }

    sidebarFinanceText.textContent = `${formatCurrency(totals.income)} em entradas e ${formatCurrency(totals.expense)} em saídas.`;
  }
}


// =====================================================
// 14. CATEGORIAS
// =====================================================

function renderCategoryList() {
  if (!categoryList) {
    return;
  }

  const categoryTotals = {};

  transactions.forEach((transaction) => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }

    categoryTotals[transaction.category] += Number(transaction.value || 0);
  });

  const entries = Object.entries(categoryTotals);

  categoryList.innerHTML = "";

  if (entries.length === 0) {
    categoryList.innerHTML = `
      <div class="category-item">
        <span>Nenhuma categoria</span>
        <strong>R$ 0</strong>
      </div>
    `;
    return;
  }

  entries.forEach(([category, total]) => {
    const item = document.createElement("div");

    item.className = "category-item";

    item.innerHTML = `
      <span>${escapeHTML(category)}</span>
      <strong>${formatCurrency(total)}</strong>
    `;

    categoryList.appendChild(item);
  });
}


// =====================================================
// 15. MINI TIMELINE
// =====================================================

function renderMiniTimeline() {
  if (!financeMiniTimeline) {
    return;
  }

  const recent = transactions.slice(0, 3);

  financeMiniTimeline.innerHTML = "";

  if (recent.length === 0) {
    financeMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>Nenhum lançamento</strong>
          Registre sua primeira entrada ou saída.
        </p>
      </div>
    `;
    return;
  }

  recent.forEach((transaction) => {
    const item = document.createElement("div");

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${escapeHTML(transaction.createdTime)}</time>
      <p>
        <strong>${
  transaction.type === "income"
    ? "Entrada registrada"
    : transaction.originalType === "debt" || transaction.isDebt
      ? "Dívida registrada"
      : "Saída registrada"
}</strong>
        ${escapeHTML(transaction.title)} · ${formatCurrency(transaction.value)}
      </p>
    `;

    financeMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 16. MODAL — MENSAGENS
// =====================================================

function showFinanceFormMessage(message, type = "error") {
  if (!financeFormMessage) {
    return;
  }

  financeFormMessage.textContent = message;
  financeFormMessage.className = `finance-form-message show ${type}`;
}

function clearFinanceFormMessage() {
  if (!financeFormMessage) {
    return;
  }

  financeFormMessage.textContent = "";
  financeFormMessage.className = "finance-form-message";
}

function clearFinanceInvalidFields() {
  document.querySelectorAll(".finance-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 17. MODAL — ABRIR / FECHAR
// =====================================================

function openFinanceModal() {
  if (!financeModal) {
    return;
  }

  clearFinanceModalFields();
  financeModal.classList.add("active");

  renderInstallmentDateFields();

  setTimeout(() => {
    if (transactionTitleInput) {
      transactionTitleInput.focus();
    }
  }, 100);
}

function closeFinanceModal() {
  if (!financeModal) {
    return;
  }

  financeModal.classList.remove("active");
}

function clearFinanceModalFields() {
  if (transactionTitleInput) transactionTitleInput.value = "";
  if (transactionValueInput) transactionValueInput.value = "";
  if (transactionTypeSelect) transactionTypeSelect.value = "income";
  if (transactionCategorySelect) transactionCategorySelect.value = "Salário";
  if (transactionNatureSelect) transactionNatureSelect.value = "variable";

  clearFinanceFormMessage();
  clearFinanceInvalidFields();

  const transactionDateInput = document.getElementById("transactionDateInput");
const transactionInstallmentsInput = document.getElementById("transactionInstallmentsInput");
const transactionCurrentInstallmentInput = document.getElementById("transactionCurrentInstallmentInput");
const transactionNoteInput = document.getElementById("transactionNoteInput");
const installmentDatesArea = document.getElementById("installmentDatesArea");

if (transactionDateInput) transactionDateInput.value = getTodayKey();
if (transactionInstallmentsInput) transactionInstallmentsInput.value = 1;
if (transactionCurrentInstallmentInput) transactionCurrentInstallmentInput.value = 1;
if (transactionNoteInput) transactionNoteInput.value = "";
if (installmentDatesArea) installmentDatesArea.innerHTML = "";
}


// =====================================================
// 18. SALVAR LANÇAMENTO
// =====================================================
function addMonthsToFinanceDate(dateValue, monthsToAdd) {
  const baseDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(baseDate.getTime())) {
    return dateValue;
  }

  const newDate = new Date(baseDate);
  newDate.setMonth(newDate.getMonth() + monthsToAdd);

  return newDate.toISOString().split("T")[0];
}

function renderInstallmentDateFields() {
  const installmentDatesArea = document.getElementById("installmentDatesArea");
  const transactionInstallmentsInput = document.getElementById("transactionInstallmentsInput");
  const transactionCurrentInstallmentInput = document.getElementById("transactionCurrentInstallmentInput");
  const transactionDateInput = document.getElementById("transactionDateInput");

  if (!installmentDatesArea || !transactionInstallmentsInput || !transactionCurrentInstallmentInput) {
    return;
  }

  const installments = Number(transactionInstallmentsInput.value) || 1;
  const currentInstallment = Number(transactionCurrentInstallmentInput.value) || 1;
  const firstDate = transactionDateInput?.value || getTodayKey();

  installmentDatesArea.innerHTML = "";

  if (installments <= 1) {
    return;
  }

  const title = document.createElement("div");
  title.className = "installment-dates-title";
  title.innerHTML = `
    <strong>Datas das parcelas</strong>
    <small>Escolha a data de vencimento de cada parcela pendente.</small>
  `;

  installmentDatesArea.appendChild(title);

  for (let installmentNumber = currentInstallment; installmentNumber <= installments; installmentNumber++) {
    const suggestedDate = addMonthsToFinanceDate(
      firstDate,
      installmentNumber - currentInstallment
    );

    const label = document.createElement("label");
    label.className = "installment-date-label";

    label.innerHTML = `
      <span>Data da parcela ${installmentNumber}/${installments}</span>
      <input 
        type="date"
        class="installment-date-input"
        data-installment="${installmentNumber}"
        value="${suggestedDate}"
      />
    `;

    installmentDatesArea.appendChild(label);
  }
}

function getInstallmentDates() {
  const dateInputs = document.querySelectorAll(".installment-date-input");
  const dates = {};

  dateInputs.forEach((input) => {
    const installmentNumber = Number(input.dataset.installment);
    dates[installmentNumber] = input.value || getTodayKey();
  });

  return dates;
}

function saveTransaction() {
  clearFinanceFormMessage();
  clearFinanceInvalidFields();

  const title = transactionTitleInput?.value.trim();
  const value = Number(transactionValueInput?.value);
  const type = transactionTypeSelect?.value || "income";
  const category = transactionCategorySelect?.value || "Outros";
  const nature = transactionNatureSelect?.value || "variable";

  /*
    Campos futuros/opcionais.
    Se ainda não existirem no HTML, o código continua funcionando normalmente.
  */
  const transactionDateInput = document.getElementById("transactionDateInput");
  const transactionNoteInput = document.getElementById("transactionNoteInput");
  const transactionInstallmentsInput = document.getElementById("transactionInstallmentsInput");
  const transactionCurrentInstallmentInput = document.getElementById("transactionCurrentInstallmentInput");

  const date = transactionDateInput?.value || getTodayKey();
  const note = transactionNoteInput?.value.trim() || "";
  const installments = Number(transactionInstallmentsInput?.value) || 1;
  const currentInstallment = Number(transactionCurrentInstallmentInput?.value) || 1;

  if (!title || title.length < 2) {
    transactionTitleInput.classList.add("invalid");
    transactionTitleInput.focus();
    showFinanceFormMessage("Digite uma descrição válida.");
    return;
  }

  if (!value || value <= 0) {
    transactionValueInput.classList.add("invalid");
    transactionValueInput.focus();
    showFinanceFormMessage("Digite um valor válido maior que zero.");
    return;
  }

  if (installments < 1 || installments > 120) {
    if (transactionInstallmentsInput) {
      transactionInstallmentsInput.classList.add("invalid");
      transactionInstallmentsInput.focus();
    }

    showFinanceFormMessage("A quantidade de parcelas deve estar entre 1 e 120.");
    return;
  }

  if (currentInstallment < 1 || currentInstallment > installments) {
    if (transactionCurrentInstallmentInput) {
      transactionCurrentInstallmentInput.classList.add("invalid");
      transactionCurrentInstallmentInput.focus();
    }

    showFinanceFormMessage("A parcela atual não pode ser maior que o total de parcelas.");
    return;
  }

  /*
    Tipos aceitos:
    income  = entrada
    expense = saída
    debt    = dívida
  */
  const normalizedType = type === "debt" ? "expense" : type;

 const installmentDates = getInstallmentDates();
const createdTransactions = [];

for (let index = currentInstallment; index <= installments; index++) {
  const installmentDate =
    installmentDates[index] || addMonthsToFinanceDate(date, index - currentInstallment);

  const newTransaction = {
    id: Date.now() + index,
    title,
    value,
    type: normalizedType,
    originalType: type,
    category,
    nature,
    date: installmentDate,
    note,
    installments,
    currentInstallment: index,
    isInstallment: installments > 1,
    isDebt: type === "debt",

    // Lógica de confirmação:
// - Se for parcelado, começa pendente para qualquer tipo.
// - Se for dívida, começa pendente.
// - Se for lançamento único de entrada/saída, já entra como registrado.
paid: installments > 1 ? false : type !== "debt",

    createdTime: getCurrentTimeLabel(),
    createdAt: new Date().toISOString()
  };

  createdTransactions.push(newTransaction);
}

transactions = [...createdTransactions.reverse(), ...transactions];

saveTransactions();

  const eventTitle =
    type === "income"
      ? "Entrada registrada"
      : type === "debt"
        ? "Dívida registrada"
        : "Saída registrada";

 const installmentText =
  installments > 1
    ? ` · ${installments - currentInstallment + 1} parcela(s) criada(s)`
    : "";

createFinanceTimelineEvent(
  eventTitle,
  `${title} · ${formatCurrency(value)}${installmentText}`
);

  renderFinances();

  showFinanceFormMessage("Lançamento salvo com sucesso.", "success");

  setTimeout(() => {
    closeFinanceModal();
    clearFinanceModalFields();
  }, 450);
}

function openDeleteModal(transactionId) {
  transactionToDeleteId = transactionId;

  if (deleteModal) {
    deleteModal.classList.add("active");
  }
}

function closeDeleteModal() {
  transactionToDeleteId = null;

  if (deleteModal) {
    deleteModal.classList.remove("active");
  }
}

function confirmDeleteTransaction() {
  if (!transactionToDeleteId) {
    closeDeleteModal();
    return;
  }

  deleteTransaction(transactionToDeleteId);
  closeDeleteModal();
}

// =====================================================
// 19. EXCLUIR / LIMPAR
// =====================================================

function deleteTransaction(transactionId) {
  const transaction = transactions.find((item) => item.id === transactionId);

  transactions = transactions.filter((item) => item.id !== transactionId);

  saveTransactions();

  if (transaction) {
    createFinanceTimelineEvent("Lançamento removido", transaction.title);
  }

  renderFinances();
}

function clearTransactions() {
  if (transactions.length === 0) {
    return;
  }

  transactions = [];
  saveTransactions();

  createFinanceTimelineEvent("Finanças limpas", "Todos os lançamentos foram removidos.");

  renderFinances();
}


// =====================================================
// 20. FILTROS
// =====================================================

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderFinances();
    });
  });
}


// =====================================================
// 21. EVENTOS
// =====================================================

function setupFinanceEvents() {
  if (newTransactionBtn) {
    newTransactionBtn.addEventListener("click", openFinanceModal);
  }

  if (quickTransactionBtn) {
    quickTransactionBtn.addEventListener("click", openFinanceModal);
  }

  if (closeFinanceModalBtn) {
    closeFinanceModalBtn.addEventListener("click", () => {
      closeFinanceModal();
      clearFinanceModalFields();
    });
  }

  if (saveTransactionBtn) {
    saveTransactionBtn.addEventListener("click", saveTransaction);
  }

  if (transactionTitleInput) {
    transactionTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveTransaction();
      }
    });
  }

  if (transactionValueInput) {
    transactionValueInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveTransaction();
      }
    });
  }

  if (financeModal) {
    financeModal.addEventListener("click", (event) => {
      if (event.target === financeModal) {
        closeFinanceModal();
        clearFinanceModalFields();
      }
    });
  }

  if (clearTransactionsBtn) {
    clearTransactionsBtn.addEventListener("click", clearTransactions);
  }

  const transactionDateInput = document.getElementById("transactionDateInput");
const transactionInstallmentsInput = document.getElementById("transactionInstallmentsInput");
const transactionCurrentInstallmentInput = document.getElementById("transactionCurrentInstallmentInput");

if (transactionDateInput) {
  transactionDateInput.addEventListener("change", renderInstallmentDateFields);
}

if (transactionInstallmentsInput) {
  transactionInstallmentsInput.addEventListener("input", renderInstallmentDateFields);
}

if (transactionCurrentInstallmentInput) {
  transactionCurrentInstallmentInput.addEventListener("input", renderInstallmentDateFields);
}


if (cancelDeleteBtn) {
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", confirmDeleteTransaction);
}

if (deleteModal) {
  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      closeDeleteModal();
    }
  });
}

}

// =====================================================
// 22. INICIALIZAÇÃO
// =====================================================

function initFinancesPage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadTransactions();

  setupFilters();
  setupFinanceEvents();

  renderFinances();
}

initFinancesPage();