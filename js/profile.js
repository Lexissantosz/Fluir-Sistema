// =====================================================
// FLUIR — PERFIL
// JavaScript puro para controlar a tela de perfil
// =====================================================


// =====================================================
// 1. ELEMENTOS PRINCIPAIS
// =====================================================

const body = document.body;

const themeBtn = document.getElementById("themeBtn");
const welcomeTitle = document.getElementById("welcomeTitle");

const moduleLinks = document.querySelectorAll(".module-link");

const profilePhoto = document.getElementById("profilePhoto");
const profileImage = document.getElementById("profileImage");
const profileInitial = document.getElementById("profileInitial");
const photoInput = document.getElementById("photoInput");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhrase = document.getElementById("profilePhrase");

const infoName = document.getElementById("infoName");
const infoEmail = document.getElementById("infoEmail");
const infoNickname = document.getElementById("infoNickname");
const infoPronouns = document.getElementById("infoPronouns");
const infoAge = document.getElementById("infoAge");
const infoTone = document.getElementById("infoTone");

const aboutText = document.getElementById("aboutText");
const themePreference = document.getElementById("themePreference");

const habitCount = document.getElementById("habitCount");
const diaryCount = document.getElementById("diaryCount");
const completedHabitsWeek = document.getElementById("completedHabitsWeek");
const averageSleep = document.getElementById("averageSleep");
const waterToday = document.getElementById("waterToday");
const activityList = document.getElementById("activityList");

const openEditProfileBtn = document.getElementById("openEditProfileBtn");
const editProfileModal = document.getElementById("editProfileModal");
const closeEditProfileBtn = document.getElementById("closeEditProfileBtn");
const cancelEditProfileBtn = document.getElementById("cancelEditProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");

const editNameInput = document.getElementById("editNameInput");
const editNicknameInput = document.getElementById("editNicknameInput");
const editEmailInput = document.getElementById("editEmailInput");
const editPronounsInput = document.getElementById("editPronounsInput");
const editAgeInput = document.getElementById("editAgeInput");
const editToneInput = document.getElementById("editToneInput");
const editAboutInput = document.getElementById("editAboutInput");
const profileFormMessage = document.getElementById("profileFormMessage");


// =====================================================
// 2. FUNÇÕES DE LOCALSTORAGE
// =====================================================

function getStorageJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    console.warn(`Erro ao ler ${key}:`, error);
    return fallback;
  }
}

function saveStorageJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


// =====================================================
// 3. TEMA
// A tela de perfil pode alterar o tema.
// =====================================================

function applySavedTheme() {
  const savedTheme = localStorage.getItem("fluir-theme") || "light";

  if (savedTheme === "dark") {
    body.classList.add("dark");

    if (themeBtn) {
      themeBtn.innerHTML = "<span>☼</span> Claro";
    }

    if (themePreference) {
      themePreference.textContent = "Escuro";
    }
  } else {
    body.classList.remove("dark");

    if (themeBtn) {
      themeBtn.innerHTML = "<span>☾</span> Escuro";
    }

    if (themePreference) {
      themePreference.textContent = "Claro";
    }
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDarkMode = body.classList.contains("dark");

    localStorage.setItem("fluir-theme", isDarkMode ? "dark" : "light");

    applySavedTheme();
  });
}


// =====================================================
// 4. DADOS DO USUÁRIO
// Lê dados do setup e dados extras do perfil.
// =====================================================

function getSetupData() {
  return getStorageJSON("fluir-setup", {
    user: {
      name: "Usuário",
      nickname: "Usuário",
      email: "usuario@email.com",
      pronouns: "",
      age: "",
      communicationTone: "calmo"
    },
    modules: {}
  });
}

function getProfileData() {
  return getStorageJSON("fluir-profile", {
    about: "Acredito no poder da rotina e do autoconhecimento para construir uma vida com mais propósito e leveza.",
    photo: ""
  });
}

