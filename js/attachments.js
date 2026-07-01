// =====================================================
// FLUIR — ANEXOS
// JavaScript puro para controlar a tela de anexos
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

const newAttachmentBtn = document.getElementById("newAttachmentBtn");
const quickAttachmentBtn = document.getElementById("quickAttachmentBtn");

const attachmentModal = document.getElementById("attachmentModal");
const closeAttachmentModalBtn = document.getElementById("closeAttachmentModalBtn");
const saveAttachmentBtn = document.getElementById("saveAttachmentBtn");

const attachmentTitleInput = document.getElementById("attachmentTitleInput");
const attachmentTypeSelect = document.getElementById("attachmentTypeSelect");
const attachmentCategorySelect = document.getElementById("attachmentCategorySelect");
const attachmentReferenceInput = document.getElementById("attachmentReferenceInput");
const attachmentNoteInput = document.getElementById("attachmentNoteInput");
const attachmentFormMessage = document.getElementById("attachmentFormMessage");

const attachmentList = document.getElementById("attachmentList");
const emptyState = document.getElementById("emptyState");
const attachmentSubtitle = document.getElementById("attachmentSubtitle");

const totalAttachments = document.getElementById("totalAttachments");
const fileAttachments = document.getElementById("fileAttachments");
const linkAttachments = document.getElementById("linkAttachments");
const topCategory = document.getElementById("topCategory");

const sidebarAttachmentCount = document.getElementById("sidebarAttachmentCount");
const sidebarAttachmentBar = document.getElementById("sidebarAttachmentBar");
const sidebarAttachmentText = document.getElementById("sidebarAttachmentText");

const categoryList = document.getElementById("categoryList");
const attachmentMiniTimeline = document.getElementById("attachmentMiniTimeline");

const clearAttachmentsBtn = document.getElementById("clearAttachmentsBtn");
const filterButtons = document.querySelectorAll(".filter-btn");


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
    nutrition: true,
    physicalHealth: true,
    menstrualCycle: true,
    attachments: true
  },

  preferences: {}
};


// =====================================================
// 3. ESTADO
// =====================================================

let attachments = [];
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

// =====================================================
// 5. TEMA CLARO / ESCURO
// Agora o setup apenas aplica o tema salvo.
// A troca de tema fica na tela settings.html.
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

window.addEventListener("load", () => {
  applySavedTheme();
});

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
    calmo: "Organize arquivos, links, imagens e referências importantes.",
    direto: "Salve anexos, links e referências em um só lugar.",
    motivador: "Guardar bem hoje facilita sua vida amanhã.",
    delicado: "Algumas coisas merecem ficar bem guardadas.",
    neutro: "Acompanhe anexos, categorias e referências salvas."
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
// 9. LOCALSTORAGE — ANEXOS
// =====================================================

function loadAttachments() {
  const saved = localStorage.getItem("fluir-attachments");

  if (!saved) {
    attachments = [];
    saveAttachments();
    return;
  }

  try {
    attachments = JSON.parse(saved);
  } catch (error) {
    console.warn("Erro ao ler anexos:", error);
    attachments = [];
    saveAttachments();
  }
}

function saveAttachments() {
  localStorage.setItem("fluir-attachments", JSON.stringify(attachments));
}


// =====================================================
// 10. TIMELINE
// =====================================================

function saveTimelineEvent(eventData) {
  const savedEvents = JSON.parse(localStorage.getItem("fluir-timeline-events")) || [];

  savedEvents.unshift(eventData);

  localStorage.setItem("fluir-timeline-events", JSON.stringify(savedEvents));
}

function createAttachmentTimelineEvent(title, description) {
  saveTimelineEvent({
    id: Date.now(),
    title,
    category: "attachments",
    description,
    time: getCurrentTimeLabel(),
    date: getTodayKey(),
    createdAt: new Date().toISOString()
  });
}


// =====================================================
// 11. LABELS
// =====================================================

function getAttachmentTypeLabel(type) {
  const labels = {
    file: "Arquivo",
    link: "Link",
    image: "Imagem",
    note: "Nota"
  };

  return labels[type] || "Anexo";
}

