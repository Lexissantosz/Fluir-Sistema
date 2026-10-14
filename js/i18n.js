/* =====================================================
   FLUIR — INTERNACIONALIZAÇÃO (i18n)

   Responsabilidades:
   - controlar o idioma ativo;
   - persistir a preferência;
   - fornecer traduções por chave;
   - traduzir elementos com data-i18n;
   - disponibilizar locale para datas/números/moedas;
   ===================================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "fluir-language";
  const DEFAULT_LANGUAGE = "pt-BR";

  const LANGUAGES = Object.freeze({
    "pt-BR": {
      label: "Português (Brasil)",
      locale: "pt-BR"
    },

    "pt-PT": {
      label: "Português (Portugal)",
      locale: "pt-PT"
    },

    en: {
      label: "English",
      locale: "en-US"
    },

    es: {
      label: "Español",
      locale: "es-ES"
    },

    fr: {
      label: "Français",
      locale: "fr-FR",
      beta: true
    },

    de: {
      label: "Deutsch",
      locale: "de-DE",
      beta: true
    },

    it: {
      label: "Italiano",
      locale: "it-IT",
      beta: true
    }
  });

  /*
   * Por enquanto começamos apenas com textos estruturais.
   * Os cards específicos de cada idioma vão expandir
   * essas traduções para todas as páginas depois.
   */
  const translations = {
    "pt-BR": {
      "nav.dashboard": "Início",
        "nav.timeline": "Linha do tempo",
      "nav.tasks": "Tarefas",
      "nav.habits": "Hábitos",
      "nav.sleep": "Sono",
      "nav.water": "Água",
      "nav.finances": "Finanças",
      "nav.diary": "Diário emocional",
      "nav.nutrition": "Alimentação",
      "nav.physicalHealth": "Saúde física",
      "nav.menstrualCycle": "Ciclo menstrual",
      "nav.attachments": "Anexos",
      "nav.achievements": "Conquistas",
      "nav.settings": "Configurações",
      "nav.profile": "Perfil",
        "nav.plans": "Planes y precios",

        "dashboard.pageTitle": "Fluir | Inicio",
        "dashboard.focusToday": "Enfoque de hoy",
        "dashboard.keepGoing": "Sigue así.",
        "dashboard.mainPanel": "Panel principal",
        "dashboard.welcome": "Hola, {name}",

        "settings.language": "Idioma",
        "settings.appearance": "Apariencia"
    },

    "pt-PT": {
      "nav.dashboard": "Início",
      "nav.timeline": "Linha temporal",
      "nav.tasks": "Tarefas",
      "nav.habits": "Hábitos",
      "nav.sleep": "Sono",
      "nav.water": "Água",
      "nav.finances": "Finanças",
      "nav.diary": "Diário emocional",
      "nav.nutrition": "Alimentação",
      "nav.physicalHealth": "Saúde física",
      "nav.menstrualCycle": "Ciclo menstrual",
      "nav.attachments": "Anexos",
      "nav.achievements": "Conquistas",
      "nav.settings": "Definições",
      "nav.profile": "Perfil",
        "nav.plans": "Planos e preços",

        "dashboard.pageTitle": "Fluir | Início",
        "dashboard.focusToday": "Foco de hoje",
        "dashboard.keepGoing": "Continue assim.",
        "dashboard.mainPanel": "Painel principal",
        "dashboard.welcome": "Olá, {name}",

        "settings.language": "Idioma",
        "settings.appearance": "Aparência"
    },

    en: {
      "nav.dashboard": "Dashboard",
      "nav.timeline": "Timeline",
      "nav.tasks": "Tasks",
      "nav.habits": "Habits",
      "nav.sleep": "Sleep",
      "nav.water": "Water",
      "nav.finances": "Finances",
      "nav.diary": "Emotional diary",
      "nav.nutrition": "Nutrition",
      "nav.physicalHealth": "Physical health",
      "nav.menstrualCycle": "Menstrual cycle",
      "nav.attachments": "Attachments",
      "nav.achievements": "Achievements",
      "nav.settings": "Settings",
      "nav.profile": "Profile",
        "nav.plans": "Plans and pricing",

        "dashboard.pageTitle": "Fluir | Dashboard",
        "dashboard.focusToday": "Today's focus",
        "dashboard.keepGoing": "Keep it up.",
        "dashboard.mainPanel": "Main dashboard",
        "dashboard.welcome": "Hello, {name}",

        "settings.language": "Language",
        "settings.appearance": "Appearance"
    },

    es: {
      "nav.dashboard": "Inicio",
      "nav.timeline": "Línea de tiempo",
      "nav.tasks": "Tareas",
      "nav.habits": "Hábitos",
      "nav.sleep": "Sueño",
      "nav.water": "Agua",
      "nav.finances": "Finanzas",
      "nav.diary": "Diario emocional",
      "nav.nutrition": "Alimentación",
      "nav.physicalHealth": "Salud física",
      "nav.menstrualCycle": "Ciclo menstrual",
      "nav.attachments": "Archivos",
      "nav.achievements": "Logros",
      "nav.settings": "Configuración",
      "nav.profile": "Perfil",
        "nav.plans": "Planos e preços",

        "dashboard.pageTitle": "Fluir | Início",
        "dashboard.focusToday": "Foco de hoje",
        "dashboard.keepGoing": "Continua assim.",
        "dashboard.mainPanel": "Painel principal",
        "dashboard.welcome": "Olá, {name}",

        "settings.language": "Idioma",
        "settings.appearance": "Aparência"
    }
  };

  /* FLUIR — traduções completas do Dashboard
   Arquivo gerado para ser copiado para dentro de js/i18n.js.
   Não é carregado sozinho pelo navegador.
*/

