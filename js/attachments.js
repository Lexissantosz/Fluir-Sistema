// =====================================================
// FLUIR — ANEXOS
// JavaScript puro para controlar a tela de anexos
// =====================================================


// =====================================================
// 1. ELEMENTOS PRINCIPAIS
// =====================================================

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");
const avatarBtn = document.getElementById("avatarBtn");

const notifBtn = document.getElementById("notifBtn");
const notifDropdown = document.getElementById("notifDropdown");

const profileDropdown = document.getElementById("profileDropdown");
const headerProfilePhoto = document.getElementById("headerProfilePhoto");
const headerProfileInitial = document.getElementById("headerProfileInitial");
const headerProfileImage = document.getElementById("headerProfileImage");
const headerProfileName = document.getElementById("headerProfileName");
const headerProfileEmail = document.getElementById("headerProfileEmail");
const headerPhotoInput = document.getElementById("headerPhotoInput");

const moduleLinks = document.querySelectorAll(".module-link");

const newAttachmentBtn = document.getElementById("newAttachmentBtn");
const quickAttachmentBtn = document.getElementById("quickAttachmentBtn");

const attachmentModal = document.getElementById("attachmentModal");
const closeAttachmentModalBtn = document.getElementById("closeAttachmentModalBtn");
const saveAttachmentBtn = document.getElementById("saveAttachmentBtn");

const confirmModal = document.getElementById("confirmModal");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const confirmModalText = document.getElementById("confirmModalText");
const confirmModalCancelBtn = document.getElementById("confirmModalCancelBtn");
const confirmModalConfirmBtn = document.getElementById("confirmModalConfirmBtn");

const attachmentDetailsModal = document.getElementById("attachmentDetailsModal");
const closeAttachmentDetailsBtn = document.getElementById("closeAttachmentDetailsBtn");

const attachmentDetailsType = document.getElementById("attachmentDetailsType");
const attachmentDetailsTitle = document.getElementById("attachmentDetailsTitle");
const attachmentDetailsMeta = document.getElementById("attachmentDetailsMeta");
const attachmentDetailsDescription = document.getElementById("attachmentDetailsDescription");
const attachmentDetailsFiles = document.getElementById("attachmentDetailsFiles");

const editAttachmentBtn = document.getElementById("editAttachmentBtn");
const deleteAttachmentDetailsBtn = document.getElementById("deleteAttachmentDetailsBtn");

const attachmentTitleInput = document.getElementById("attachmentTitleInput");
const attachmentTypeSelect = document.getElementById("attachmentTypeSelect");
const attachmentCategorySelect = document.getElementById("attachmentCategorySelect");
const attachmentReferenceInput = document.getElementById("attachmentReferenceInput");
const addAttachmentLinkBtn = document.getElementById("addAttachmentLinkBtn");
const attachmentSelectedLinks = document.getElementById("attachmentSelectedLinks");
const attachmentLinkField = document.getElementById("attachmentLinkField");

const attachmentUploadField = document.getElementById("attachmentUploadField");
const attachmentUploadLabel = document.getElementById("attachmentUploadLabel");

const attachmentDropzone = document.getElementById("attachmentDropzone");
const attachmentDropzoneTitle = document.getElementById("attachmentDropzoneTitle");
const attachmentDropzoneText = document.getElementById("attachmentDropzoneText");
const attachmentAcceptedTypes = document.getElementById("attachmentAcceptedTypes");

const attachmentFileInput = document.getElementById("attachmentFileInput");
const attachmentSelectedFile = document.getElementById("attachmentSelectedFile");

const attachmentUploadMessage = document.getElementById("attachmentUploadMessage");

const attachmentNoteInput = document.getElementById("attachmentNoteInput");
const attachmentFormMessage = document.getElementById("attachmentFormMessage");

const attachmentList = document.getElementById("attachmentList");
const emptyState = document.getElementById("emptyState");
const emptyStateTitle = document.getElementById("emptyStateTitle");
const emptyStateText = document.getElementById("emptyStateText");
const emptyStateAddBtn = document.getElementById("emptyStateAddBtn");
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
let selectedAttachmentFiles = [];
let selectedAttachmentId = null;
let editingAttachmentId = null;
let selectedAttachmentLinks = [];

const ATTACHMENTS_DB_NAME = "fluir-attachments-db";
const ATTACHMENTS_DB_VERSION = 1;
const ATTACHMENT_FILES_STORE = "files";

function openAttachmentsDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      ATTACHMENTS_DB_NAME,
      ATTACHMENTS_DB_VERSION
    );

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(ATTACHMENT_FILES_STORE)) {
        db.createObjectStore(ATTACHMENT_FILES_STORE, {
          keyPath: "id"
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function saveAttachmentFileToDatabase(file, attachmentId) {
  const db = await openAttachmentsDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      ATTACHMENT_FILES_STORE,
      "readwrite"
    );

    const store = transaction.objectStore(ATTACHMENT_FILES_STORE);

    const fileId = `${attachmentId}-${Date.now()}-${crypto.randomUUID()}`;

    const fileRecord = {
      id: fileId,
      attachmentId,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      blob: file
    };

    const request = store.put(fileRecord);

    request.onsuccess = () => {
      resolve({
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

async function getAttachmentFileFromDatabase(fileId) {
  const db = await openAttachmentsDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      ATTACHMENT_FILES_STORE,
      "readonly"
    );

    const store = transaction.objectStore(ATTACHMENT_FILES_STORE);
    const request = store.get(fileId);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

async function deleteAttachmentFileFromDatabase(fileId) {
  const db = await openAttachmentsDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      ATTACHMENT_FILES_STORE,
      "readwrite"
    );

    const store = transaction.objectStore(ATTACHMENT_FILES_STORE);
    const request = store.delete(fileId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

async function openAttachmentFile(fileId) {
  const fileRecord = await getAttachmentFileFromDatabase(fileId);

  if (!fileRecord?.blob) {
    showAttachmentFormMessage(
      "Não foi possível abrir este arquivo."
    );
    return;
  }

  const fileUrl = URL.createObjectURL(fileRecord.blob);

  window.open(fileUrl, "_blank", "noopener,noreferrer");

  setTimeout(() => {
    URL.revokeObjectURL(fileUrl);
  }, 60000);
}

async function downloadAttachmentFile(fileId) {
  const fileRecord = await getAttachmentFileFromDatabase(fileId);

  if (!fileRecord?.blob) {
    showAttachmentFormMessage(
      "Não foi possível baixar este arquivo."
    );
    return;
  }

  const fileUrl = URL.createObjectURL(fileRecord.blob);

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileRecord.name || "arquivo";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(fileUrl);
  }, 1000);
}

// =====================================================
// 4. UTILITÁRIOS
// =====================================================

function getTodayKey() {
  return toLocalDateKey(new Date());
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

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch (error) {
    return false;
  }
}

const allowedFileExtensions = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "txt",
  "rtf",
  "odt",
  "ods",
  "ppt",
  "pptx",
  "zip",
  "rar",
  "7z"
];

const allowedImageExtensions = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg"
];

function getFileExtension(value) {
  const reference = value.trim();

  const lastDotIndex = reference.lastIndexOf(".");

  if (
    lastDotIndex <= 0 ||
    lastDotIndex === reference.length - 1
  ) {
    return "";
  }

  return reference
    .slice(lastDotIndex + 1)
    .toLowerCase();
}

function isValidFileReference(value) {
  const reference = value.trim();

  if (!reference || isValidHttpUrl(reference)) {
    return false;
  }

  const extension = getFileExtension(reference);

  return allowedFileExtensions.includes(extension);
}

function isValidImageReference(value) {
  const reference = value.trim();

  if (!reference || isValidHttpUrl(reference)) {
    return false;
  }

  const extension = getFileExtension(reference);

  return allowedImageExtensions.includes(extension);
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
    const avatarBtnInitialEl = document.getElementById("avatarBtnInitial");
if (avatarBtnInitialEl) {
  avatarBtnInitialEl.textContent = getInitial(displayName);
}
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

function showConfirmModal({
  title = "Confirmar exclusão",
  text = "Tem certeza de que deseja excluir?",
  confirmText = "Excluir"
} = {}) {
  return new Promise((resolve) => {
    if (
      !confirmModal ||
      !confirmModalCancelBtn ||
      !confirmModalConfirmBtn
    ) {
      resolve(false);
      return;
    }

    if (confirmModalTitle) {
      confirmModalTitle.textContent = title;
    }

    if (confirmModalText) {
      confirmModalText.textContent = text;
    }

    confirmModalConfirmBtn.textContent = confirmText;

    const closeModal = (result) => {
      confirmModal.classList.remove("active");

      confirmModalCancelBtn.onclick = null;
      confirmModalConfirmBtn.onclick = null;
      confirmModal.onclick = null;

      resolve(result);
    };

    confirmModalCancelBtn.onclick = () => {
      closeModal(false);
    };

    confirmModalConfirmBtn.onclick = () => {
      closeModal(true);
    };

    confirmModal.onclick = (event) => {
      if (event.target === confirmModal) {
        closeModal(false);
      }
    };

    confirmModal.classList.add("active");
  });
}

function openAttachmentDetails(attachmentId) {
  const attachment = attachments.find(
    (item) => String(item.id) === String(attachmentId)
  );

  if (!attachment || !attachmentDetailsModal) {
    return;
  }

  selectedAttachmentId = attachment.id;

  if (attachmentDetailsType) {
    attachmentDetailsType.textContent =
      getAttachmentTypeLabel(attachment.type);
  }

  if (attachmentDetailsTitle) {
    attachmentDetailsTitle.textContent = attachment.title;
  }

  if (attachmentDetailsMeta) {
    attachmentDetailsMeta.innerHTML = `
      <span>${escapeHTML(attachment.category)}</span>
      <span>${escapeHTML(attachment.date)}</span>
    `;
  }

  if (attachmentDetailsDescription) {
    attachmentDetailsDescription.textContent =
      attachment.note?.trim() || "Sem descrição.";
  }

  if (attachmentDetailsFiles) {
  attachmentDetailsFiles.innerHTML = "";

  const files = Array.isArray(attachment.files)
    ? attachment.files
    : [];

  const links = Array.isArray(attachment.links)
    ? attachment.links
    : [];

  if (files.length === 0 && links.length === 0) {
    attachmentDetailsFiles.innerHTML = `
      <p class="attachment-details-empty">
        Nenhum arquivo ou link neste anexo.
      </p>
    `;
  }

  links.forEach((link) => {
    const item = document.createElement("div");
    item.className = "attachment-link-item";

    item.innerHTML = `
      <a
        href="${escapeHTML(link)}"
        target="_blank"
        rel="noopener noreferrer"
        class="attachment-link-value"
      >
        ${escapeHTML(link)}
      </a>
    `;

    attachmentDetailsFiles.appendChild(item);
  });

  if (files.length > 0) {

      files.forEach((file) => {
        const item = document.createElement("div");
        item.className = "attachment-file-item";

        item.innerHTML = `
          <div class="attachment-file-info">
            <strong>${escapeHTML(file.name)}</strong>
            <small>${formatAttachmentFileSize(file.size)}</small>
          </div>

          <div class="attachment-file-actions">
            <button
              type="button"
              class="attachment-file-btn details-open-file-btn"
              data-file-id="${escapeHTML(file.id)}"
            >
              Abrir
            </button>

            <button
              type="button"
              class="attachment-file-btn details-download-file-btn"
              data-file-id="${escapeHTML(file.id)}"
              title="Baixar arquivo"
            >
              ↓
            </button>
          </div>
        `;

        attachmentDetailsFiles.appendChild(item);
      });
    }
  }

  attachmentDetailsModal.classList.add("active");
}

function closeAttachmentDetails() {
  if (!attachmentDetailsModal) {
    return;
  }

  attachmentDetailsModal.classList.remove("active");
  selectedAttachmentId = null;
}

function createAttachmentCard(attachment) {
  const card = document.createElement("article");

  card.className = "attachment-card";
  card.dataset.id = attachment.id;
  card.addEventListener("click", (event) => {
  const clickedButton = event.target.closest("button, a");

  if (clickedButton) {
    return;
  }

  openAttachmentDetails(attachment.id);
});

  const attachmentFiles = Array.isArray(attachment.files)
  ? attachment.files
  : [];

const filesContent = attachmentFiles.length > 0
  ? `
    <div class="attachment-files-list">
      ${attachmentFiles.map((file) => `
        <div class="attachment-file-item" data-file-id="${escapeHTML(file.id)}">

          <div class="attachment-file-info">
            <strong>${escapeHTML(file.name)}</strong>
            <small>${formatAttachmentFileSize(file.size)}</small>
          </div>

          <div class="attachment-file-actions">
            <button
              type="button"
              class="attachment-file-btn open-attachment-file-btn"
              data-file-id="${escapeHTML(file.id)}"
              title="Abrir arquivo"
            >
              Abrir
            </button>

            <button
              type="button"
              class="attachment-file-btn download-attachment-file-btn"
              data-file-id="${escapeHTML(file.id)}"
              title="Baixar arquivo"
            >
              ↓
            </button>

            <button
              type="button"
              class="attachment-file-btn delete-attachment-file-btn"
              data-file-id="${escapeHTML(file.id)}"
              title="Excluir arquivo"
            >
              ×
            </button>
          </div>

        </div>
      `).join("")}
    </div>
  `
  : "";

 const attachmentLinks = Array.isArray(attachment.links)
  ? attachment.links
  : [];

const reference = attachment.reference?.trim() || "";

const referenceIsLink =
  reference.startsWith("http://") ||
  reference.startsWith("https://");

const referenceContent =
  attachmentLinks.length > 0
    ? ""
    : !reference
      ? ""
      : referenceIsLink
        ? `<a class="attachment-reference" href="${escapeHTML(reference)}" target="_blank" rel="noopener noreferrer">${escapeHTML(reference)}</a>`
        : `<span class="attachment-reference">${escapeHTML(reference)}</span>`;

const linksContent = attachmentLinks.length > 0
  ? `
    <div class="attachment-links-list">
      ${attachmentLinks.map((link, index) => `
        <div class="attachment-link-item">
          <a
            href="${escapeHTML(link)}"
            target="_blank"
            rel="noopener noreferrer"
            class="attachment-link-value"
          >
            ${escapeHTML(link)}
          </a>

          <button
            type="button"
            class="attachment-link-delete-btn"
            data-link-index="${index}"
            title="Remover link"
          >
            ×
          </button>
        </div>
      `).join("")}
    </div>
  `
  : "";

  card.innerHTML = `
    <div class="attachment-icon">
      ${getAttachmentTypeIcon(attachment.type)}
    </div>

    <div class="attachment-info">
      <strong>${escapeHTML(attachment.title)}</strong>
      <p>${escapeHTML(attachment.note || "Anexo salvo.")}</p>

      ${referenceContent}

${linksContent}

${filesContent}

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

  const openFileButtons = card.querySelectorAll(
  ".open-attachment-file-btn"
);

openFileButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const fileId = button.dataset.fileId;

    if (!fileId) {
      return;
    }

    await openAttachmentFile(fileId);
  });
});

const downloadFileButtons = card.querySelectorAll(
  ".download-attachment-file-btn"
);

downloadFileButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const fileId = button.dataset.fileId;

    if (!fileId) {
      return;
    }

    await downloadAttachmentFile(fileId);
  });
});

const deleteFileButtons = card.querySelectorAll(
  ".delete-attachment-file-btn"
);

deleteFileButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const fileId = button.dataset.fileId;

    if (!fileId) {
      return;
    }

    const isLastFile =
      Array.isArray(attachment.files) &&
      attachment.files.length === 1;

    const hasNote = Boolean(attachment.note?.trim());

    if (isLastFile && !hasNote) {
      const confirmed = await showConfirmModal({
        title: "Excluir último arquivo?",
        text:
          "Este anexo não possui descrição nem outros arquivos. " +
          "Ao remover este último arquivo, o anexo inteiro também será excluído.",
        confirmText: "Excluir anexo"
      });

      if (!confirmed) {
        return;
      }

      await deleteAttachmentFileFromDatabase(fileId);

      attachments = attachments.filter(
        (item) => item.id !== attachment.id
      );

      saveAttachments();

      createAttachmentTimelineEvent(
        "Anexo removido",
        attachment.title
      );

      renderAttachments();

      return;
    }

    const confirmed = await showConfirmModal({
      title: "Excluir arquivo?",
      text:
        "Este arquivo será removido do anexo. " +
        "Essa ação não poderá ser desfeita.",
      confirmText: "Excluir arquivo"
    });

    if (!confirmed) {
      return;
    }

    await deleteAttachmentFileFromDatabase(fileId);

    attachment.files = attachment.files.filter(
      (file) => file.id !== fileId
    );

    saveAttachments();
    renderAttachments();
  });
});

const deleteLinkButtons = card.querySelectorAll(
  ".attachment-link-delete-btn"
);

deleteLinkButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const linkIndex = Number(button.dataset.linkIndex);

    if (Number.isNaN(linkIndex)) {
      return;
    }

    const links = Array.isArray(attachment.links)
      ? attachment.links
      : [];

    const isLastLink = links.length === 1;
    const hasNote = Boolean(attachment.note?.trim());

    if (isLastLink && !hasNote) {
      const confirmed = await showConfirmModal({
        title: "Excluir último link?",
        text:
          "Este anexo não possui descrição nem outros links. " +
          "Ao remover este último link, o anexo inteiro também será excluído.",
        confirmText: "Excluir anexo"
      });

      if (!confirmed) {
        return;
      }

      attachments = attachments.filter(
        (item) => String(item.id) !== String(attachment.id)
      );

      saveAttachments();

      createAttachmentTimelineEvent(
        "Anexo removido",
        attachment.title
      );

      renderAttachments();

      return;
    }

    const confirmed = await showConfirmModal({
      title: "Excluir link?",
      text:
        "Este link será removido do anexo. " +
        "Essa ação não poderá ser desfeita.",
      confirmText: "Excluir link"
    });

    if (!confirmed) {
      return;
    }

    attachment.links.splice(linkIndex, 1);

    // Mantém compatibilidade com anexos antigos
    attachment.reference = attachment.links[0] || "";

    saveAttachments();
    renderAttachments();
  });
});

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

  if (visibleCount > 0) {
    emptyState.classList.remove("active");
    return;
  }

  emptyState.classList.add("active");

  const emptyTexts = {
    all: {
      title: "Nenhum anexo por aqui",
      text: "Guarde arquivos, imagens, links ou notas importantes em um só lugar."
    },
    file: {
      title: "Nenhum arquivo salvo",
      text: "Adicione documentos e outros arquivos para encontrá-los facilmente depois."
    },
    image: {
      title: "Nenhuma imagem salva",
      text: "Adicione imagens importantes para mantê-las organizadas."
    },
    link: {
      title: "Nenhum link salvo",
      text: "Guarde links importantes para acessar novamente quando precisar."
    },
    note: {
      title: "Nenhuma nota salva",
      text: "Registre informações importantes para consultar depois."
    }
  };

  const content = emptyTexts[activeFilter] || emptyTexts.all;

  if (emptyStateTitle) {
    emptyStateTitle.textContent = content.title;
  }

  if (emptyStateText) {
    emptyStateText.textContent = content.text;
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
function formatAttachmentFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderSelectedAttachmentFiles() {
  if (!attachmentSelectedFile) {
    return;
  }

  attachmentSelectedFile.innerHTML = "";

  selectedAttachmentFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "attachment-selected-item";

    item.innerHTML = `
      <div class="attachment-selected-info">
        <strong>${file.name}</strong>
        <small>${formatAttachmentFileSize(file.size)}</small>
      </div>

      <button
        type="button"
        class="remove-selected-file-btn"
        data-index="${index}"
        title="Remover arquivo"
      >
        ×
      </button>
    `;

    attachmentSelectedFile.appendChild(item);
  });
}

function showAttachmentUploadMessage(message) {
  if (!attachmentUploadMessage) {
    return;
  }

  attachmentUploadMessage.textContent = message;
  attachmentUploadMessage.classList.add("show");
}

function clearAttachmentUploadMessage() {
  if (!attachmentUploadMessage) {
    return;
  }

  attachmentUploadMessage.textContent = "";
  attachmentUploadMessage.classList.remove("show");
}

function renderSelectedAttachmentLinks() {
  if (!attachmentSelectedLinks) {
    return;
  }

  attachmentSelectedLinks.innerHTML = "";

  selectedAttachmentLinks.forEach((link, index) => {
    const item = document.createElement("div");
    item.className = "attachment-selected-link-item";

    item.innerHTML = `
      <a
        href="${escapeHTML(link)}"
        target="_blank"
        rel="noopener noreferrer"
        class="attachment-selected-link"
      >
        ${escapeHTML(link)}
      </a>

      <button
        type="button"
        class="remove-selected-link-btn"
        data-index="${index}"
        title="Remover link"
      >
        ×
      </button>
    `;

    attachmentSelectedLinks.appendChild(item);
  });
}

function addSelectedAttachmentLink() {
  const link = attachmentReferenceInput?.value.trim() || "";

  clearAttachmentFormMessage();
  attachmentReferenceInput?.classList.remove("invalid");

  if (!isValidHttpUrl(link)) {
    attachmentReferenceInput?.classList.add("invalid");

    showAttachmentFormMessage(
      "Digite um link válido começando com http:// ou https://."
    );

    return;
  }

  const alreadyExists = selectedAttachmentLinks.includes(link);

  if (alreadyExists) {
    showAttachmentFormMessage(
      "Esse link já foi adicionado."
    );

    return;
  }

  selectedAttachmentLinks.push(link);

  attachmentReferenceInput.value = "";

  renderSelectedAttachmentLinks();
}

function handleSelectedAttachmentFiles(files) {
  clearAttachmentUploadMessage();

  const newFiles = Array.from(files || []);
  const type = attachmentTypeSelect?.value || "file";

  const validFiles = [];
  const invalidFiles = [];

  newFiles.forEach((file) => {
    let isValid = true;

    if (type === "image") {
      const hasImageMime = file.type.startsWith("image/");
      const hasImageExtension = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.name);

      isValid = hasImageMime || hasImageExtension;
    }

    if (type === "file") {
      isValid = /\.(pdf|doc|docx|xls|xlsx|csv|txt|rtf|odt|ods|ppt|pptx|zip|rar|7z)$/i.test(
        file.name
      );
    }

    if (isValid) {
      validFiles.push(file);
    } else {
      invalidFiles.push(file);
    }
  });

  validFiles.forEach((file) => {
    const alreadyExists = selectedAttachmentFiles.some(
      (item) =>
        item.name === file.name &&
        item.size === file.size &&
        item.lastModified === file.lastModified
    );

    if (!alreadyExists) {
      selectedAttachmentFiles.push(file);
    }
  });

  renderSelectedAttachmentFiles();

  if (invalidFiles.length === 1) {
  const invalidFile = invalidFiles[0];
  const fileName = invalidFile.name;

  const isImage =
    invalidFile.type.startsWith("image/") ||
    /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(fileName);

  const isRegularFile =
    /\.(pdf|doc|docx|xls|xlsx|csv|txt|rtf|odt|ods|ppt|pptx|zip|rar|7z)$/i.test(
      fileName
    );

  if (type === "file" && isImage) {
    showAttachmentUploadMessage(
      `"${fileName}" não foi adicionado em Arquivo. Esse formato deve ser salvo em Imagens.`
    );
  } else if (type === "image" && isRegularFile) {
    showAttachmentUploadMessage(
      `"${fileName}" não foi adicionado em Imagens. Esse formato deve ser salvo em Arquivos.`
    );
  } else {
    showAttachmentUploadMessage(
      `"${fileName}" não é um formato suportado pelo Fluir.`
    );
  }
}

  if (invalidFiles.length > 1) {
  const imageFiles = invalidFiles.filter((file) => {
    return (
      file.type.startsWith("image/") ||
      /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.name)
    );
  });

  const regularFiles = invalidFiles.filter((file) => {
    return /\.(pdf|doc|docx|xls|xlsx|csv|txt|rtf|odt|ods|ppt|pptx|zip|rar|7z)$/i.test(
      file.name
    );
  });

  const unsupportedCount =
    invalidFiles.length - imageFiles.length - regularFiles.length;

  const messages = [
    `${invalidFiles.length} arquivos não foram adicionados.`
  ];

  if (type === "file" && imageFiles.length > 0) {
    messages.push(
      `${imageFiles.length} devem ser salvos em Imagens.`
    );
  }

  if (type === "image" && regularFiles.length > 0) {
    messages.push(
      `${regularFiles.length} devem ser salvos em Arquivos.`
    );
  }

  if (unsupportedCount > 0) {
    messages.push(
      `${unsupportedCount} possuem formato não suportado pelo Fluir.`
    );
  }

  showAttachmentUploadMessage(messages.join(" "));
}
}

function updateAttachmentTypeFields() {
  const type = attachmentTypeSelect?.value || "file";

  if (attachmentLinkField) {
    attachmentLinkField.hidden = type !== "link";
  }

  if (attachmentUploadField) {
    attachmentUploadField.hidden = type !== "file" && type !== "image";
  }

  if (type === "file") {
    if (attachmentUploadLabel) {
      attachmentUploadLabel.textContent = "Arquivo";
    }

    if (attachmentDropzoneTitle) {
      attachmentDropzoneTitle.textContent = "Clique para selecionar";
    }

    if (attachmentDropzoneText) {
      attachmentDropzoneText.textContent = "ou arraste o arquivo até aqui";
    }

    if (attachmentFileInput) {
      attachmentFileInput.accept =
        ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.rtf,.odt,.ods,.ppt,.pptx,.zip,.rar,.7z";
    }
  }

    if (attachmentAcceptedTypes) {
      attachmentAcceptedTypes.textContent =
       "Aceitos: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, RTF, ODT, ODS, PPT, PPTX, ZIP, RAR e 7Z";
  }

  if (type === "image") {
    if (attachmentUploadLabel) {
      attachmentUploadLabel.textContent = "Imagem";
    }

    if (attachmentDropzoneTitle) {
      attachmentDropzoneTitle.textContent = "Clique para selecionar uma imagem";
    }

    if (attachmentDropzoneText) {
      attachmentDropzoneText.textContent = "ou arraste a imagem até aqui";
    }

    if (attachmentFileInput) {
      attachmentFileInput.accept = "image/*";
    }

    if (attachmentAcceptedTypes) {
      attachmentAcceptedTypes.textContent =
        "Aceitos: PNG, JPG, JPEG, GIF, WEBP e SVG";
    }
  }
}

function openAttachmentModal(attachment = null) {
  if (!attachmentModal) {
    return;
  }

  clearAttachmentModalFields();

  editingAttachmentId = attachment?.id || null;

  if (attachment) {
    if (attachmentTitleInput) {
      attachmentTitleInput.value = attachment.title || "";
    }

    if (attachmentTypeSelect) {
  attachmentTypeSelect.value = attachment.type || "file";
  attachmentTypeSelect.disabled = true;
}

    if (attachmentCategorySelect) {
      attachmentCategorySelect.value = attachment.category || "Pessoal";
    }

    if (attachmentReferenceInput) {
      if (attachment.type === "link") {
  selectedAttachmentLinks =
    Array.isArray(attachment.links) && attachment.links.length > 0
      ? [...attachment.links]
      : attachment.reference
        ? [attachment.reference]
        : [];

  if (attachmentReferenceInput) {
    attachmentReferenceInput.value = "";
  }

  renderSelectedAttachmentLinks();
} else {
  if (attachment.type === "link") {
  attachment.links = [...selectedAttachmentLinks];
  attachment.reference = selectedAttachmentLinks[0] || "";
}
}
    }

    if (attachmentNoteInput) {
      attachmentNoteInput.value = attachment.note || "";
    }

    if (saveAttachmentBtn) {
      saveAttachmentBtn.textContent = "Salvar alterações";
    }
  } else {
  if (attachmentTypeSelect) {
    attachmentTypeSelect.disabled = false;
  }

  if (saveAttachmentBtn) {
    saveAttachmentBtn.textContent = "Salvar anexo";
  }
}

  updateAttachmentTypeFields();

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

  selectedAttachmentFiles = [];

if (attachmentFileInput) {
  attachmentFileInput.value = "";
}

renderSelectedAttachmentFiles();
selectedAttachmentLinks = [];
renderSelectedAttachmentLinks();
}


// =====================================================
// 19. SALVAR ANEXO
// =====================================================

async function saveAttachment() {
  clearAttachmentFormMessage();
  clearAttachmentInvalidFields();

  const title = attachmentTitleInput?.value.trim();
  const type = attachmentTypeSelect?.value || "file";
  const category = attachmentCategorySelect?.value || "Outros";
  const reference = attachmentReferenceInput?.value.trim() || "";
  const note = attachmentNoteInput?.value.trim() || "";

  if (!title || title.length < 2) {
    attachmentTitleInput.classList.add("invalid");
    attachmentTitleInput.focus();
    showAttachmentFormMessage("Digite um título válido para o anexo.");
    return;
  }

 if (type === "link") {
  // Se a pessoa digitou um link mas esqueceu de clicar em "Adicionar",
  // o Salvar adiciona automaticamente.
  if (reference) {
    if (!isValidHttpUrl(reference)) {
      attachmentReferenceInput.classList.add("invalid");
      attachmentReferenceInput.focus();

      showAttachmentFormMessage(
        "Digite um link válido começando com http:// ou https://."
      );

      return;
    }

    if (!selectedAttachmentLinks.includes(reference)) {
      selectedAttachmentLinks.push(reference);
    }
  }

  if (selectedAttachmentLinks.length === 0) {
    showAttachmentFormMessage(
      "Adicione pelo menos um link."
    );

    return;
  }
}
if (
  !editingAttachmentId &&
  type === "file" &&
  selectedAttachmentFiles.length === 0
) {
  showAttachmentFormMessage(
    "Selecione pelo menos um arquivo."
  );
  return;
}

if (
  !editingAttachmentId &&
  type === "image" &&
  selectedAttachmentFiles.length === 0
) {
  showAttachmentFormMessage(
    "Selecione pelo menos uma imagem."
  );
  return;
}

if (type === "image") {
  const invalidImage = selectedAttachmentFiles.find((file) => {
    const hasImageMime = file.type.startsWith("image/");
    const hasImageExtension = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.name);

    return !hasImageMime && !hasImageExtension;
  });

  if (invalidImage) {
    showAttachmentFormMessage(
      `"${invalidImage.name}" não é uma imagem válida.`
    );
    return;
  }
}

if (type === "file") {
  const invalidFile = selectedAttachmentFiles.find((file) => {
    return !/\.(pdf|doc|docx|xls|xlsx|csv|txt|rtf|odt|ods|ppt|pptx|zip|rar|7z)$/i.test(
      file.name
    );
  });

  if (invalidFile) {
    showAttachmentFormMessage(
      `"${invalidFile.name}" não é um tipo de arquivo permitido.`
    );
    return;
  }
}

if (
  type === "note" &&
  (
    isValidHttpUrl(reference) ||
    isValidFileReference(reference) ||
    isValidImageReference(reference)
  )
) {
  attachmentReferenceInput.classList.add("invalid");
  attachmentReferenceInput.focus();
  showAttachmentFormMessage(
    "Para notas, use apenas texto. Links, arquivos e imagens devem ser salvos no tipo correspondente."
  );
  return;
}

if (editingAttachmentId) {
  const attachment = attachments.find(
    (item) => String(item.id) === String(editingAttachmentId)
  );

  if (!attachment) {
    showAttachmentFormMessage(
      "Não foi possível encontrar o anexo para editar."
    );
    return;
  }

  attachment.title = title;
  attachment.category = category;
  attachment.note = note;

  if (
  (attachment.type === "file" || attachment.type === "image") &&
  selectedAttachmentFiles.length > 0
) {
  const currentFiles = Array.isArray(attachment.files)
    ? attachment.files
    : [];

  for (const file of selectedAttachmentFiles) {
    const savedFile = await saveAttachmentFileToDatabase(
      file,
      attachment.id
    );

    currentFiles.push(savedFile);
  }

  attachment.files = currentFiles;
}

  if (attachment.type === "link") {
  attachment.links = [...selectedAttachmentLinks];
  attachment.reference = selectedAttachmentLinks[0] || "";
}

  attachment.updatedAt = new Date().toISOString();

  saveAttachments();

  createAttachmentTimelineEvent(
    "Anexo atualizado",
    attachment.title
  );

  renderAttachments();

  showAttachmentFormMessage(
    "Alterações salvas com sucesso.",
    "success"
  );

  editingAttachmentId = null;

  setTimeout(() => {
    closeAttachmentModal();
    clearAttachmentModalFields();
  }, 450);

  return;
}

const attachmentId = `${Date.now()}-${crypto.randomUUID()}`;

let savedFiles = [];

if (type === "file" || type === "image") {
  for (const file of selectedAttachmentFiles) {
    const savedFile = await saveAttachmentFileToDatabase(
      file,
      attachmentId
    );

    savedFiles.push(savedFile);
  }
}

const newAttachment = {
  id: attachmentId,
  title,
  type,
  category,
 reference:
  type === "link"
    ? selectedAttachmentLinks[0] || ""
    : "",

links:
  type === "link"
    ? [...selectedAttachmentLinks]
    : [],

files: savedFiles,
  note,
  date: getTodayKey(),
  createdTime: getCurrentTimeLabel(),
  createdAt: new Date().toISOString()
};

attachments.unshift(newAttachment);

saveAttachments();

if (type === "file" || type === "image") {
  createAttachmentTimelineEvent(
    "Anexo salvo",
    `${title} · ${savedFiles.length} arquivo${savedFiles.length === 1 ? "" : "s"}`
  );
} else {
  createAttachmentTimelineEvent(
    "Anexo salvo",
    `${title} · ${getAttachmentTypeLabel(type)}`
  );
}

renderAttachments();

const successMessage =
  type === "file" || type === "image"
    ? `Anexo salvo com ${savedFiles.length} arquivo${savedFiles.length === 1 ? "" : "s"}.`
    : "Anexo salvo com sucesso.";

showAttachmentFormMessage(successMessage, "success");

setTimeout(() => {
  closeAttachmentModal();
  clearAttachmentModalFields();
}, 450);
}

// =====================================================
// 20. EXCLUIR / LIMPAR
// =====================================================

async function deleteAttachment(attachmentId) {
  const attachment = attachments.find(
    (item) => String(item.id) === String(attachmentId)
  );

  if (!attachment) {
    return;
  }

  const confirmed = await showConfirmModal({
    title: "Excluir anexo?",
    text: `"${attachment.title}" e todo o conteúdo dentro dele serão excluídos. Essa ação não poderá ser desfeita.`,
    confirmText: "Excluir anexo"
  });

  if (!confirmed) {
    return;
  }

  const files = Array.isArray(attachment.files)
    ? attachment.files
    : [];

  for (const file of files) {
    if (file.id) {
      await deleteAttachmentFileFromDatabase(file.id);
    }
  }

  attachments = attachments.filter(
    (item) => String(item.id) !== String(attachmentId)
  );

  saveAttachments();

  createAttachmentTimelineEvent(
    "Anexo removido",
    attachment.title
  );

  renderAttachments();
}

async function clearAttachments() {
  if (attachments.length === 0) {
    return;
  }

  const confirmed = await showConfirmModal({
    title: "Excluir todos os anexos?",
    text: "Todos os anexos, arquivos e links serão excluídos. Essa ação não poderá ser desfeita.",
    confirmText: "Excluir tudo"
  });

  if (!confirmed) {
    return;
  }

  for (const attachment of attachments) {
    const files = Array.isArray(attachment.files)
      ? attachment.files
      : [];

    for (const file of files) {
      if (file.id) {
        await deleteAttachmentFileFromDatabase(file.id);
      }
    }
  }

  attachments = [];
  saveAttachments();

  createAttachmentTimelineEvent(
    "Anexos limpos",
    "Todos os anexos foram removidos."
  );

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
  if (attachmentTypeSelect) {
  attachmentTypeSelect.addEventListener("change", () => {
    updateAttachmentTypeFields();
  });
}

  if (newAttachmentBtn) {
    newAttachmentBtn.addEventListener("click", () => {
  openAttachmentModal();
});
  }

  if (quickAttachmentBtn) {
    quickAttachmentBtn.addEventListener("click", openAttachmentModal);
  }

  if (closeAttachmentModalBtn) {
    closeAttachmentModalBtn.addEventListener("click", () => {
      closeAttachmentModal();
      clearAttachmentModalFields();
      updateAttachmentTypeFields();
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

  if (attachmentFileInput) {
  attachmentFileInput.addEventListener("change", () => {
    handleSelectedAttachmentFiles(attachmentFileInput.files);
  });
}

if (attachmentDropzone) {
  attachmentDropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    attachmentDropzone.classList.add("drag-over");
  });

  attachmentDropzone.addEventListener("dragleave", () => {
    attachmentDropzone.classList.remove("drag-over");
  });

  attachmentDropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  attachmentDropzone.classList.remove("drag-over");

  const files = event.dataTransfer?.files;

  if (files?.length) {
    handleSelectedAttachmentFiles(files);
  }
});
}

if (attachmentSelectedFile) {
  attachmentSelectedFile.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-selected-file-btn");

    if (!removeButton) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const index = Number(removeButton.dataset.index);

    if (Number.isNaN(index)) {
      return;
    }

    selectedAttachmentFiles.splice(index, 1);
    renderSelectedAttachmentFiles();
  });

  if (closeAttachmentDetailsBtn) {
  closeAttachmentDetailsBtn.addEventListener("click", () => {
    closeAttachmentDetails();
  });
}

if (attachmentDetailsModal) {
  attachmentDetailsModal.addEventListener("click", (event) => {
    if (event.target === attachmentDetailsModal) {
      closeAttachmentDetails();
    }
  });
}
}

if (attachmentDetailsFiles) {
  attachmentDetailsFiles.addEventListener("click", async (event) => {
    const openButton = event.target.closest(".details-open-file-btn");
    const downloadButton = event.target.closest(".details-download-file-btn");

    if (openButton) {
      const fileId = openButton.dataset.fileId;

      if (fileId) {
        await openAttachmentFile(fileId);
      }

      return;
    }

    if (downloadButton) {
      const fileId = downloadButton.dataset.fileId;

      if (fileId) {
        await downloadAttachmentFile(fileId);
      }
    }
  });
}

if (deleteAttachmentDetailsBtn) {
  deleteAttachmentDetailsBtn.addEventListener("click", async () => {
    const attachment = attachments.find(
      (item) => String(item.id) === String(selectedAttachmentId)
    );

    if (!attachment) {
      return;
    }

    const confirmed = await showConfirmModal({
      title: "Excluir anexo?",
      text:
        `"${attachment.title}" e todos os arquivos dentro dele serão excluídos. ` +
        "Essa ação não poderá ser desfeita.",
      confirmText: "Excluir anexo"
    });

    if (!confirmed) {
      return;
    }

    const files = Array.isArray(attachment.files)
      ? attachment.files
      : [];

    for (const file of files) {
      await deleteAttachmentFileFromDatabase(file.id);
    }

    attachments = attachments.filter(
      (item) => String(item.id) !== String(attachment.id)
    );

    saveAttachments();

    createAttachmentTimelineEvent(
      "Anexo removido",
      attachment.title
    );

    closeAttachmentDetails();
    renderAttachments();
  });
}

if (editAttachmentBtn) {
  editAttachmentBtn.addEventListener("click", () => {
    const attachment = attachments.find(
      (item) => String(item.id) === String(selectedAttachmentId)
    );

    if (!attachment) {
      return;
    }

    closeAttachmentDetails();
    openAttachmentModal(attachment);
  });
}

if (addAttachmentLinkBtn) {
  addAttachmentLinkBtn.addEventListener("click", () => {
    addSelectedAttachmentLink();
  });
}

if (attachmentSelectedLinks) {
  attachmentSelectedLinks.addEventListener("click", (event) => {
    const removeButton = event.target.closest(
      ".remove-selected-link-btn"
    );

    if (!removeButton) {
      return;
    }

    const index = Number(removeButton.dataset.index);

    if (Number.isNaN(index)) {
      return;
    }

    selectedAttachmentLinks.splice(index, 1);
    renderSelectedAttachmentLinks();
  });
}
if (emptyStateAddBtn) {
  emptyStateAddBtn.addEventListener("click", () => {
    openAttachmentModal();
  });
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

// =====================================================
// 21. DROPDOWNS DO CABEÇALHO (NOTIFICAÇÕES E PERFIL)
// =====================================================

function closeAllHeaderDropdowns() {
  if (notifDropdown) notifDropdown.classList.remove("open");
  if (profileDropdown) profileDropdown.classList.remove("open");
}

if (notifBtn && notifDropdown) {
  notifBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !notifDropdown.classList.contains("open");
    closeAllHeaderDropdowns();
    if (willOpen) notifDropdown.classList.add("open");
  });
}

if (avatarBtn && profileDropdown) {
  avatarBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !profileDropdown.classList.contains("open");
    closeAllHeaderDropdowns();
    if (willOpen) profileDropdown.classList.add("open");
  });
}

document.addEventListener("click", () => {
  closeAllHeaderDropdowns();
});

if (profileDropdown) {
  profileDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

if (notifDropdown) {
  notifDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}


// =====================================================
// 22. FOTO E NOME NO DROPDOWN DE PERFIL
// =====================================================

function getHeaderProfile() {
  try {
    return JSON.parse(localStorage.getItem("fluir-profile")) || {};
  } catch (error) {
    return {};
  }
}

function saveHeaderProfile(profile) {
  localStorage.setItem("fluir-profile", JSON.stringify(profile));
}

function renderHeaderProfileDropdown() {
  const nickname = setupData.user?.nickname?.trim();
  const name = setupData.user?.name?.trim();
  const displayName = nickname || name || "Deibson";

  const profile = getHeaderProfile();

  if (headerProfileName) {
    headerProfileName.textContent = displayName;
  }

  if (headerProfileEmail) {
    headerProfileEmail.textContent = setupData.user?.email || "usuario@email.com";
  }

  if (headerProfileInitial) {
    headerProfileInitial.textContent = getInitial(displayName);
  }

  if (profile.photo && headerProfileImage && headerProfilePhoto) {
    headerProfileImage.src = profile.photo;
    headerProfilePhoto.classList.add("has-image");
  } else if (headerProfilePhoto) {
    headerProfilePhoto.classList.remove("has-image");
  }

  
  const avatarBtnImage = document.getElementById("avatarBtnImage");

  if (profile.photo && avatarBtnImage && avatarBtn) {
    avatarBtnImage.src = profile.photo;
    avatarBtn.classList.add("has-image");
  } else if (avatarBtn) {
    avatarBtn.classList.remove("has-image");
  }
}

if (headerPhotoInput) {
  headerPhotoInput.addEventListener("change", () => {
    const file = headerPhotoInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const profile = getHeaderProfile();
      profile.photo = reader.result;

      saveHeaderProfile(profile);
      renderHeaderProfileDropdown();
    };

    reader.readAsDataURL(file);
  });
}

renderHeaderProfileDropdown();