function getAttachmentTypeIcon(type) {
  const icons = {
    file: "▣",
    link: "↗",
    image: "▧",
    note: "▤"
  };

  return icons[type] || "⌁";
}


// =====================================================
// 12. FILTROS
// =====================================================

function attachmentMatchesFilter(attachment) {
  if (activeFilter === "all") {
    return true;
  }

  return attachment.type === activeFilter;
}

function getFilteredAttachments() {
  return attachments.filter(attachmentMatchesFilter);
}


// =====================================================
// 13. RENDERIZAÇÃO
// =====================================================

function renderAttachments() {
  renderAttachmentList();
  updateSummaryCards();
  renderCategoryList();
  renderMiniTimeline();
}

function renderAttachmentList() {
  if (!attachmentList) {
    return;
  }

  const filtered = getFilteredAttachments();

  attachmentList.innerHTML = "";

  filtered.forEach((attachment) => {
    attachmentList.appendChild(createAttachmentCard(attachment));
  });

  updateEmptyState(filtered.length);
  updateAttachmentSubtitle(filtered.length);
}

function createAttachmentCard(attachment) {
  const card = document.createElement("article");

  card.className = "attachment-card";
  card.dataset.id = attachment.id;

  const referenceIsLink = attachment.reference.startsWith("http://") || attachment.reference.startsWith("https://");

  const referenceContent = referenceIsLink
    ? `<a class="attachment-reference" href="${escapeHTML(attachment.reference)}" target="_blank" rel="noopener noreferrer">${escapeHTML(attachment.reference)}</a>`
    : `<span class="attachment-reference">${escapeHTML(attachment.reference)}</span>`;

  card.innerHTML = `
    <div class="attachment-icon">
      ${getAttachmentTypeIcon(attachment.type)}
    </div>

    <div class="attachment-info">
      <strong>${escapeHTML(attachment.title)}</strong>
      <p>${escapeHTML(attachment.note || "Anexo salvo.")}</p>

      ${referenceContent}

      <div class="attachment-meta">
        <span>${getAttachmentTypeLabel(attachment.type)}</span>
        <span>${escapeHTML(attachment.category)}</span>
        <span>${escapeHTML(attachment.date)}</span>
      </div>
    </div>

    <button class="attachment-action-btn delete-attachment-btn" type="button" title="Excluir anexo">
      ×
    </button>
  `;

  const deleteButton = card.querySelector(".delete-attachment-btn");

  deleteButton.addEventListener("click", () => {
    deleteAttachment(attachment.id);
  });

  return card;
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

function updateAttachmentSubtitle(visibleCount) {
  if (!attachmentSubtitle) {
    return;
  }

  const texts = {
    all: `${visibleCount} anexo${visibleCount === 1 ? "" : "s"} no total.`,
    file: `${visibleCount} arquivo${visibleCount === 1 ? "" : "s"} salvo${visibleCount === 1 ? "" : "s"}.`,
    link: `${visibleCount} link${visibleCount === 1 ? "" : "s"} salvo${visibleCount === 1 ? "" : "s"}.`,
    image: `${visibleCount} imagem${visibleCount === 1 ? "" : "ens"} salva${visibleCount === 1 ? "" : "s"}.`,
    note: `${visibleCount} nota${visibleCount === 1 ? "" : "s"} salva${visibleCount === 1 ? "" : "s"}.`
  };

  attachmentSubtitle.textContent = texts[activeFilter] || texts.all;
}


// =====================================================
// 14. RESUMOS
// =====================================================

function updateSummaryCards() {
  const total = attachments.length;
  const files = attachments.filter((item) => item.type === "file" || item.type === "image").length;
  const links = attachments.filter((item) => item.type === "link").length;

  const categoryCounts = {};

  attachments.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  const topCategoryEntry = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  if (totalAttachments) totalAttachments.textContent = total;
  if (fileAttachments) fileAttachments.textContent = files;
  if (linkAttachments) linkAttachments.textContent = links;
  if (topCategory) topCategory.textContent = topCategoryEntry ? topCategoryEntry[0] : "--";

  if (sidebarAttachmentCount) sidebarAttachmentCount.textContent = total;

  const percent = Math.min(100, total * 10);

  if (sidebarAttachmentBar) sidebarAttachmentBar.style.width = `${percent}%`;

  if (sidebarAttachmentText) {
    if (total === 0) {
      sidebarAttachmentText.textContent = "Nenhum anexo registrado ainda.";
      return;
    }

    sidebarAttachmentText.textContent = `${total} anexo${total === 1 ? "" : "s"} salvo${total === 1 ? "" : "s"}.`;
  }
}


// =====================================================
// 15. CATEGORIAS
// =====================================================

function renderCategoryList() {
  if (!categoryList) {
    return;
  }

  const categoryCounts = {};

  attachments.forEach((attachment) => {
    categoryCounts[attachment.category] = (categoryCounts[attachment.category] || 0) + 1;
  });

  const entries = Object.entries(categoryCounts);

  categoryList.innerHTML = "";

  if (entries.length === 0) {
    categoryList.innerHTML = `
      <div class="category-item">
        <span>Nenhuma categoria</span>
        <strong>0</strong>
      </div>
    `;
    return;
  }

  entries.forEach(([category, count]) => {
    const item = document.createElement("div");

    item.className = "category-item";

    item.innerHTML = `
      <span>${escapeHTML(category)}</span>
      <strong>${count}</strong>
    `;

    categoryList.appendChild(item);
  });
}


// =====================================================
// 16. MINI TIMELINE
// =====================================================

function renderMiniTimeline() {
  if (!attachmentMiniTimeline) {
    return;
  }

  const recent = attachments.slice(0, 3);

  attachmentMiniTimeline.innerHTML = "";

  if (recent.length === 0) {
    attachmentMiniTimeline.innerHTML = `
      <div class="mini-timeline-item">
        <time>--:--</time>
        <p>
          <strong>Nenhum anexo</strong>
          Salve sua primeira referência.
        </p>
      </div>
    `;
    return;
  }

  recent.forEach((attachment) => {
    const item = document.createElement("div");

    item.className = "mini-timeline-item";

    item.innerHTML = `
      <time>${escapeHTML(attachment.createdTime)}</time>
      <p>
        <strong>${getAttachmentTypeLabel(attachment.type)} salvo</strong>
        ${escapeHTML(attachment.title)}
      </p>
    `;

    attachmentMiniTimeline.appendChild(item);
  });
}


// =====================================================
// 17. MODAL — MENSAGENS
// =====================================================

function showAttachmentFormMessage(message, type = "error") {
  if (!attachmentFormMessage) {
    return;
  }

  attachmentFormMessage.textContent = message;
  attachmentFormMessage.className = `attachment-form-message show ${type}`;
}

function clearAttachmentFormMessage() {
  if (!attachmentFormMessage) {
    return;
  }

  attachmentFormMessage.textContent = "";
  attachmentFormMessage.className = "attachment-form-message";
}

function clearAttachmentInvalidFields() {
  document.querySelectorAll(".attachment-modal .invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}


// =====================================================
// 18. MODAL — ABRIR / FECHAR
// =====================================================

function openAttachmentModal() {
  if (!attachmentModal) {
    return;
  }

  clearAttachmentModalFields();
  attachmentModal.classList.add("active");

  setTimeout(() => {
    if (attachmentTitleInput) {
      attachmentTitleInput.focus();
    }
  }, 100);
}

function closeAttachmentModal() {
  if (!attachmentModal) {
    return;
  }

  attachmentModal.classList.remove("active");
}

function clearAttachmentModalFields() {
  if (attachmentTitleInput) attachmentTitleInput.value = "";
  if (attachmentTypeSelect) attachmentTypeSelect.value = "file";
  if (attachmentCategorySelect) attachmentCategorySelect.value = "Pessoal";
  if (attachmentReferenceInput) attachmentReferenceInput.value = "";
  if (attachmentNoteInput) attachmentNoteInput.value = "";

  clearAttachmentFormMessage();
  clearAttachmentInvalidFields();
}


// =====================================================
// 19. SALVAR ANEXO
// =====================================================

function saveAttachment() {
  clearAttachmentFormMessage();
  clearAttachmentInvalidFields();

  const title = attachmentTitleInput?.value.trim();
  const type = attachmentTypeSelect?.value || "file";
  const category = attachmentCategorySelect?.value || "Outros";
  const reference = attachmentReferenceInput?.value.trim();
  const note = attachmentNoteInput?.value.trim() || "";

  if (!title || title.length < 2) {
    attachmentTitleInput.classList.add("invalid");
    attachmentTitleInput.focus();
    showAttachmentFormMessage("Digite um título válido para o anexo.");
    return;
  }

  if (!reference || reference.length < 2) {
    attachmentReferenceInput.classList.add("invalid");
    attachmentReferenceInput.focus();
    showAttachmentFormMessage("Digite um link, nome de arquivo ou referência.");
    return;
  }

  const newAttachment = {
    id: Date.now(),
    title,
    type,
    category,
    reference,
    note,
    date: getTodayKey(),
    createdTime: getCurrentTimeLabel(),
    createdAt: new Date().toISOString()
  };

  attachments.unshift(newAttachment);
  saveAttachments();

  createAttachmentTimelineEvent(
    "Anexo salvo",
    `${title} · ${getAttachmentTypeLabel(type)}`
  );

  renderAttachments();

  showAttachmentFormMessage("Anexo salvo com sucesso.", "success");

  setTimeout(() => {
    closeAttachmentModal();
    clearAttachmentModalFields();
  }, 450);
}


// =====================================================
// 20. EXCLUIR / LIMPAR
// =====================================================

function deleteAttachment(attachmentId) {
  const attachment = attachments.find((item) => item.id === attachmentId);

  attachments = attachments.filter((item) => item.id !== attachmentId);

  saveAttachments();

  if (attachment) {
    createAttachmentTimelineEvent("Anexo removido", attachment.title);
  }

  renderAttachments();
}

function clearAttachments() {
  if (attachments.length === 0) {
    return;
  }

  attachments = [];
  saveAttachments();

  createAttachmentTimelineEvent("Anexos limpos", "Todos os anexos foram removidos.");

  renderAttachments();
}


// =====================================================
// 21. FILTROS
// =====================================================

function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderAttachments();
    });
  });
}