const DASHBOARD_TRANSLATIONS = {
  "pt-BR": {
    "nav.dashboard": "Início",
    "nav.timeline": "Linha do tempo",
    "dashboard.pageTitle": "Fluir | Início",
    "dashboard.focusToday": "Foco de hoje",
    "dashboard.keepGoing": "Continue assim.",
    "dashboard.mainPanel": "Painel principal",
    "dashboard.welcome": "Olá, {name}",
    "dashboard.subtitle.calm": "Respire fundo. Um dia de cada vez, no seu ritmo.",
    "dashboard.subtitle.direct": "Veja suas prioridades e siga para o próximo passo.",
    "dashboard.subtitle.motivating": "Você está construindo constância. Continue avançando.",
    "dashboard.subtitle.gentle": "Com calma e leveza, hoje também pode fluir.",
    "dashboard.subtitle.neutral": "Acompanhe sua rotina, seus registros e seus próximos passos.",
    "dashboard.notifications": "Notificações",
    "dashboard.configureNotifications": "Configurar notificações",
    "dashboard.welcomeNotification": "Boas-vindas ao Fluir!",
    "dashboard.exploreModules": "Explore seus módulos na barra lateral.",
    "dashboard.twoHoursAgo": "há 2 horas",
    "dashboard.profilePhoto": "Foto de perfil",
    "dashboard.changePhoto": "Trocar foto",
    "dashboard.goToSettings": "Ir para configurações",
    "dashboard.tasksCompleted": "{completed} de {total} concluídas",
    "dashboard.habitsCompleted": "{completed} de {total} concluídos",
    "dashboard.noRecord": "sem registro",
    "dashboard.lastRecord": "último registro",
    "dashboard.goal": "meta {goal}",
    "dashboard.ofGoalMl": "de {goal} ml",
    "dashboard.currentBalance": "saldo atual",
    "dashboard.income": "Entrada {value}",
    "dashboard.expense": "Saída - {value}",
    "dashboard.entryToday": "entrada hoje",
    "dashboard.entriesToday": "entradas hoje",
    "dashboard.tasksToday": "Tarefas de hoje",
    "dashboard.newTask": "Nova tarefa",
    "dashboard.viewAllTasks": "Ver todas as tarefas →",
    "dashboard.viewFullTimeline": "Ver linha do tempo completa →",
    "dashboard.activeHabits": "Hábitos ativos",
    "dashboard.viewAll": "Ver todos",
    "dashboard.viewEntries": "Ver entradas →",
    "dashboard.timeline.wokeUp": "Acordei",
    "dashboard.timeline.wokeUpDesc": "Dormi bem e me sinto disposto.",
    "dashboard.timeline.breakfast": "Café da manhã",
    "dashboard.timeline.breakfastDesc": "Aveia com frutas e café.",
    "dashboard.timeline.meeting": "Reunião de alinhamento",
    "dashboard.timeline.meetingDesc": "Projeto Fluir — sprint semanal.",
    "dashboard.timeline.walk": "Caminhada",
    "dashboard.timeline.walkDesc": "20 minutos ao ar livre.",
    "dashboard.timeline.diary": "Diário emocional",
    "dashboard.timeline.diaryDesc": "Reflexão sobre o dia.",
    "dashboard.habit.meditate": "Meditar 10 min",
    "dashboard.habit.read": "Ler diariamente",
    "dashboard.habit.workout": "Treinar",
    "dashboard.habit.water": "Beber 2 L de água",
    "dashboard.noDiaryEntries": "Nenhuma entrada no diário ainda.",
    "dashboard.lastDiaryEntry": "Última entrada registrada.",
    "dashboard.recentEvents": "Eventos recentes",
    "dashboard.recentEventsSubtitle": "O que aconteceu nos últimos dias.",
    "dashboard.today": "Hoje",
    "dashboard.noRecentEvents": "Nenhum evento recente",
    "dashboard.moduleRecordsHere": "Os registros dos módulos aparecerão aqui.",
    "dashboard.event": "Evento",
    "dashboard.empty.title": "Seu início está mais leve por enquanto.",
    "dashboard.empty.description": "Você escolheu poucas funcionalidades, então o Fluir deixou a tela mais simples. Quando quiser, vá em Configurações para ativar novas áreas como tarefas, sono, água, finanças, diário, alimentação ou saúde.",
    "dashboard.noTasks.title": "Nenhuma tarefa ainda",
    "dashboard.noTasks.description": "Crie uma tarefa para começar a organizar o dia.",
    "dashboard.untitledTask": "Tarefa sem título",
    "dashboard.task": "Tarefa",
    "dashboard.demoTask.project": "Revisar proposta do projeto",
    "dashboard.demoTask.emails": "Responder e-mails importantes",
    "dashboard.demoTask.chapter": "Estudar capítulo 4",
    "dashboard.demoTask.workout": "Treino de força",
    "dashboard.demoTask.read": "Ler 20 páginas",
    "dashboard.category.work": "Trabalho",
    "dashboard.category.study": "Estudos",
    "dashboard.category.health": "Saúde",
    "dashboard.category.personal": "Pessoal"
  },
  "pt-PT": {
    "nav.dashboard": "Início",
    "nav.timeline": "Linha temporal",
    "dashboard.pageTitle": "Fluir | Início",
    "dashboard.focusToday": "Foco de hoje",
    "dashboard.keepGoing": "Continua assim.",
    "dashboard.mainPanel": "Painel principal",
    "dashboard.welcome": "Olá, {name}",
    "dashboard.subtitle.calm": "Respira fundo. Um dia de cada vez, ao teu ritmo.",
    "dashboard.subtitle.direct": "Vê as tuas prioridades e segue para o próximo passo.",
    "dashboard.subtitle.motivating": "Estás a construir consistência. Continua a avançar.",
    "dashboard.subtitle.gentle": "Com calma e leveza, hoje também pode fluir.",
    "dashboard.subtitle.neutral": "Acompanha a tua rotina, os teus registos e os próximos passos.",
    "dashboard.notifications": "Notificações",
    "dashboard.configureNotifications": "Configurar notificações",
    "dashboard.welcomeNotification": "Boas-vindas ao Fluir!",
    "dashboard.exploreModules": "Explora os teus módulos na barra lateral.",
    "dashboard.twoHoursAgo": "há 2 horas",
    "dashboard.profilePhoto": "Foto de perfil",
    "dashboard.changePhoto": "Alterar foto",
    "dashboard.goToSettings": "Ir para definições",
    "dashboard.tasksCompleted": "{completed} de {total} concluídas",
    "dashboard.habitsCompleted": "{completed} de {total} concluídos",
    "dashboard.noRecord": "sem registo",
    "dashboard.lastRecord": "último registo",
    "dashboard.goal": "meta {goal}",
    "dashboard.ofGoalMl": "de {goal} ml",
    "dashboard.currentBalance": "saldo atual",
    "dashboard.income": "Entrada {value}",
    "dashboard.expense": "Saída - {value}",
    "dashboard.entryToday": "entrada hoje",
    "dashboard.entriesToday": "entradas hoje",
    "dashboard.tasksToday": "Tarefas de hoje",
    "dashboard.newTask": "Nova tarefa",
    "dashboard.viewAllTasks": "Ver todas as tarefas →",
    "dashboard.viewFullTimeline": "Ver linha temporal completa →",
    "dashboard.activeHabits": "Hábitos ativos",
    "dashboard.viewAll": "Ver todos",
    "dashboard.viewEntries": "Ver entradas →",
    "dashboard.timeline.wokeUp": "Acordei",
    "dashboard.timeline.wokeUpDesc": "Dormi bem e sinto-me com energia.",
    "dashboard.timeline.breakfast": "Pequeno-almoço",
    "dashboard.timeline.breakfastDesc": "Aveia com fruta e café.",
    "dashboard.timeline.meeting": "Reunião de alinhamento",
    "dashboard.timeline.meetingDesc": "Projeto Fluir — sprint semanal.",
    "dashboard.timeline.walk": "Caminhada",
    "dashboard.timeline.walkDesc": "20 minutos ao ar livre.",
    "dashboard.timeline.diary": "Diário emocional",
    "dashboard.timeline.diaryDesc": "Reflexão sobre o dia.",
    "dashboard.habit.meditate": "Meditar 10 min",
    "dashboard.habit.read": "Ler diariamente",
    "dashboard.habit.workout": "Treinar",
    "dashboard.habit.water": "Beber 2 L de água",
    "dashboard.noDiaryEntries": "Ainda não há entradas no diário.",
    "dashboard.lastDiaryEntry": "Última entrada registada.",
    "dashboard.recentEvents": "Eventos recentes",
    "dashboard.recentEventsSubtitle": "O que aconteceu nos últimos dias.",
    "dashboard.today": "Hoje",
    "dashboard.noRecentEvents": "Nenhum evento recente",
    "dashboard.moduleRecordsHere": "Os registos dos módulos aparecerão aqui.",
    "dashboard.event": "Evento",
    "dashboard.empty.title": "O teu início está mais leve por enquanto.",
    "dashboard.empty.description": "Escolheste poucas funcionalidades, por isso o Fluir deixou o ecrã mais simples. Quando quiseres, vai a Definições para ativar novas áreas como tarefas, sono, água, finanças, diário, alimentação ou saúde.",
    "dashboard.noTasks.title": "Ainda não há tarefas",
    "dashboard.noTasks.description": "Cria uma tarefa para começares a organizar o dia.",
    "dashboard.untitledTask": "Tarefa sem título",
    "dashboard.task": "Tarefa",
    "dashboard.demoTask.project": "Rever proposta do projeto",
    "dashboard.demoTask.emails": "Responder a e-mails importantes",
    "dashboard.demoTask.chapter": "Estudar o capítulo 4",
    "dashboard.demoTask.workout": "Treino de força",
    "dashboard.demoTask.read": "Ler 20 páginas",
    "dashboard.category.work": "Trabalho",
    "dashboard.category.study": "Estudos",
    "dashboard.category.health": "Saúde",
    "dashboard.category.personal": "Pessoal"
  },
  "en": {
    "nav.dashboard": "Dashboard",
    "nav.timeline": "Timeline",
    "dashboard.pageTitle": "Fluir | Dashboard",
    "dashboard.focusToday": "Today's focus",
    "dashboard.keepGoing": "Keep it up.",
    "dashboard.mainPanel": "Main dashboard",
    "dashboard.welcome": "Hello, {name}",
    "dashboard.subtitle.calm": "Take a breath. One day at a time, at your own pace.",
    "dashboard.subtitle.direct": "Check your priorities and move on to the next step.",
    "dashboard.subtitle.motivating": "You're building consistency. Keep moving forward.",
    "dashboard.subtitle.gentle": "With calm and ease, today can flow too.",
    "dashboard.subtitle.neutral": "Keep track of your routine, records, and next steps.",
    "dashboard.notifications": "Notifications",
    "dashboard.configureNotifications": "Notification settings",
    "dashboard.welcomeNotification": "Welcome to Fluir!",
    "dashboard.exploreModules": "Explore your modules in the sidebar.",
    "dashboard.twoHoursAgo": "2 hours ago",
    "dashboard.profilePhoto": "Profile photo",
    "dashboard.changePhoto": "Change photo",
    "dashboard.goToSettings": "Go to settings",
    "dashboard.tasksCompleted": "{completed} of {total} completed",
    "dashboard.habitsCompleted": "{completed} of {total} completed",
    "dashboard.noRecord": "no record",
    "dashboard.lastRecord": "latest record",
    "dashboard.goal": "goal {goal}",
    "dashboard.ofGoalMl": "of {goal} ml",
    "dashboard.currentBalance": "current balance",
    "dashboard.income": "Income {value}",
    "dashboard.expense": "Expense - {value}",
    "dashboard.entryToday": "entry today",
    "dashboard.entriesToday": "entries today",
    "dashboard.tasksToday": "Today's tasks",
    "dashboard.newTask": "New task",
    "dashboard.viewAllTasks": "View all tasks →",
    "dashboard.viewFullTimeline": "View full timeline →",
    "dashboard.activeHabits": "Active habits",
    "dashboard.viewAll": "View all",
    "dashboard.viewEntries": "View entries →",
    "dashboard.timeline.wokeUp": "Woke up",
    "dashboard.timeline.wokeUpDesc": "Slept well and feel energized.",
    "dashboard.timeline.breakfast": "Breakfast",
    "dashboard.timeline.breakfastDesc": "Oatmeal with fruit and coffee.",
    "dashboard.timeline.meeting": "Alignment meeting",
    "dashboard.timeline.meetingDesc": "Fluir project — weekly sprint.",
    "dashboard.timeline.walk": "Walk",
    "dashboard.timeline.walkDesc": "20 minutes outdoors.",
    "dashboard.timeline.diary": "Emotional diary",
    "dashboard.timeline.diaryDesc": "Reflection on the day.",
    "dashboard.habit.meditate": "Meditate for 10 min",
    "dashboard.habit.read": "Read daily",
    "dashboard.habit.workout": "Work out",
    "dashboard.habit.water": "Drink 2 L of water",
    "dashboard.noDiaryEntries": "No diary entries yet.",
    "dashboard.lastDiaryEntry": "Latest entry recorded.",
    "dashboard.recentEvents": "Recent events",
    "dashboard.recentEventsSubtitle": "What happened over the last few days.",
    "dashboard.today": "Today",
    "dashboard.noRecentEvents": "No recent events",
    "dashboard.moduleRecordsHere": "Records from your modules will appear here.",
    "dashboard.event": "Event",
    "dashboard.empty.title": "Your dashboard is lighter for now.",
    "dashboard.empty.description": "You selected only a few features, so Fluir simplified the screen. You can go to Settings whenever you want to enable more areas such as tasks, sleep, water, finances, diary, nutrition, or health.",
    "dashboard.noTasks.title": "No tasks yet",
    "dashboard.noTasks.description": "Create a task to start organizing your day.",
    "dashboard.untitledTask": "Untitled task",
    "dashboard.task": "Task",
    "dashboard.demoTask.project": "Review project proposal",
    "dashboard.demoTask.emails": "Reply to important emails",
    "dashboard.demoTask.chapter": "Study chapter 4",
    "dashboard.demoTask.workout": "Strength training",
    "dashboard.demoTask.read": "Read 20 pages",
    "dashboard.category.work": "Work",
    "dashboard.category.study": "Study",
    "dashboard.category.health": "Health",
    "dashboard.category.personal": "Personal"
  },
  "es": {
    "nav.dashboard": "Inicio",
    "nav.timeline": "Línea de tiempo",
    "dashboard.pageTitle": "Fluir | Inicio",
    "dashboard.focusToday": "Enfoque de hoy",
    "dashboard.keepGoing": "Sigue así.",
    "dashboard.mainPanel": "Panel principal",
    "dashboard.welcome": "Hola, {name}",
    "dashboard.subtitle.calm": "Respira hondo. Un día a la vez, a tu propio ritmo.",
    "dashboard.subtitle.direct": "Revisa tus prioridades y continúa con el siguiente paso.",
    "dashboard.subtitle.motivating": "Estás construyendo constancia. Sigue avanzando.",
    "dashboard.subtitle.gentle": "Con calma y ligereza, hoy también puede fluir.",
    "dashboard.subtitle.neutral": "Sigue tu rutina, tus registros y tus próximos pasos.",
    "dashboard.notifications": "Notificaciones",
    "dashboard.configureNotifications": "Configurar notificaciones",
    "dashboard.welcomeNotification": "¡Bienvenido a Fluir!",
    "dashboard.exploreModules": "Explora tus módulos en la barra lateral.",
    "dashboard.twoHoursAgo": "hace 2 horas",
    "dashboard.profilePhoto": "Foto de perfil",
    "dashboard.changePhoto": "Cambiar foto",
    "dashboard.goToSettings": "Ir a configuración",
    "dashboard.tasksCompleted": "{completed} de {total} completadas",
    "dashboard.habitsCompleted": "{completed} de {total} completados",
    "dashboard.noRecord": "sin registro",
    "dashboard.lastRecord": "último registro",
    "dashboard.goal": "meta {goal}",
    "dashboard.ofGoalMl": "de {goal} ml",
    "dashboard.currentBalance": "saldo actual",
    "dashboard.income": "Ingreso {value}",
    "dashboard.expense": "Gasto - {value}",
    "dashboard.entryToday": "entrada hoy",
    "dashboard.entriesToday": "entradas hoy",
    "dashboard.tasksToday": "Tareas de hoy",
    "dashboard.newTask": "Nueva tarea",
    "dashboard.viewAllTasks": "Ver todas las tareas →",
    "dashboard.viewFullTimeline": "Ver línea de tiempo completa →",
    "dashboard.activeHabits": "Hábitos activos",
    "dashboard.viewAll": "Ver todos",
    "dashboard.viewEntries": "Ver entradas →",
    "dashboard.timeline.wokeUp": "Me desperté",
    "dashboard.timeline.wokeUpDesc": "Dormí bien y me siento con energía.",
    "dashboard.timeline.breakfast": "Desayuno",
    "dashboard.timeline.breakfastDesc": "Avena con frutas y café.",
    "dashboard.timeline.meeting": "Reunión de coordinación",
    "dashboard.timeline.meetingDesc": "Proyecto Fluir — sprint semanal.",
    "dashboard.timeline.walk": "Caminata",
    "dashboard.timeline.walkDesc": "20 minutos al aire libre.",
    "dashboard.timeline.diary": "Diario emocional",
    "dashboard.timeline.diaryDesc": "Reflexión sobre el día.",
    "dashboard.habit.meditate": "Meditar 10 min",
    "dashboard.habit.read": "Leer a diario",
    "dashboard.habit.workout": "Entrenar",
    "dashboard.habit.water": "Beber 2 L de agua",
    "dashboard.noDiaryEntries": "Aún no hay entradas en el diario.",
    "dashboard.lastDiaryEntry": "Última entrada registrada.",
    "dashboard.recentEvents": "Eventos recientes",
    "dashboard.recentEventsSubtitle": "Lo que ocurrió en los últimos días.",
    "dashboard.today": "Hoy",
    "dashboard.noRecentEvents": "No hay eventos recientes",
    "dashboard.moduleRecordsHere": "Los registros de los módulos aparecerán aquí.",
    "dashboard.event": "Evento",
    "dashboard.empty.title": "Tu inicio está más ligero por ahora.",
    "dashboard.empty.description": "Elegiste pocas funciones, así que Fluir simplificó la pantalla. Cuando quieras, ve a Configuración para activar más áreas como tareas, sueño, agua, finanzas, diario, alimentación o salud.",
    "dashboard.noTasks.title": "Aún no hay tareas",
    "dashboard.noTasks.description": "Crea una tarea para empezar a organizar el día.",
    "dashboard.untitledTask": "Tarea sin título",
    "dashboard.task": "Tarea",
    "dashboard.demoTask.project": "Revisar la propuesta del proyecto",
    "dashboard.demoTask.emails": "Responder correos importantes",
    "dashboard.demoTask.chapter": "Estudiar el capítulo 4",
    "dashboard.demoTask.workout": "Entrenamiento de fuerza",
    "dashboard.demoTask.read": "Leer 20 páginas",
    "dashboard.category.work": "Trabajo",
    "dashboard.category.study": "Estudios",
    "dashboard.category.health": "Salud",
    "dashboard.category.personal": "Personal"
  }
};