function getDisplayUser() {
  const setupData = getSetupData();
  const user = setupData.user || {};

  return {
    name: user.name || "Usuário",
    nickname: user.nickname || user.name || "Usuário",
    email: user.email || "usuario@email.com",
    pronouns: user.customPronouns || user.pronouns || "Não informado",
    age: user.age || "Não informado",
    tone: user.communicationTone || "calmo"
  };
}

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase() || "F";
}

function formatTone(tone) {
  const tones = {
    calmo: "Calmo",
    direto: "Direto",
    motivador: "Motivador",
    delicado: "Delicado",
    neutro: "Neutro"
  };

  return tones[tone] || "Calmo";
}


// =====================================================
// 5. RENDERIZAR PERFIL
// =====================================================

function renderProfile() {
  const user = getDisplayUser();
  const profile = getProfileData();

  const displayName = user.nickname || user.name;
  const initial = getInitial(displayName);

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${displayName}`;
  }

  if (profileName) {
    profileName.textContent = user.name;
  }

  if (profileEmail) {
    profileEmail.textContent = user.email;
  }

  if (profilePhrase) {
    profilePhrase.textContent = "Um dia de cada vez, com calma e clareza.";
  }

  if (profileInitial) {
    profileInitial.textContent = initial;
  }

  if (profile.photo && profileImage && profilePhoto) {
    profileImage.src = profile.photo;
    profilePhoto.classList.add("has-image");
  } else if (profilePhoto) {
    profilePhoto.classList.remove("has-image");
  }

  if (infoName) infoName.textContent = user.name;
  if (infoEmail) infoEmail.textContent = user.email;
  if (infoNickname) infoNickname.textContent = user.nickname;
  if (infoPronouns) infoPronouns.textContent = user.pronouns;
  if (infoAge) infoAge.textContent = user.age;
  if (infoTone) infoTone.textContent = formatTone(user.tone);

  if (aboutText) {
    aboutText.textContent = profile.about;
  }
}


// =====================================================
// 6. ESCONDER MÓDULOS DESATIVADOS
// Aceita modules como objeto.
// =====================================================

function hideDisabledModules() {
  const setupData = getSetupData();
  const savedModules = setupData.modules;

  if (!savedModules) return;

  const activeModules = Object.keys(savedModules).filter((moduleName) => {
    return savedModules[moduleName] === true;
  });

  if (!activeModules.length) return;

  moduleLinks.forEach((link) => {
    const moduleName = link.dataset.module;

    if (!activeModules.includes(moduleName)) {
      link.style.display = "none";
    }
  });
}


// =====================================================
// 7. RESUMOS DO PERFIL
// =====================================================

function renderProfileStats() {
  const habits = getStorageJSON("fluir-habits", []);
  const diaryEntries = getStorageJSON("fluir-diary", []);
  const sleepLogs = getStorageJSON("fluir-sleep-logs", []);
  const waterData = getStorageJSON("fluir-water", { logs: {} });

  if (habitCount) {
    habitCount.textContent = habits.length;
  }

  if (diaryCount) {
    diaryCount.textContent = diaryEntries.length;
  }

  if (completedHabitsWeek) {
    const todayKey = new Date().toISOString().split("T")[0];

    const completedToday = habits.filter((habit) => {
      return Array.isArray(habit.completedDates) && habit.completedDates.includes(todayKey);
    }).length;

    completedHabitsWeek.textContent = completedToday;
  }

  if (averageSleep) {
    if (!sleepLogs.length) {
      averageSleep.textContent = "--";
    } else {
      const totalHours = sleepLogs.reduce((sum, log) => {
        return sum + (Number(log.durationHours) || 0);
      }, 0);

      const average = totalHours / sleepLogs.length;
      averageSleep.textContent = `${average.toFixed(1)}h`;
    }
  }

  if (waterToday) {
    const todayKey = new Date().toISOString().split("T")[0];
    const todayValue = waterData.logs?.[todayKey] || 0;

    waterToday.textContent = todayValue;
  }
}


// =====================================================
// 8. ATIVIDADE RECENTE
// Puxa os últimos eventos da timeline.
// =====================================================

function renderRecentActivity() {
  const events = getStorageJSON("fluir-timeline-events", []);

  if (!activityList) return;

  if (!events.length) {
    activityList.innerHTML = "<p>Nenhuma atividade recente encontrada.</p>";
    return;
  }

  const recentEvents = events.slice(-4).reverse();

  activityList.innerHTML = recentEvents.map((event) => {
    const title = event.title || "Evento registrado";
    const time = event.time || "Agora";

    return `
      <div class="activity-item">
        <span>${escapeHTML(title)}</span>
        <small>${escapeHTML(time)}</small>
      </div>
    `;
  }).join("");
}


// =====================================================
// 9. MODAL DE EDIÇÃO
// =====================================================

function openEditModal() {
  const user = getDisplayUser();
  const profile = getProfileData();

  if (editNameInput) editNameInput.value = user.name;
  if (editNicknameInput) editNicknameInput.value = user.nickname;
  if (editEmailInput) editEmailInput.value = user.email;
  if (editPronounsInput) editPronounsInput.value = user.pronouns === "Não informado" ? "" : user.pronouns;
  if (editAgeInput) editAgeInput.value = user.age === "Não informado" ? "" : user.age;
  if (editToneInput) editToneInput.value = user.tone;
  if (editAboutInput) editAboutInput.value = profile.about;

  clearProfileMessage();

  if (editProfileModal) {
    editProfileModal.classList.add("show");
  }
}

function closeEditModal() {
  if (editProfileModal) {
    editProfileModal.classList.remove("show");
  }
}

function saveProfileChanges() {
  const name = editNameInput.value.trim();
  const nickname = editNicknameInput.value.trim();
  const email = editEmailInput.value.trim();
  const pronouns = editPronounsInput.value.trim();
  const age = editAgeInput.value.trim();
  const tone = editToneInput.value;
  const about = editAboutInput.value.trim();

  if (!name) {
    showProfileMessage("Informe seu nome.");
    return;
  }

  if (age && (Number(age) < 13 || Number(age) > 120)) {
    showProfileMessage("A idade deve estar entre 13 e 120 anos.");
    return;
  }

  const setupData = getSetupData();

  setupData.user = {
    ...(setupData.user || {}),
    name,
    nickname: nickname || name,
    email: email || "usuario@email.com",
    pronouns,
    communicationTone: tone,
    age
  };

  const profile = getProfileData();
  profile.about = about || profile.about;

  saveStorageJSON("fluir-setup", setupData);
  saveStorageJSON("fluir-profile", profile);

  renderProfile();
  closeEditModal();
}

function showProfileMessage(message) {
  if (!profileFormMessage) return;

  profileFormMessage.textContent = message;
}

function clearProfileMessage() {
  if (!profileFormMessage) return;

  profileFormMessage.textContent = "";
}


// =====================================================
// 10. FOTO DE PERFIL
// Salva a imagem no localStorage em base64.
// =====================================================

if (photoInput) {
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const profile = getProfileData();

      profile.photo = reader.result;

      saveStorageJSON("fluir-profile", profile);
      renderProfile();
    };

    reader.readAsDataURL(file);
  });
}


// =====================================================
// 11. EVENTOS
// =====================================================

if (openEditProfileBtn) {
  openEditProfileBtn.addEventListener("click", openEditModal);
}

if (closeEditProfileBtn) {
  closeEditProfileBtn.addEventListener("click", closeEditModal);
}

if (cancelEditProfileBtn) {
  cancelEditProfileBtn.addEventListener("click", closeEditModal);
}

if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", saveProfileChanges);
}

if (editProfileModal) {
  editProfileModal.addEventListener("click", (event) => {
    if (event.target === editProfileModal) {
      closeEditModal();
    }
  });
}


// =====================================================
// 12. UTILITÁRIO DE SEGURANÇA PARA HTML
// =====================================================

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// =====================================================
// 13. INICIALIZAÇÃO
// =====================================================

applySavedTheme();
hideDisabledModules();
renderProfile();
renderProfileStats();
renderRecentActivity();