// =====================================================
// 22. EVENTOS
// =====================================================

function setupAttachmentEvents() {
  if (newAttachmentBtn) {
    newAttachmentBtn.addEventListener("click", openAttachmentModal);
  }

  if (quickAttachmentBtn) {
    quickAttachmentBtn.addEventListener("click", openAttachmentModal);
  }

  if (closeAttachmentModalBtn) {
    closeAttachmentModalBtn.addEventListener("click", () => {
      closeAttachmentModal();
      clearAttachmentModalFields();
    });
  }

  if (saveAttachmentBtn) {
    saveAttachmentBtn.addEventListener("click", saveAttachment);
  }

  if (attachmentTitleInput) {
    attachmentTitleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveAttachment();
      }
    });
  }

  if (attachmentReferenceInput) {
    attachmentReferenceInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveAttachment();
      }
    });
  }

  if (attachmentModal) {
    attachmentModal.addEventListener("click", (event) => {
      if (event.target === attachmentModal) {
        closeAttachmentModal();
        clearAttachmentModalFields();
      }
    });
  }

  if (clearAttachmentsBtn) {
    clearAttachmentsBtn.addEventListener("click", clearAttachments);
  }
}


// =====================================================
// 23. INICIALIZAÇÃO
// =====================================================

function initAttachmentsPage() {
  applySavedTheme();
  updateWelcomeArea();
  applySelectedModulesToMenu();

  loadAttachments();

  setupFilters();
  setupAttachmentEvents();

  renderAttachments();
}

initAttachmentsPage();