Object.entries(DASHBOARD_TRANSLATIONS).forEach(([language, entries]) => {
  translations[language] = {
    ...(translations[language] || {}),
    ...entries
  };
});



  const SHARED_I18N_TRANSLATIONS = {
    "pt-BR": {
      "common.you": "Você",
      "common.light": "Claro",
      "common.dark": "Escuro",
      "sidebar.tagline": "Sistema de Organização da Vida",
      "sidebar.mainNavigation": "Navegação principal",
      "dashboard.sidebarQuote": "Pequenas ações constantes constroem mudanças profundas.",
      "mobile.goToProfile": "Ir para o perfil",
      "mobile.openMenu": "Abrir menu",
      "mobile.systemMenu": "Menu do sistema",
      "mobile.menu": "Menu",
      "mobile.chooseArea": "Escolha uma área do Fluir",
      "mobile.closeMenu": "Fechar menu",
      "mobile.mainNavigation": "Navegação principal mobile",
      "mobile.more": "Mais",
      "mobile.defaultUser": "Usuário",
      "mobile.userProfile": "Perfil do usuário",
      "mobile.timelineShort": "Linha"
    },

    "pt-PT": {
      "common.you": "Tu",
      "common.light": "Claro",
      "common.dark": "Escuro",
      "sidebar.tagline": "Sistema de Organização da Vida",
      "sidebar.mainNavigation": "Navegação principal",
      "dashboard.sidebarQuote": "Pequenas ações constantes constroem mudanças profundas.",
      "mobile.goToProfile": "Ir para o perfil",
      "mobile.openMenu": "Abrir menu",
      "mobile.systemMenu": "Menu do sistema",
      "mobile.menu": "Menu",
      "mobile.chooseArea": "Escolhe uma área do Fluir",
      "mobile.closeMenu": "Fechar menu",
      "mobile.mainNavigation": "Navegação principal móvel",
      "mobile.more": "Mais",
      "mobile.defaultUser": "Utilizador",
      "mobile.userProfile": "Perfil do utilizador",
      "mobile.timelineShort": "Linha"
    },

    en: {
      "common.you": "You",
      "common.light": "Light",
      "common.dark": "Dark",
      "sidebar.tagline": "Life Organization System",
      "sidebar.mainNavigation": "Main navigation",
      "dashboard.sidebarQuote": "Small, consistent actions create meaningful change.",
      "mobile.goToProfile": "Go to profile",
      "mobile.openMenu": "Open menu",
      "mobile.systemMenu": "System menu",
      "mobile.menu": "Menu",
      "mobile.chooseArea": "Choose a Fluir area",
      "mobile.closeMenu": "Close menu",
      "mobile.mainNavigation": "Main mobile navigation",
      "mobile.more": "More",
      "mobile.defaultUser": "User",
      "mobile.userProfile": "User profile",
      "mobile.timelineShort": "Timeline"
    },

    es: {
      "common.you": "Tú",
      "common.light": "Claro",
      "common.dark": "Oscuro",
      "sidebar.tagline": "Sistema de Organización de la Vida",
      "sidebar.mainNavigation": "Navegación principal",
      "dashboard.sidebarQuote": "Las pequeñas acciones constantes construyen cambios profundos.",
      "mobile.goToProfile": "Ir al perfil",
      "mobile.openMenu": "Abrir menú",
      "mobile.systemMenu": "Menú del sistema",
      "mobile.menu": "Menú",
      "mobile.chooseArea": "Elige un área de Fluir",
      "mobile.closeMenu": "Cerrar menú",
      "mobile.mainNavigation": "Navegación principal móvil",
      "mobile.more": "Más",
      "mobile.defaultUser": "Usuario",
      "mobile.userProfile": "Perfil del usuario",
      "mobile.timelineShort": "Línea"
    }
  };

  Object.entries(SHARED_I18N_TRANSLATIONS).forEach(([language, entries]) => {
    translations[language] = {
      ...(translations[language] || {}),
      ...entries
    };
  });


  /* =====================================================
     FLUIR — I18N V2
     Amplia cobertura sem obrigar cada tela antiga a ser
     migrada de uma vez. Textos reconhecidos continuam
     traduzíveis, inclusive conteúdo renderizado depois.
     ===================================================== */

  const I18N_V2_TRANSLATIONS = {
    "pt-BR": {
      "nav.plans": "Planos e preços",
      "settings.language": "Idioma",
      "settings.appearance": "Aparência",
      "settings.support": "Ajuda e feedback",
      "feedback.translation": "Problema de tradução",
      "feedback.system": "Erro do sistema",
      "feedback.accessibility": "Acessibilidade",
      "feedback.suggestion": "Sugestão",
      "feedback.other": "Outro"
    },
    "pt-PT": {
      "nav.plans": "Planos e preços",
      "settings.language": "Idioma",
      "settings.appearance": "Aparência",
      "settings.support": "Ajuda e feedback",
      "feedback.translation": "Problema de tradução",
      "feedback.system": "Erro do sistema",
      "feedback.accessibility": "Acessibilidade",
      "feedback.suggestion": "Sugestão",
      "feedback.other": "Outro"
    },
    en: {
      "nav.plans": "Plans and pricing",
      "settings.language": "Language",
      "settings.appearance": "Appearance",
      "settings.support": "Help & feedback",
      "feedback.translation": "Translation issue",
      "feedback.system": "System error",
      "feedback.accessibility": "Accessibility",
      "feedback.suggestion": "Suggestion",
      "feedback.other": "Other"
    },
    es: {
      "nav.plans": "Planes y precios",
      "settings.language": "Idioma",
      "settings.appearance": "Apariencia",
      "settings.support": "Ayuda y comentarios",
      "feedback.translation": "Problema de traducción",
      "feedback.system": "Error del sistema",
      "feedback.accessibility": "Accesibilidad",
      "feedback.suggestion": "Sugerencia",
      "feedback.other": "Otro"
    },
    fr: {
      "nav.dashboard": "Accueil",
      "nav.timeline": "Chronologie",
      "nav.tasks": "Tâches",
      "nav.habits": "Habitudes",
      "nav.sleep": "Sommeil",
      "nav.water": "Eau",
      "nav.finances": "Finances",
      "nav.diary": "Journal émotionnel",
      "nav.nutrition": "Alimentation",
      "nav.physicalHealth": "Santé physique",
      "nav.menstrualCycle": "Cycle menstruel",
      "nav.attachments": "Pièces jointes",
      "nav.achievements": "Réussites",
      "nav.settings": "Paramètres",
      "nav.profile": "Profil",
      "nav.plans": "Offres et tarifs",
      "settings.language": "Langue",
      "settings.appearance": "Apparence",
      "settings.support": "Aide et retours",
      "feedback.translation": "Problème de traduction",
      "feedback.system": "Erreur du système",
      "feedback.accessibility": "Accessibilité",
      "feedback.suggestion": "Suggestion",
      "feedback.other": "Autre"
    },
    de: {
      "nav.dashboard": "Start",
      "nav.timeline": "Zeitleiste",
      "nav.tasks": "Aufgaben",
      "nav.habits": "Gewohnheiten",
      "nav.sleep": "Schlaf",
      "nav.water": "Wasser",
      "nav.finances": "Finanzen",
      "nav.diary": "Emotionstagebuch",
      "nav.nutrition": "Ernährung",
      "nav.physicalHealth": "Körperliche Gesundheit",
      "nav.menstrualCycle": "Menstruationszyklus",
      "nav.attachments": "Anhänge",
      "nav.achievements": "Erfolge",
      "nav.settings": "Einstellungen",
      "nav.profile": "Profil",
      "nav.plans": "Tarife und Preise",
      "settings.language": "Sprache",
      "settings.appearance": "Darstellung",
      "settings.support": "Hilfe & Feedback",
      "feedback.translation": "Übersetzungsproblem",
      "feedback.system": "Systemfehler",
      "feedback.accessibility": "Barrierefreiheit",
      "feedback.suggestion": "Vorschlag",
      "feedback.other": "Sonstiges"
    },
    it: {
      "nav.dashboard": "Home",
      "nav.timeline": "Cronologia",
      "nav.tasks": "Attività",
      "nav.habits": "Abitudini",
      "nav.sleep": "Sonno",
      "nav.water": "Acqua",
      "nav.finances": "Finanze",
      "nav.diary": "Diario emotivo",
      "nav.nutrition": "Alimentazione",
      "nav.physicalHealth": "Salute fisica",
      "nav.menstrualCycle": "Ciclo mestruale",
      "nav.attachments": "Allegati",
      "nav.achievements": "Traguardi",
      "nav.settings": "Impostazioni",
      "nav.profile": "Profilo",
      "nav.plans": "Piani e prezzi",
      "settings.language": "Lingua",
      "settings.appearance": "Aspetto",
      "settings.support": "Aiuto e feedback",
      "feedback.translation": "Problema di traduzione",
      "feedback.system": "Errore di sistema",
      "feedback.accessibility": "Accessibilità",
      "feedback.suggestion": "Suggerimento",
      "feedback.other": "Altro"
    }
  };

  Object.entries(I18N_V2_TRANSLATIONS).forEach(([language, entries]) => {
    translations[language] = {
      ...(translations[language] || {}),
      ...entries
    };
  });

  const LEGACY_TEXT_TRANSLATIONS = {
    "pt-PT": {
      "Configurações": "Definições",
      "Ir para configurações": "Ir para definições",
      "Usuário": "Utilizador",
      "Linha do tempo": "Linha temporal",
      "Novo registro": "Novo registo",
      "Últimos registros": "Últimos registos",
      "Registros": "Registos",
      "Registros de hoje": "Registos de hoje",
      "Registros na semana": "Registos na semana"
    },
    en: {
      "Configurações": "Settings",
      "Ir para configurações": "Go to settings",
      "Trocar foto": "Change photo",
      "Notificações": "Notifications",
      "Configurar notificações": "Notification settings",
      "Bem-vindo ao Fluir!": "Welcome to Fluir!",
      "Explore seus módulos na barra lateral.": "Explore your modules in the sidebar.",
      "Hoje": "Today",
      "Ontem": "Yesterday",
      "Amanhã": "Tomorrow",
      "Esta semana": "This week",
      "Este mês": "This month",
      "Todas": "All",
      "Todos": "All",
      "Tudo": "All",
      "Total": "Total",
      "Semana": "Week",
      "Meta": "Goal",
      "Tarefas": "Tasks",
      "Hábitos": "Habits",
      "Sono": "Sleep",
      "Água": "Water",
      "Finanças": "Finances",
      "Diário emocional": "Emotional diary",
      "Diário": "Diary",
      "Alimentação": "Nutrition",
      "Saúde física": "Physical health",
      "Ciclo menstrual": "Menstrual cycle",
      "Anexos": "Attachments",
      "Conquistas": "Achievements",
      "Perfil": "Profile",
      "Planos e preços": "Plans and pricing",
      "Categoria": "Category",
      "Categorias": "Categories",
      "Tipo": "Type",
      "Título": "Title",
      "Descrição": "Description",
      "Observação opcional": "Optional note",
      "Registro rápido": "Quick entry",
      "Resumo semanal": "Weekly summary",
      "Resumo do dia": "Day summary",
      "Últimos registros": "Latest records",
      "Últimas ações": "Recent actions",
      "Nenhum registro encontrado": "No records found",
      "Nenhuma tarefa encontrada": "No tasks found",
      "Nenhum hábito encontrado": "No habits found",
      "Nenhuma entrada encontrada": "No entries found",
      "Nenhuma refeição encontrada": "No meals found",
      "Nenhum lançamento encontrado": "No transactions found",
      "Pendentes": "Pending",
      "Concluídas": "Completed",
      "Atrasadas": "Overdue",
      "Alta prioridade": "High priority",
      "Prioridade": "Priority",
      "Baixa": "Low",
      "Média": "Medium",
      "Alta": "High",
      "Boa": "Good",
      "Ruim": "Poor",
      "Leve": "Light",
      "Neutro": "Neutral",
      "Pesado": "Heavy",
      "Pessoal": "Personal",
      "Trabalho": "Work",
      "Estudos": "Study",
      "Casa": "Home",
      "Saúde": "Health",
      "Projetos": "Projects",
      "Autocuidado": "Self-care",
      "Produtividade": "Productivity",
      "Cancelar": "Cancel",
      "Fechar": "Close",
      "Conectar": "Connect",
      "Claro": "Light",
      "Escuro": "Dark",
      "Idioma": "Language",
      "Aparência": "Appearance",
      "Privacidade": "Privacy",
      "Integrações": "Integrations",
      "Dados": "Data",
      "Bem-vindo de volta": "Welcome back",
      "Criar conta": "Create account",
      "Entrar": "Sign in",
      "Cadastrar": "Sign up",
      "E-mail": "Email",
      "Senha": "Password",
      "Confirmar senha": "Confirm password",
      "Mostrar senha": "Show password",
      "Lembrar de mim": "Remember me",
      "Esqueci minha senha": "Forgot my password",
      "Seu nome": "Your name",
      "Configuração inicial": "Initial setup",
      "Sobre você": "About you",
      "Funcionalidades": "Features",
      "Preferências": "Preferences",
      "Selecione uma opção": "Select an option",
      "Prefiro não informar": "Prefer not to say",
      "Personalizado": "Custom",
      "Idade": "Age",
      "Pronomes": "Pronouns",
      "Informações pessoais": "Personal information",
      "Sobre mim": "About me",
      "Segurança da conta": "Account security",
      "Alterar senha": "Change password",
      "Verificação em duas etapas": "Two-step verification",
      "Atividade recente": "Recent activity",
      "Editar perfil": "Edit profile",
      "Resumo pessoal": "Personal summary"
    },
    es: {
      "Configurações": "Configuración",
      "Ir para configurações": "Ir a configuración",
      "Trocar foto": "Cambiar foto",
      "Notificações": "Notificaciones",
      "Configurar notificações": "Configurar notificaciones",
      "Bem-vindo ao Fluir!": "¡Bienvenido a Fluir!",
      "Explore seus módulos na barra lateral.": "Explora tus módulos en la barra lateral.",
      "Hoje": "Hoy",
      "Ontem": "Ayer",
      "Amanhã": "Mañana",
      "Todas": "Todas",
      "Todos": "Todos",
      "Tudo": "Todo",
      "Semana": "Semana",
      "Meta": "Meta",
      "Tarefas": "Tareas",
      "Hábitos": "Hábitos",
      "Sono": "Sueño",
      "Água": "Agua",
      "Finanças": "Finanzas",
      "Diário emocional": "Diario emocional",
      "Diário": "Diario",
      "Alimentação": "Alimentación",
      "Saúde física": "Salud física",
      "Ciclo menstrual": "Ciclo menstrual",
      "Anexos": "Archivos",
      "Conquistas": "Logros",
      "Perfil": "Perfil",
      "Planos e preços": "Planes y precios",
      "Categoria": "Categoría",
      "Tipo": "Tipo",
      "Descrição": "Descripción",
      "Observação opcional": "Observación opcional",
      "Registro rápido": "Registro rápido",
      "Resumo semanal": "Resumen semanal",
      "Resumo do dia": "Resumen del día",
      "Últimos registros": "Últimos registros",
      "Últimas ações": "Últimas acciones",
      "Nenhum registro encontrado": "No se encontraron registros",
      "Nenhuma tarefa encontrada": "No se encontraron tareas",
      "Nenhum hábito encontrado": "No se encontraron hábitos",
      "Nenhuma entrada encontrada": "No se encontraron entradas",
      "Nenhuma refeição encontrada": "No se encontraron comidas",
      "Pendentes": "Pendientes",
      "Concluídas": "Completadas",
      "Atrasadas": "Atrasadas",
      "Alta prioridade": "Alta prioridad",
      "Prioridade": "Prioridad",
      "Cancelar": "Cancelar",
      "Fechar": "Cerrar",
      "Conectar": "Conectar",
      "Claro": "Claro",
      "Escuro": "Oscuro",
      "Idioma": "Idioma",
      "Aparência": "Apariencia",
      "Privacidade": "Privacidad",
      "Integrações": "Integraciones",
      "Dados": "Datos",
      "Bem-vindo de volta": "Bienvenido de nuevo",
      "Criar conta": "Crear cuenta",
      "Entrar": "Entrar",
      "Cadastrar": "Registrarse",
      "Senha": "Contraseña",
      "Confirmar senha": "Confirmar contraseña",
      "Mostrar senha": "Mostrar contraseña",
      "Lembrar de mim": "Recordarme",
      "Esqueci minha senha": "Olvidé mi contraseña",
      "Seu nome": "Tu nombre",
      "Configuração inicial": "Configuración inicial",
      "Sobre você": "Sobre ti",
      "Funcionalidades": "Funciones",
      "Preferências": "Preferencias",
      "Selecione uma opção": "Selecciona una opción",
      "Prefiro não informar": "Prefiero no indicarlo",
      "Personalizado": "Personalizado",
      "Idade": "Edad",
      "Pronomes": "Pronombres",
      "Informações pessoais": "Información personal",
      "Sobre mim": "Sobre mí",
      "Segurança da conta": "Seguridad de la cuenta",
      "Alterar senha": "Cambiar contraseña",
      "Verificação em duas etapas": "Verificación en dos pasos",
      "Atividade recente": "Actividad reciente",
      "Editar perfil": "Editar perfil",
      "Resumo pessoal": "Resumen personal"
    },
    fr: {
      "Configurações": "Paramètres",
      "Ir para configurações": "Aller aux paramètres",
      "Trocar foto": "Changer la photo",
      "Notificações": "Notifications",
      "Hoje": "Aujourd'hui",
      "Ontem": "Hier",
      "Amanhã": "Demain",
      "Todas": "Toutes",
      "Todos": "Tous",
      "Tudo": "Tout",
      "Semana": "Semaine",
      "Meta": "Objectif",
      "Tarefas": "Tâches",
      "Hábitos": "Habitudes",
      "Sono": "Sommeil",
      "Água": "Eau",
      "Finanças": "Finances",
      "Diário emocional": "Journal émotionnel",
      "Diário": "Journal",
      "Alimentação": "Alimentation",
      "Saúde física": "Santé physique",
      "Ciclo menstrual": "Cycle menstruel",
      "Anexos": "Pièces jointes",
      "Conquistas": "Réussites",
      "Perfil": "Profil",
      "Categoria": "Catégorie",
      "Tipo": "Type",
      "Título": "Titre",
      "Descrição": "Description",
      "Observação opcional": "Note facultative",
      "Registro rápido": "Saisie rapide",
      "Resumo semanal": "Résumé hebdomadaire",
      "Últimos registros": "Derniers enregistrements",
      "Últimas ações": "Actions récentes",
      "Nenhum registro encontrado": "Aucun enregistrement trouvé",
      "Cancelar": "Annuler",
      "Fechar": "Fermer",
      "Claro": "Clair",
      "Escuro": "Sombre",
      "Idioma": "Langue",
      "Aparência": "Apparence",
      "Privacidade": "Confidentialité",
      "Integrações": "Intégrations",
      "Dados": "Données",
      "Bem-vindo de volta": "Bon retour",
      "Criar conta": "Créer un compte",
      "Entrar": "Se connecter",
      "Cadastrar": "S'inscrire",
      "Senha": "Mot de passe",
      "Confirmar senha": "Confirmer le mot de passe",
      "Mostrar senha": "Afficher le mot de passe",
      "Lembrar de mim": "Se souvenir de moi",
      "Seu nome": "Votre nom",
      "Configuração inicial": "Configuration initiale",
      "Sobre você": "À propos de vous",
      "Funcionalidades": "Fonctionnalités",
      "Preferências": "Préférences"
    },
    de: {
      "Configurações": "Einstellungen",
      "Ir para configurações": "Zu den Einstellungen",
      "Trocar foto": "Foto ändern",
      "Notificações": "Benachrichtigungen",
      "Hoje": "Heute",
      "Ontem": "Gestern",
      "Amanhã": "Morgen",
      "Todas": "Alle",
      "Todos": "Alle",
      "Tudo": "Alle",
      "Semana": "Woche",
      "Meta": "Ziel",
      "Tarefas": "Aufgaben",
      "Hábitos": "Gewohnheiten",
      "Sono": "Schlaf",
      "Água": "Wasser",
      "Finanças": "Finanzen",
      "Diário emocional": "Emotionstagebuch",
      "Diário": "Tagebuch",
      "Alimentação": "Ernährung",
      "Saúde física": "Körperliche Gesundheit",
      "Ciclo menstrual": "Menstruationszyklus",
      "Anexos": "Anhänge",
      "Conquistas": "Erfolge",
      "Perfil": "Profil",
      "Categoria": "Kategorie",
      "Tipo": "Typ",
      "Título": "Titel",
      "Descrição": "Beschreibung",
      "Observação opcional": "Optionale Notiz",
      "Registro rápido": "Schnelleingabe",
      "Resumo semanal": "Wochenübersicht",
      "Últimos registros": "Letzte Einträge",
      "Últimas ações": "Letzte Aktionen",
      "Nenhum registro encontrado": "Keine Einträge gefunden",
      "Cancelar": "Abbrechen",
      "Fechar": "Schließen",
      "Claro": "Hell",
      "Escuro": "Dunkel",
      "Idioma": "Sprache",
      "Aparência": "Darstellung",
      "Privacidade": "Datenschutz",
      "Integrações": "Integrationen",
      "Dados": "Daten",
      "Bem-vindo de volta": "Willkommen zurück",
      "Criar conta": "Konto erstellen",
      "Entrar": "Anmelden",
      "Cadastrar": "Registrieren",
      "Senha": "Passwort",
      "Confirmar senha": "Passwort bestätigen",
      "Mostrar senha": "Passwort anzeigen",
      "Lembrar de mim": "Angemeldet bleiben",
      "Seu nome": "Dein Name",
      "Configuração inicial": "Ersteinrichtung",
      "Sobre você": "Über dich",
      "Funcionalidades": "Funktionen",
      "Preferências": "Präferenzen"
    },
    it: {
      "Configurações": "Impostazioni",
      "Ir para configurações": "Vai alle impostazioni",
      "Trocar foto": "Cambia foto",
      "Notificações": "Notifiche",
      "Hoje": "Oggi",
      "Ontem": "Ieri",
      "Amanhã": "Domani",
      "Todas": "Tutte",
      "Todos": "Tutti",
      "Tudo": "Tutto",
      "Semana": "Settimana",
      "Meta": "Obiettivo",
      "Tarefas": "Attività",
      "Hábitos": "Abitudini",
      "Sono": "Sonno",
      "Água": "Acqua",
      "Finanças": "Finanze",
      "Diário emocional": "Diario emotivo",
      "Diário": "Diario",
      "Alimentação": "Alimentazione",
      "Saúde física": "Salute fisica",
      "Ciclo menstrual": "Ciclo mestruale",
      "Anexos": "Allegati",
      "Conquistas": "Traguardi",
      "Perfil": "Profilo",
      "Categoria": "Categoria",
      "Tipo": "Tipo",
      "Título": "Titolo",
      "Descrição": "Descrizione",
      "Observação opcional": "Nota facoltativa",
      "Registro rápido": "Registrazione rapida",
      "Resumo semanal": "Riepilogo settimanale",
      "Últimos registros": "Ultimi registri",
      "Últimas ações": "Azioni recenti",
      "Nenhum registro encontrado": "Nessun registro trovato",
      "Cancelar": "Annulla",
      "Fechar": "Chiudi",
      "Claro": "Chiaro",
      "Escuro": "Scuro",
      "Idioma": "Lingua",
      "Aparência": "Aspetto",
      "Privacidade": "Privacy",
      "Integrações": "Integrazioni",
      "Dados": "Dati",
      "Bem-vindo de volta": "Bentornato",
      "Criar conta": "Crea account",
      "Entrar": "Accedi",
      "Cadastrar": "Registrati",
      "Senha": "Password",
      "Confirmar senha": "Conferma password",
      "Mostrar senha": "Mostra password",
      "Lembrar de mim": "Ricordami",
      "Seu nome": "Il tuo nome",
      "Configuração inicial": "Configurazione iniziale",
      "Sobre você": "Su di te",
      "Funcionalidades": "Funzionalità",
      "Preferências": "Preferenze"
    }
  };

  const LEGACY_USER_CONTENT = /(task-item|habit-item|diary-entry|attachment-item|transaction-item|finance-item|meal-item|nutrition-item|health-item|cycle-item|sleep-item|user-created-event)/i;
  let legacyObserver = null;
  let applyingLegacyTranslation = false;

  function translateLegacyString(value, language = getLanguage()) {
    const source = String(value || "");
    const trimmed = source.trim();

    if (!trimmed || language === DEFAULT_LANGUAGE) {
      return source;
    }

    const exact = LEGACY_TEXT_TRANSLATIONS[language]?.[trimmed];
    let translated = exact || trimmed;

    const greeting = trimmed.match(/^Olá,\s*(.+)$/);
    if (!exact && greeting) {
      const prefix = {
        "pt-PT": "Olá",
        en: "Hello",
        es: "Hola",
        fr: "Bonjour",
        de: "Hallo",
        it: "Ciao"
      }[language];

      if (prefix) {
        translated = prefix + ", " + greeting[1];
      }
    }

    if (translated === trimmed) {
      return source;
    }

    const leading = source.match(/^\s*/)?.[0] || "";
    const trailing = source.match(/\s*$/)?.[0] || "";
    return leading + translated + trailing;
  }

  function isLegacyUserContent(element) {
    let current = element;

    while (current && current !== document.body) {
      if (
        current.dataset?.i18nIgnore !== undefined ||
        LEGACY_USER_CONTENT.test(
          typeof current.className === "string"
            ? current.className
            : ""
        )
      ) {
        return true;
      }

      current = current.parentElement;
    }

    return false;
  }

  function translateLegacyElement(element) {
    if (
      !(element instanceof Element) ||
      element.matches("[data-i18n], [data-i18n-ignore]") ||
      isLegacyUserContent(element)
    ) {
      return;
    }

    const textTargets =
      element.children.length === 0 &&
      (
        /^(TITLE|H1|H2|H3|H4|H5|H6|BUTTON|A|LABEL|SMALL|OPTION|TH|TD|FOOTER)$/.test(element.tagName) ||
        element.matches(
          ".section-kicker, .notif-row-title, .notif-row-desc, .notif-row-time, .event-tag, .filter-btn, .tab-btn, .date-btn, .side-link, .mood-question, .week-text, .summary-card > p, .summary-card > small, .side-card h4, .focus-card > p, .focus-card > small"
        )
      );

    if (textTargets) {
      const currentText = element.textContent || "";
      const previous = element.dataset.i18nLegacyLast || "";

      if (!element.dataset.i18nLegacySource || currentText !== previous) {
        element.dataset.i18nLegacySource = currentText;
      }

      const translated = translateLegacyString(
        element.dataset.i18nLegacySource
      );

      if (translated !== currentText) {
        applyingLegacyTranslation = true;
        element.textContent = translated;
        applyingLegacyTranslation = false;
      }

      element.dataset.i18nLegacyLast = translated;
    }

    ["placeholder", "title", "aria-label"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) {
        return;
      }

      const dataKey =
        "i18nLegacy" +
        attribute
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("");

      const currentValue = element.getAttribute(attribute) || "";

      if (!element.dataset[dataKey]) {
        element.dataset[dataKey] = currentValue;
      }

      const translated = translateLegacyString(
        element.dataset[dataKey]
      );

      if (translated !== currentValue) {
        applyingLegacyTranslation = true;
        element.setAttribute(attribute, translated);
        applyingLegacyTranslation = false;
      }
    });
  }

  function translateLegacyDocument(root = document) {
    const elements =
      root instanceof Element
        ? [root, ...root.querySelectorAll("*")]
        : [...root.querySelectorAll("*")];

    elements.forEach(translateLegacyElement);
  }

  function startLegacyObserver() {
    if (legacyObserver || !document.body) {
      return;
    }

    legacyObserver = new MutationObserver((mutations) => {
      if (applyingLegacyTranslation) {
        return;
      }

      mutations.forEach((mutation) => {
        if (
          mutation.type === "characterData" &&
          mutation.target.parentElement
        ) {
          translateLegacyElement(mutation.target.parentElement);
        }

        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            translateLegacyDocument(node);
          }
        });
      });
    });

    legacyObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function ensureStandaloneLanguageSwitcher() {
    const page = window.location.pathname.split("/").pop() || "";

    if (
      !["login.html", "setup.html"].includes(page) ||
      document.getElementById("fluirStandaloneLanguage")
    ) {
      return;
    }

    const wrapper = document.createElement("label");
    wrapper.className = "fluir-language-switcher";
    wrapper.setAttribute(
      "aria-label",
      t("settings.language", "Idioma")
    );

    const select = document.createElement("select");
    select.id = "fluirStandaloneLanguage";

    Object.entries(LANGUAGES).forEach(([code, language]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent =
        language.label +
        (language.beta ? " · Beta" : "");
      select.appendChild(option);
    });

    select.value = getLanguage();

    select.addEventListener("change", () => {
      setLanguage(select.value);
    });

    wrapper.appendChild(select);
    document.body.appendChild(wrapper);

    const style = document.createElement("style");
    style.textContent =
      ".fluir-language-switcher{position:fixed;top:14px;right:14px;z-index:9999}" +
      ".fluir-language-switcher select{min-height:38px;padding:0 12px;border:1px solid rgba(128,128,128,.3);border-radius:10px;background:#fff;color:#202020;font:600 12px Manrope,Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.08)}" +
      "body.dark .fluir-language-switcher select{background:#202020;color:#f5f5f5}" +
      "@media(max-width:560px){.fluir-language-switcher{top:9px;right:9px}.fluir-language-switcher select{max-width:170px}}";
    document.head.appendChild(style);
  }

  function normalizeLanguage(language) {
    if (!language) {
      return DEFAULT_LANGUAGE;
    }

    /*
     * Compatibilidade com o valor antigo já presente
     * nas Configurações.
     */
    if (language === "en-US") {
      return "en";
    }

    if (language === "es-ES") {
      return "es";
    }

    if (language === "fr-FR") {
      return "fr";
    }

    if (language === "de-DE") {
      return "de";
    }

    if (language === "it-IT") {
      return "it";
    }

    return LANGUAGES[language]
      ? language
      : DEFAULT_LANGUAGE;
  }

  function getLanguage() {
    return normalizeLanguage(
      localStorage.getItem(STORAGE_KEY)
    );
  }

  function getLocale() {
    return LANGUAGES[getLanguage()].locale;
  }

  function interpolate(template, variables = {}) {
    return String(template).replace(
        /\{(\w+)\}/g,
        (match, variableName) => {
        if (
            Object.prototype.hasOwnProperty.call(
            variables,
            variableName
            )
        ) {
            return String(variables[variableName]);
        }

        return match;
        }
    );
    }

  function t(key, fallback = "", variables = {}) {
    const language = getLanguage();

    const translatedValue =
        translations[language]?.[key] ??
        translations[DEFAULT_LANGUAGE]?.[key] ??
        fallback;

    return interpolate(
        translatedValue || key,
        variables
    );
    }

  function translateDocument(root = document) {
    /*
    * Texto normal:
    * <span data-i18n="settings.language">Idioma</span>
    */
    root.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;

        element.textContent = t(
        key,
        element.textContent.trim()
        );
    });

    /*
    * Placeholder:
    * <input
    *   data-i18n-placeholder="tasks.searchPlaceholder"
    *   placeholder="Buscar tarefas"
    * />
    */
    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.dataset.i18nPlaceholder;

        element.placeholder = t(
        key,
        element.placeholder
        );
    });

    /*
    * Tooltip/title:
    * <button
    *   data-i18n-title="common.close"
    *   title="Fechar"
    * >
    */
    root.querySelectorAll("[data-i18n-title]").forEach((element) => {
        const key = element.dataset.i18nTitle;

        element.title = t(
        key,
        element.title
        );
    });

    /*
    * Acessibilidade:
    * aria-label também precisa acompanhar o idioma.
    */
    root.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      const key = element.dataset.i18nAlt;
      element.alt = t(key, element.alt || "");
    });

    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
        const key = element.dataset.i18nAriaLabel;

        element.setAttribute(
        "aria-label",
        t(
            key,
            element.getAttribute("aria-label") || ""
        )
        );
    });

    translateLegacyDocument(root);
    document.documentElement.lang = getLanguage();
  }

  function setLanguage(language) {
    const normalized = normalizeLanguage(language);

    localStorage.setItem(
      STORAGE_KEY,
      normalized
    );

    document.documentElement.lang = normalized;

    translateDocument();

    window.dispatchEvent(
      new CustomEvent("fluir:languagechange", {
        detail: {
          language: normalized,
          locale: LANGUAGES[normalized].locale
        }
      })
    );
  }

  function getLanguages() {
    return LANGUAGES;
  }

  function initialize() {
    document.documentElement.lang = getLanguage();
    translateDocument();
    ensureStandaloneLanguageSwitcher();
    startLegacyObserver();
  }

    if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );
    } else {
    initialize();
    }

  window.FluirI18n = Object.freeze({
    DEFAULT_LANGUAGE,
    getLanguage,
    getLocale,
    getLanguages,
    setLanguage,
    translateDocument,
    translateLegacyString,
    t
  });
})();
