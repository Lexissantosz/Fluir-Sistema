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




  const TIMELINE_TRANSLATIONS = {
    "pt-BR": {
      "timeline.pageTitle": "Fluir | Linha do tempo",
      "timeline.sidebarQuote": "Pequenas ações constroem constância; constância gera mudança.",
      "timeline.welcome": "Olá, {name}",
      "timeline.subtitle.calm": "Respire fundo. Tudo que importa pode ser acompanhado com calma.",
      "timeline.subtitle.direct": "Veja seus eventos, filtre informações e siga para o próximo passo.",
      "timeline.subtitle.motivating": "Cada registro mostra sua constância. Continue avançando.",
      "timeline.subtitle.gentle": "Com leveza, sua rotina vai ganhando forma.",
      "timeline.subtitle.neutral": "Acompanhe seus registros, eventos e mudanças ao longo do tempo.",
      "timeline.title": "Linha do tempo",
      "timeline.description": "Acompanhe tudo o que aconteceu na sua rotina.",
      "timeline.dateRange": "20 — 26 de maio",
      "timeline.newEvent": "Novo evento",
      "timeline.filter.all": "Tudo",
      "timeline.filter.health": "Saúde",
      "timeline.todayMay24": "Hoje, 24 de maio",
      "timeline.yesterdayMay23": "Ontem, 23 de maio",
      "timeline.thisWeek": "Esta semana",
      "timeline.demo.wokeUp": "Acordei",
      "timeline.demo.wokeUpDesc": "Início de um novo dia. Respirei fundo e agradeci.",
      "timeline.demo.breakfast": "Café da manhã",
      "timeline.demo.breakfastDesc": "Aveia com frutas e café.",
      "timeline.demo.taskCompleted": "Tarefa concluída",
      "timeline.demo.reviewProposal": "Revisar proposta do projeto.",
      "timeline.demo.strengthTraining": "Treino de força",
      "timeline.demo.trainingFinished": "Treino finalizado.",
      "timeline.demo.water1250": "1250 ml de água",
      "timeline.demo.dailyGoalReached": "Meta diária alcançada.",
      "timeline.demo.diaryEntry": "Entrada no diário",
      "timeline.demo.dayReflection": "Reflexão sobre o dia.",
      "timeline.demo.attachmentSaved": "Anexo salvo",
      "timeline.demo.clientContract": "Contrato do cliente.pdf",
      "timeline.demo.studyChapter": "Estudar capítulo 4 — Marketing.",
      "timeline.demo.water1000": "1000 ml de água",
      "timeline.demo.keptHydrating": "Continuei me hidratando.",
      "timeline.demo.paymentReceived": "Pagamento recebido",
      "timeline.demo.projectAlpha": "Cliente Projeto Alfa.",
      "timeline.demo.paymentValue": "R$ 1.250",
      "timeline.demo.gratitude": "Gratidão pelas pequenas vitórias.",
      "timeline.demo.sendWeeklyReport": "Enviar relatório semanal.",
      "timeline.demo.financialReport": "Relatório financeiro Q1.xlsx",
      "timeline.loadMore": "Carregar mais eventos ↓",
      "timeline.loadMoreCount": "Carregar mais eventos ({count}) ↓",
      "timeline.refreshEvents": "Atualizar eventos ↻",
      "timeline.eventsUpdated": "Eventos atualizados ✓",
      "timeline.eventCount.one": "{count} evento",
      "timeline.eventCount.other": "{count} eventos",
      "timeline.daySummary": "Resumo do dia",
      "timeline.stats.events": "eventos",
      "timeline.stats.tasks": "tarefas",
      "timeline.stats.water": "água",
      "timeline.stats.workout": "treino",
      "timeline.stats.entry": "entrada",
      "timeline.stats.attachment": "anexo",
      "timeline.quote": "Um passo de cada vez me leva mais longe.",
      "timeline.upcomingReminders": "Próximos lembretes",
      "timeline.overdueTasks": "Tarefas atrasadas",
      "timeline.recentMood": "Humor recente",
      "timeline.howAreYou": "Como você está hoje?",
      "timeline.viewAll": "Ver todos →",
      "timeline.modal.description": "Registre um acontecimento importante da sua rotina. Por enquanto, ele será salvo localmente no navegador.",
      "timeline.eventTitle": "Título do evento",
      "timeline.eventTitlePlaceholder": "Ex: Caminhada, estudo, pagamento...",
      "timeline.category": "Categoria",
      "timeline.optionalDescription": "Descrição opcional",
      "timeline.descriptionPlaceholder": "Ex: detalhe rápido sobre o evento...",
      "timeline.cancel": "Cancelar",
      "timeline.saveEvent": "Salvar evento",
      "timeline.category.tasks": "Tarefas",
      "timeline.category.habits": "Hábitos",
      "timeline.category.health": "Saúde",
      "timeline.category.finances": "Finanças",
      "timeline.category.diary": "Diário",
      "timeline.category.attachments": "Anexos",
      "timeline.category.sleep": "Sono",
      "timeline.category.water": "Água",
      "timeline.category.event": "Evento",
      "timeline.today": "Hoje",
      "timeline.yesterday": "Ontem",
      "timeline.tomorrow": "Amanhã",
      "timeline.noUpcomingReminders": "Nenhum lembrete próximo.",
      "timeline.overdueOneDay": "Atrasada há 1 dia",
      "timeline.overdueDays": "Atrasada há {days} dias",
      "timeline.noOverdueTasks": "Nenhuma tarefa atrasada.",
      "timeline.manualEvent": "Evento registrado manualmente.",
      "timeline.invalidTitle": "Digite um título válido para o evento.",
      "timeline.chooseCategory": "Escolha uma categoria para o evento.",
      "timeline.savedSuccess": "Evento salvo com sucesso.",
      "timeline.notification.waterTitle": "Meta de água pendente",
      "timeline.notification.waterDesc": "Você ainda não configurou sua meta de água hoje.",
      "timeline.notification.fiveHoursAgo": "há 5 horas",
      "timeline.notification.discountTitle": "Fluir Plus com desconto",
      "timeline.notification.discountDesc": "20% de desconto por tempo limitado.",
      "timeline.notification.oneDayAgo": "há 1 dia",
      "timeline.system.waterLogged": "Água registrada",
      "timeline.system.waterRemoved": "Água removida",
      "timeline.system.waterAdjusted": "Água ajustada",
      "timeline.system.waterReset": "Água reiniciada",
      "timeline.system.waterGoalChanged": "Meta de água alterada",
      "timeline.system.waterAddedDesc": "{amount} ml adicionados · total de {total} ml hoje.",
      "timeline.system.waterRemovedDesc": "{amount} ml removidos · total de {total} ml hoje.",
      "timeline.system.waterAdjustedDesc": "Total de água ajustado para {total} ml hoje.",
      "timeline.system.waterResetDesc": "A água de hoje foi reiniciada.",
      "timeline.system.waterGoalChangedDesc": "Nova meta diária: {goal} ml.",
      "timeline.system.taskCreated": "Tarefa criada",
      "timeline.system.taskCompleted": "Tarefa concluída",
      "timeline.system.taskReopened": "Tarefa reaberta",
      "timeline.system.taskRemoved": "Tarefa removida",
      "timeline.system.completedTasksCleared": "Tarefas concluídas limpas",
      "timeline.system.financeStatusUpdated": "Status financeiro atualizado",
      "timeline.system.debtStatusUpdated": "Status da dívida atualizado",
      "timeline.system.incomeRegistered": "Entrada registrada",
      "timeline.system.debtRegistered": "Dívida registrada",
      "timeline.system.expenseRegistered": "Saída registrada",
      "timeline.system.transactionRemoved": "Lançamento removido",
      "timeline.system.financesCleared": "Finanças limpas",
      "timeline.system.diaryEntry": "Entrada no diário",
      "timeline.system.diaryEntryRemoved": "Entrada removida",
      "timeline.system.diaryCleared": "Diário limpo",
      "timeline.system.attachmentSaved": "Anexo salvo",
      "timeline.system.attachmentUpdated": "Anexo atualizado",
      "timeline.system.attachmentRemoved": "Anexo removido",
      "timeline.system.attachmentsCleared": "Anexos limpos"
    },

    "pt-PT": {
      "timeline.pageTitle": "Fluir | Linha temporal",
      "timeline.sidebarQuote": "Pequenas ações constroem consistência; a consistência gera mudança.",
      "timeline.welcome": "Olá, {name}",
      "timeline.subtitle.calm": "Respira fundo. Tudo o que importa pode ser acompanhado com calma.",
      "timeline.subtitle.direct": "Vê os teus eventos, filtra a informação e segue para o próximo passo.",
      "timeline.subtitle.motivating": "Cada registo mostra a tua consistência. Continua a avançar.",
      "timeline.subtitle.gentle": "Com leveza, a tua rotina vai ganhando forma.",
      "timeline.subtitle.neutral": "Acompanha os teus registos, eventos e mudanças ao longo do tempo.",
      "timeline.title": "Linha temporal",
      "timeline.description": "Acompanha tudo o que aconteceu na tua rotina.",
      "timeline.dateRange": "20 — 26 de maio",
      "timeline.newEvent": "Novo evento",
      "timeline.filter.all": "Tudo",
      "timeline.filter.health": "Saúde",
      "timeline.todayMay24": "Hoje, 24 de maio",
      "timeline.yesterdayMay23": "Ontem, 23 de maio",
      "timeline.thisWeek": "Esta semana",
      "timeline.demo.wokeUp": "Acordei",
      "timeline.demo.wokeUpDesc": "Início de um novo dia. Respirei fundo e agradeci.",
      "timeline.demo.breakfast": "Pequeno-almoço",
      "timeline.demo.breakfastDesc": "Aveia com fruta e café.",
      "timeline.demo.taskCompleted": "Tarefa concluída",
      "timeline.demo.reviewProposal": "Rever proposta do projeto.",
      "timeline.demo.strengthTraining": "Treino de força",
      "timeline.demo.trainingFinished": "Treino concluído.",
      "timeline.demo.water1250": "1250 ml de água",
      "timeline.demo.dailyGoalReached": "Meta diária alcançada.",
      "timeline.demo.diaryEntry": "Entrada no diário",
      "timeline.demo.dayReflection": "Reflexão sobre o dia.",
      "timeline.demo.attachmentSaved": "Anexo guardado",
      "timeline.demo.clientContract": "Contrato do cliente.pdf",
      "timeline.demo.studyChapter": "Estudar o capítulo 4 — Marketing.",
      "timeline.demo.water1000": "1000 ml de água",
      "timeline.demo.keptHydrating": "Continuei a hidratar-me.",
      "timeline.demo.paymentReceived": "Pagamento recebido",
      "timeline.demo.projectAlpha": "Cliente Projeto Alfa.",
      "timeline.demo.paymentValue": "1 250 R$",
      "timeline.demo.gratitude": "Gratidão pelas pequenas vitórias.",
      "timeline.demo.sendWeeklyReport": "Enviar relatório semanal.",
      "timeline.demo.financialReport": "Relatório financeiro Q1.xlsx",
      "timeline.loadMore": "Carregar mais eventos ↓",
      "timeline.loadMoreCount": "Carregar mais eventos ({count}) ↓",
      "timeline.refreshEvents": "Atualizar eventos ↻",
      "timeline.eventsUpdated": "Eventos atualizados ✓",
      "timeline.eventCount.one": "{count} evento",
      "timeline.eventCount.other": "{count} eventos",
      "timeline.daySummary": "Resumo do dia",
      "timeline.stats.events": "eventos",
      "timeline.stats.tasks": "tarefas",
      "timeline.stats.water": "água",
      "timeline.stats.workout": "treino",
      "timeline.stats.entry": "entrada",
      "timeline.stats.attachment": "anexo",
      "timeline.quote": "Um passo de cada vez leva-me mais longe.",
      "timeline.upcomingReminders": "Próximos lembretes",
      "timeline.overdueTasks": "Tarefas em atraso",
      "timeline.recentMood": "Humor recente",
      "timeline.howAreYou": "Como te sentes hoje?",
      "timeline.viewAll": "Ver todos →",
      "timeline.modal.description": "Regista um acontecimento importante da tua rotina. Por enquanto, será guardado localmente no navegador.",
      "timeline.eventTitle": "Título do evento",
      "timeline.eventTitlePlaceholder": "Ex.: Caminhada, estudo, pagamento...",
      "timeline.category": "Categoria",
      "timeline.optionalDescription": "Descrição opcional",
      "timeline.descriptionPlaceholder": "Ex.: detalhe rápido sobre o evento...",
      "timeline.cancel": "Cancelar",
      "timeline.saveEvent": "Guardar evento",
      "timeline.category.tasks": "Tarefas",
      "timeline.category.habits": "Hábitos",
      "timeline.category.health": "Saúde",
      "timeline.category.finances": "Finanças",
      "timeline.category.diary": "Diário",
      "timeline.category.attachments": "Anexos",
      "timeline.category.sleep": "Sono",
      "timeline.category.water": "Água",
      "timeline.category.event": "Evento",
      "timeline.today": "Hoje",
      "timeline.yesterday": "Ontem",
      "timeline.tomorrow": "Amanhã",
      "timeline.noUpcomingReminders": "Nenhum lembrete próximo.",
      "timeline.overdueOneDay": "Em atraso há 1 dia",
      "timeline.overdueDays": "Em atraso há {days} dias",
      "timeline.noOverdueTasks": "Nenhuma tarefa em atraso.",
      "timeline.manualEvent": "Evento registado manualmente.",
      "timeline.invalidTitle": "Introduz um título válido para o evento.",
      "timeline.chooseCategory": "Escolhe uma categoria para o evento.",
      "timeline.savedSuccess": "Evento guardado com sucesso.",
      "timeline.notification.waterTitle": "Meta de água pendente",
      "timeline.notification.waterDesc": "Ainda não configuraste a tua meta de água para hoje.",
      "timeline.notification.fiveHoursAgo": "há 5 horas",
      "timeline.notification.discountTitle": "Fluir Plus com desconto",
      "timeline.notification.discountDesc": "20% de desconto por tempo limitado.",
      "timeline.notification.oneDayAgo": "há 1 dia",
      "timeline.system.waterLogged": "Água registada",
      "timeline.system.waterRemoved": "Água removida",
      "timeline.system.waterAdjusted": "Água ajustada",
      "timeline.system.waterReset": "Água reiniciada",
      "timeline.system.waterGoalChanged": "Meta de água alterada",
      "timeline.system.waterAddedDesc": "{amount} ml adicionados · total de {total} ml hoje.",
      "timeline.system.waterRemovedDesc": "{amount} ml removidos · total de {total} ml hoje.",
      "timeline.system.waterAdjustedDesc": "Total de água ajustado para {total} ml hoje.",
      "timeline.system.waterResetDesc": "A água de hoje foi reiniciada.",
      "timeline.system.waterGoalChangedDesc": "Nova meta diária: {goal} ml.",
      "timeline.system.taskCreated": "Tarefa criada",
      "timeline.system.taskCompleted": "Tarefa concluída",
      "timeline.system.taskReopened": "Tarefa reaberta",
      "timeline.system.taskRemoved": "Tarefa removida",
      "timeline.system.completedTasksCleared": "Tarefas concluídas limpas",
      "timeline.system.financeStatusUpdated": "Estado financeiro atualizado",
      "timeline.system.debtStatusUpdated": "Estado da dívida atualizado",
      "timeline.system.incomeRegistered": "Entrada registada",
      "timeline.system.debtRegistered": "Dívida registada",
      "timeline.system.expenseRegistered": "Saída registada",
      "timeline.system.transactionRemoved": "Lançamento removido",
      "timeline.system.financesCleared": "Finanças limpas",
      "timeline.system.diaryEntry": "Entrada no diário",
      "timeline.system.diaryEntryRemoved": "Entrada removida",
      "timeline.system.diaryCleared": "Diário limpo",
      "timeline.system.attachmentSaved": "Anexo guardado",
      "timeline.system.attachmentUpdated": "Anexo atualizado",
      "timeline.system.attachmentRemoved": "Anexo removido",
      "timeline.system.attachmentsCleared": "Anexos limpos"
    },

    en: {
      "timeline.pageTitle": "Fluir | Timeline",
      "timeline.sidebarQuote": "Small actions build consistency; consistency creates change.",
      "timeline.welcome": "Hello, {name}",
      "timeline.subtitle.calm": "Take a breath. Everything that matters can be tracked calmly.",
      "timeline.subtitle.direct": "Review your events, filter information, and move on to the next step.",
      "timeline.subtitle.motivating": "Every record reflects your consistency. Keep moving forward.",
      "timeline.subtitle.gentle": "With ease, your routine starts to take shape.",
      "timeline.subtitle.neutral": "Track your records, events, and changes over time.",
      "timeline.title": "Timeline",
      "timeline.description": "See everything that happened in your routine.",
      "timeline.dateRange": "May 20 — 26",
      "timeline.newEvent": "New event",
      "timeline.filter.all": "All",
      "timeline.filter.health": "Health",
      "timeline.todayMay24": "Today, May 24",
      "timeline.yesterdayMay23": "Yesterday, May 23",
      "timeline.thisWeek": "This week",
      "timeline.demo.wokeUp": "Woke up",
      "timeline.demo.wokeUpDesc": "A new day began. I took a breath and felt grateful.",
      "timeline.demo.breakfast": "Breakfast",
      "timeline.demo.breakfastDesc": "Oatmeal with fruit and coffee.",
      "timeline.demo.taskCompleted": "Task completed",
      "timeline.demo.reviewProposal": "Review project proposal.",
      "timeline.demo.strengthTraining": "Strength training",
      "timeline.demo.trainingFinished": "Workout completed.",
      "timeline.demo.water1250": "1250 ml of water",
      "timeline.demo.dailyGoalReached": "Daily goal reached.",
      "timeline.demo.diaryEntry": "Diary entry",
      "timeline.demo.dayReflection": "Reflection on the day.",
      "timeline.demo.attachmentSaved": "Attachment saved",
      "timeline.demo.clientContract": "Client contract.pdf",
      "timeline.demo.studyChapter": "Study chapter 4 — Marketing.",
      "timeline.demo.water1000": "1000 ml of water",
      "timeline.demo.keptHydrating": "Kept hydrated.",
      "timeline.demo.paymentReceived": "Payment received",
      "timeline.demo.projectAlpha": "Project Alpha client.",
      "timeline.demo.paymentValue": "R$1,250",
      "timeline.demo.gratitude": "Grateful for the small wins.",
      "timeline.demo.sendWeeklyReport": "Send weekly report.",
      "timeline.demo.financialReport": "Q1 financial report.xlsx",
      "timeline.loadMore": "Load more events ↓",
      "timeline.loadMoreCount": "Load more events ({count}) ↓",
      "timeline.refreshEvents": "Refresh events ↻",
      "timeline.eventsUpdated": "Events updated ✓",
      "timeline.eventCount.one": "{count} event",
      "timeline.eventCount.other": "{count} events",
      "timeline.daySummary": "Day summary",
      "timeline.stats.events": "events",
      "timeline.stats.tasks": "tasks",
      "timeline.stats.water": "water",
      "timeline.stats.workout": "workout",
      "timeline.stats.entry": "entry",
      "timeline.stats.attachment": "attachment",
      "timeline.quote": "One step at a time takes me farther.",
      "timeline.upcomingReminders": "Upcoming reminders",
      "timeline.overdueTasks": "Overdue tasks",
      "timeline.recentMood": "Recent mood",
      "timeline.howAreYou": "How are you today?",
      "timeline.viewAll": "View all →",
      "timeline.modal.description": "Record an important event from your routine. For now, it will be saved locally in your browser.",
      "timeline.eventTitle": "Event title",
      "timeline.eventTitlePlaceholder": "E.g. Walk, study, payment...",
      "timeline.category": "Category",
      "timeline.optionalDescription": "Optional description",
      "timeline.descriptionPlaceholder": "E.g. a quick detail about the event...",
      "timeline.cancel": "Cancel",
      "timeline.saveEvent": "Save event",
      "timeline.category.tasks": "Tasks",
      "timeline.category.habits": "Habits",
      "timeline.category.health": "Health",
      "timeline.category.finances": "Finances",
      "timeline.category.diary": "Diary",
      "timeline.category.attachments": "Attachments",
      "timeline.category.sleep": "Sleep",
      "timeline.category.water": "Water",
      "timeline.category.event": "Event",
      "timeline.today": "Today",
      "timeline.yesterday": "Yesterday",
      "timeline.tomorrow": "Tomorrow",
      "timeline.noUpcomingReminders": "No upcoming reminders.",
      "timeline.overdueOneDay": "1 day overdue",
      "timeline.overdueDays": "{days} days overdue",
      "timeline.noOverdueTasks": "No overdue tasks.",
      "timeline.manualEvent": "Event recorded manually.",
      "timeline.invalidTitle": "Enter a valid event title.",
      "timeline.chooseCategory": "Choose a category for the event.",
      "timeline.savedSuccess": "Event saved successfully.",
      "timeline.notification.waterTitle": "Water goal pending",
      "timeline.notification.waterDesc": "You haven't set your water goal for today yet.",
      "timeline.notification.fiveHoursAgo": "5 hours ago",
      "timeline.notification.discountTitle": "Fluir Plus discount",
      "timeline.notification.discountDesc": "20% off for a limited time.",
      "timeline.notification.oneDayAgo": "1 day ago",
      "timeline.system.waterLogged": "Water logged",
      "timeline.system.waterRemoved": "Water removed",
      "timeline.system.waterAdjusted": "Water adjusted",
      "timeline.system.waterReset": "Water reset",
      "timeline.system.waterGoalChanged": "Water goal changed",
      "timeline.system.waterAddedDesc": "{amount} ml added · {total} ml total today.",
      "timeline.system.waterRemovedDesc": "{amount} ml removed · {total} ml total today.",
      "timeline.system.waterAdjustedDesc": "Today's water total adjusted to {total} ml.",
      "timeline.system.waterResetDesc": "Today's water total was reset.",
      "timeline.system.waterGoalChangedDesc": "New daily goal: {goal} ml.",
      "timeline.system.taskCreated": "Task created",
      "timeline.system.taskCompleted": "Task completed",
      "timeline.system.taskReopened": "Task reopened",
      "timeline.system.taskRemoved": "Task removed",
      "timeline.system.completedTasksCleared": "Completed tasks cleared",
      "timeline.system.financeStatusUpdated": "Financial status updated",
      "timeline.system.debtStatusUpdated": "Debt status updated",
      "timeline.system.incomeRegistered": "Income recorded",
      "timeline.system.debtRegistered": "Debt recorded",
      "timeline.system.expenseRegistered": "Expense recorded",
      "timeline.system.transactionRemoved": "Transaction removed",
      "timeline.system.financesCleared": "Finances cleared",
      "timeline.system.diaryEntry": "Diary entry",
      "timeline.system.diaryEntryRemoved": "Diary entry removed",
      "timeline.system.diaryCleared": "Diary cleared",
      "timeline.system.attachmentSaved": "Attachment saved",
      "timeline.system.attachmentUpdated": "Attachment updated",
      "timeline.system.attachmentRemoved": "Attachment removed",
      "timeline.system.attachmentsCleared": "Attachments cleared"
    },

    es: {
      "timeline.pageTitle": "Fluir | Línea de tiempo",
      "timeline.sidebarQuote": "Las pequeñas acciones construyen constancia; la constancia genera cambios.",
      "timeline.welcome": "Hola, {name}",
      "timeline.subtitle.calm": "Respira hondo. Todo lo importante puede seguirse con calma.",
      "timeline.subtitle.direct": "Revisa tus eventos, filtra la información y continúa con el siguiente paso.",
      "timeline.subtitle.motivating": "Cada registro refleja tu constancia. Sigue avanzando.",
      "timeline.subtitle.gentle": "Con ligereza, tu rutina va tomando forma.",
      "timeline.subtitle.neutral": "Sigue tus registros, eventos y cambios a lo largo del tiempo.",
      "timeline.title": "Línea de tiempo",
      "timeline.description": "Consulta todo lo que ocurrió en tu rutina.",
      "timeline.dateRange": "20 — 26 de mayo",
      "timeline.newEvent": "Nuevo evento",
      "timeline.filter.all": "Todo",
      "timeline.filter.health": "Salud",
      "timeline.todayMay24": "Hoy, 24 de mayo",
      "timeline.yesterdayMay23": "Ayer, 23 de mayo",
      "timeline.thisWeek": "Esta semana",
      "timeline.demo.wokeUp": "Me desperté",
      "timeline.demo.wokeUpDesc": "Comenzó un nuevo día. Respiré hondo y agradecí.",
      "timeline.demo.breakfast": "Desayuno",
      "timeline.demo.breakfastDesc": "Avena con frutas y café.",
      "timeline.demo.taskCompleted": "Tarea completada",
      "timeline.demo.reviewProposal": "Revisar la propuesta del proyecto.",
      "timeline.demo.strengthTraining": "Entrenamiento de fuerza",
      "timeline.demo.trainingFinished": "Entrenamiento finalizado.",
      "timeline.demo.water1250": "1250 ml de agua",
      "timeline.demo.dailyGoalReached": "Meta diaria alcanzada.",
      "timeline.demo.diaryEntry": "Entrada en el diario",
      "timeline.demo.dayReflection": "Reflexión sobre el día.",
      "timeline.demo.attachmentSaved": "Archivo adjunto guardado",
      "timeline.demo.clientContract": "Contrato del cliente.pdf",
      "timeline.demo.studyChapter": "Estudiar el capítulo 4 — Marketing.",
      "timeline.demo.water1000": "1000 ml de agua",
      "timeline.demo.keptHydrating": "Seguí hidratándome.",
      "timeline.demo.paymentReceived": "Pago recibido",
      "timeline.demo.projectAlpha": "Cliente Proyecto Alfa.",
      "timeline.demo.paymentValue": "R$ 1.250",
      "timeline.demo.gratitude": "Gratitud por las pequeñas victorias.",
      "timeline.demo.sendWeeklyReport": "Enviar informe semanal.",
      "timeline.demo.financialReport": "Informe financiero Q1.xlsx",
      "timeline.loadMore": "Cargar más eventos ↓",
      "timeline.loadMoreCount": "Cargar más eventos ({count}) ↓",
      "timeline.refreshEvents": "Actualizar eventos ↻",
      "timeline.eventsUpdated": "Eventos actualizados ✓",
      "timeline.eventCount.one": "{count} evento",
      "timeline.eventCount.other": "{count} eventos",
      "timeline.daySummary": "Resumen del día",
      "timeline.stats.events": "eventos",
      "timeline.stats.tasks": "tareas",
      "timeline.stats.water": "agua",
      "timeline.stats.workout": "entrenamiento",
      "timeline.stats.entry": "entrada",
      "timeline.stats.attachment": "archivo adjunto",
      "timeline.quote": "Un paso a la vez me lleva más lejos.",
      "timeline.upcomingReminders": "Próximos recordatorios",
      "timeline.overdueTasks": "Tareas atrasadas",
      "timeline.recentMood": "Estado de ánimo reciente",
      "timeline.howAreYou": "¿Cómo estás hoy?",
      "timeline.viewAll": "Ver todos →",
      "timeline.modal.description": "Registra un acontecimiento importante de tu rutina. Por ahora, se guardará localmente en el navegador.",
      "timeline.eventTitle": "Título del evento",
      "timeline.eventTitlePlaceholder": "Ej.: Caminata, estudio, pago...",
      "timeline.category": "Categoría",
      "timeline.optionalDescription": "Descripción opcional",
      "timeline.descriptionPlaceholder": "Ej.: un detalle rápido sobre el evento...",
      "timeline.cancel": "Cancelar",
      "timeline.saveEvent": "Guardar evento",
      "timeline.category.tasks": "Tareas",
      "timeline.category.habits": "Hábitos",
      "timeline.category.health": "Salud",
      "timeline.category.finances": "Finanzas",
      "timeline.category.diary": "Diario",
      "timeline.category.attachments": "Archivos",
      "timeline.category.sleep": "Sueño",
      "timeline.category.water": "Agua",
      "timeline.category.event": "Evento",
      "timeline.today": "Hoy",
      "timeline.yesterday": "Ayer",
      "timeline.tomorrow": "Mañana",
      "timeline.noUpcomingReminders": "No hay recordatorios próximos.",
      "timeline.overdueOneDay": "Atrasada 1 día",
      "timeline.overdueDays": "Atrasada {days} días",
      "timeline.noOverdueTasks": "No hay tareas atrasadas.",
      "timeline.manualEvent": "Evento registrado manualmente.",
      "timeline.invalidTitle": "Escribe un título válido para el evento.",
      "timeline.chooseCategory": "Elige una categoría para el evento.",
      "timeline.savedSuccess": "Evento guardado correctamente.",
      "timeline.notification.waterTitle": "Meta de agua pendiente",
      "timeline.notification.waterDesc": "Todavía no has configurado tu meta de agua para hoy.",
      "timeline.notification.fiveHoursAgo": "hace 5 horas",
      "timeline.notification.discountTitle": "Fluir Plus con descuento",
      "timeline.notification.discountDesc": "20% de descuento por tiempo limitado.",
      "timeline.notification.oneDayAgo": "hace 1 día",
      "timeline.system.waterLogged": "Agua registrada",
      "timeline.system.waterRemoved": "Agua eliminada",
      "timeline.system.waterAdjusted": "Agua ajustada",
      "timeline.system.waterReset": "Agua reiniciada",
      "timeline.system.waterGoalChanged": "Meta de agua modificada",
      "timeline.system.waterAddedDesc": "{amount} ml añadidos · total de {total} ml hoy.",
      "timeline.system.waterRemovedDesc": "{amount} ml eliminados · total de {total} ml hoy.",
      "timeline.system.waterAdjustedDesc": "Total de agua ajustado a {total} ml hoy.",
      "timeline.system.waterResetDesc": "El agua de hoy se reinició.",
      "timeline.system.waterGoalChangedDesc": "Nueva meta diaria: {goal} ml.",
      "timeline.system.taskCreated": "Tarea creada",
      "timeline.system.taskCompleted": "Tarea completada",
      "timeline.system.taskReopened": "Tarea reabierta",
      "timeline.system.taskRemoved": "Tarea eliminada",
      "timeline.system.completedTasksCleared": "Tareas completadas limpiadas",
      "timeline.system.financeStatusUpdated": "Estado financiero actualizado",
      "timeline.system.debtStatusUpdated": "Estado de la deuda actualizado",
      "timeline.system.incomeRegistered": "Ingreso registrado",
      "timeline.system.debtRegistered": "Deuda registrada",
      "timeline.system.expenseRegistered": "Gasto registrado",
      "timeline.system.transactionRemoved": "Movimiento eliminado",
      "timeline.system.financesCleared": "Finanzas limpiadas",
      "timeline.system.diaryEntry": "Entrada en el diario",
      "timeline.system.diaryEntryRemoved": "Entrada eliminada",
      "timeline.system.diaryCleared": "Diario limpiado",
      "timeline.system.attachmentSaved": "Archivo adjunto guardado",
      "timeline.system.attachmentUpdated": "Archivo adjunto actualizado",
      "timeline.system.attachmentRemoved": "Archivo adjunto eliminado",
      "timeline.system.attachmentsCleared": "Archivos adjuntos eliminados"
    }
  };

  Object.entries(TIMELINE_TRANSLATIONS).forEach(([language, entries]) => {
    translations[language] = {
      ...(translations[language] || {}),
      ...entries
    };
  });


  const TIMELINE_HABIT_TRANSLATIONS = {
    "pt-BR": {
      "timeline.system.habitCreated": "Hábito criado",
      "timeline.system.habitUnchecked": "Hábito desmarcado",
      "timeline.system.habitCompleted": "Hábito concluído",
      "timeline.system.habitRemoved": "Hábito removido",
      "timeline.system.habitsTodayReset": "Hábitos de hoje reiniciados",
      "timeline.system.habitsTodayResetDesc": "As conclusões de hoje foram removidas."
    },
    "pt-PT": {
      "timeline.system.habitCreated": "Hábito criado",
      "timeline.system.habitUnchecked": "Hábito desmarcado",
      "timeline.system.habitCompleted": "Hábito concluído",
      "timeline.system.habitRemoved": "Hábito removido",
      "timeline.system.habitsTodayReset": "Hábitos de hoje reiniciados",
      "timeline.system.habitsTodayResetDesc": "As conclusões de hoje foram removidas."
    },
    en: {
      "timeline.system.habitCreated": "Habit created",
      "timeline.system.habitUnchecked": "Habit unchecked",
      "timeline.system.habitCompleted": "Habit completed",
      "timeline.system.habitRemoved": "Habit removed",
      "timeline.system.habitsTodayReset": "Today's habits reset",
      "timeline.system.habitsTodayResetDesc": "Today's completions were removed."
    },
    es: {
      "timeline.system.habitCreated": "Hábito creado",
      "timeline.system.habitUnchecked": "Hábito desmarcado",
      "timeline.system.habitCompleted": "Hábito completado",
      "timeline.system.habitRemoved": "Hábito eliminado",
      "timeline.system.habitsTodayReset": "Hábitos de hoy reiniciados",
      "timeline.system.habitsTodayResetDesc": "Se eliminaron las finalizaciones de hoy."
    },
    fr: {
      "timeline.system.habitCreated": "Habitude créée",
      "timeline.system.habitUnchecked": "Habitude décochée",
      "timeline.system.habitCompleted": "Habitude terminée",
      "timeline.system.habitRemoved": "Habitude supprimée",
      "timeline.system.habitsTodayReset": "Habitudes du jour réinitialisées",
      "timeline.system.habitsTodayResetDesc": "Les validations d'aujourd'hui ont été supprimées."
    },
    de: {
      "timeline.system.habitCreated": "Gewohnheit erstellt",
      "timeline.system.habitUnchecked": "Gewohnheit abgewählt",
      "timeline.system.habitCompleted": "Gewohnheit abgeschlossen",
      "timeline.system.habitRemoved": "Gewohnheit entfernt",
      "timeline.system.habitsTodayReset": "Heutige Gewohnheiten zurückgesetzt",
      "timeline.system.habitsTodayResetDesc": "Die heutigen Abschlüsse wurden entfernt."
    },
    it: {
      "timeline.system.habitCreated": "Abitudine creata",
      "timeline.system.habitUnchecked": "Abitudine deselezionata",
      "timeline.system.habitCompleted": "Abitudine completata",
      "timeline.system.habitRemoved": "Abitudine rimossa",
      "timeline.system.habitsTodayReset": "Abitudini di oggi reimpostate",
      "timeline.system.habitsTodayResetDesc": "I completamenti di oggi sono stati rimossi."
    }
  };

  Object.entries(TIMELINE_HABIT_TRANSLATIONS).forEach(([language, entries]) => {
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
      "settings.feedback.translationLink": "Reportar erro",
      "settings.feedback.intro": "Encontrou uma tradução estranha, um erro do sistema ou tem uma sugestão? Você pode montar um relatório aqui sem enviar seus dados automaticamente.",
      "settings.feedback.type": "Tipo de feedback",
      "settings.feedback.message": "Descreva o que aconteceu",
      "settings.feedback.placeholder": "Explique o problema, onde ele apareceu e o que você esperava ver.",
      "settings.feedback.diagnostics": "Incluir dados técnicos básicos no texto copiado: página, idioma e tamanho da tela",
      "settings.feedback.copy": "Copiar relatório",
      "settings.feedback.github": "Abrir página de chamados",
      "settings.feedback.copied": "Relatório copiado.",
      "settings.feedback.empty": "Descreva o problema antes de continuar.",
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
      "settings.feedback.translationLink": "Reportar erro",
      "settings.feedback.intro": "Encontraste uma tradução estranha, um erro do sistema ou tens uma sugestão? Podes preparar um relatório aqui sem enviar os teus dados automaticamente.",
      "settings.feedback.type": "Tipo de feedback",
      "settings.feedback.message": "Descreve o que aconteceu",
      "settings.feedback.placeholder": "Explica o problema, onde apareceu e o que esperavas ver.",
      "settings.feedback.diagnostics": "Incluir dados técnicos básicos no texto copiado: página, idioma e tamanho do ecrã",
      "settings.feedback.copy": "Copiar relatório",
      "settings.feedback.github": "Abrir página de pedidos",
      "settings.feedback.copied": "Relatório copiado.",
      "settings.feedback.empty": "Descreve o problema antes de continuar.",
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
      "settings.feedback.translationLink": "Report an error",
      "settings.feedback.intro": "Found an odd translation, a system error, or have a suggestion? You can prepare a report here without sending your data automatically.",
      "settings.feedback.type": "Feedback type",
      "settings.feedback.message": "Describe what happened",
      "settings.feedback.placeholder": "Explain the problem, where it appeared, and what you expected to see.",
      "settings.feedback.diagnostics": "Include basic technical details in the copied text: page, language, and screen size",
      "settings.feedback.copy": "Copy report",
      "settings.feedback.github": "Open issue page",
      "settings.feedback.copied": "Report copied.",
      "settings.feedback.empty": "Describe the problem before continuing.",
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
      "settings.feedback.translationLink": "Reportar un error",
      "settings.feedback.intro": "¿Encontraste una traducción extraña, un error del sistema o tienes una sugerencia? Puedes preparar un informe aquí sin enviar tus datos automáticamente.",
      "settings.feedback.type": "Tipo de comentario",
      "settings.feedback.message": "Describe lo que ocurrió",
      "settings.feedback.placeholder": "Explica el problema, dónde apareció y qué esperabas ver.",
      "settings.feedback.diagnostics": "Incluir datos técnicos básicos en el texto copiado: página, idioma y tamaño de pantalla",
      "settings.feedback.copy": "Copiar informe",
      "settings.feedback.github": "Abrir página de incidencias",
      "settings.feedback.copied": "Informe copiado.",
      "settings.feedback.empty": "Describe el problema antes de continuar.",
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
      "settings.feedback.translationLink": "Signaler une erreur",
      "settings.feedback.intro": "Vous avez trouvé une traduction étrange, une erreur du système ou vous avez une suggestion ? Vous pouvez préparer un rapport ici sans envoyer automatiquement vos données.",
      "settings.feedback.type": "Type de retour",
      "settings.feedback.message": "Décrivez ce qui s'est passé",
      "settings.feedback.placeholder": "Expliquez le problème, où il apparaît et ce que vous pensiez voir.",
      "settings.feedback.diagnostics": "Inclure les informations techniques de base dans le texte copié : page, langue et taille de l'écran",
      "settings.feedback.copy": "Copier le rapport",
      "settings.feedback.github": "Ouvrir la page des tickets",
      "settings.feedback.copied": "Rapport copié.",
      "settings.feedback.empty": "Décrivez le problème avant de continuer.",
      "feedback.translation": "Problème de traduction",
      "feedback.system": "Erreur du système",
      "feedback.accessibility": "Accessibilité",
      "feedback.suggestion": "Suggestion",
      "feedback.other": "Autre",
      "common.you": "Vous",
      "common.light": "Clair",
      "common.dark": "Sombre",
      "sidebar.tagline": "Système d'organisation de la vie",
      "sidebar.mainNavigation": "Navigation principale",
      "dashboard.sidebarQuote": "De petites actions régulières créent de vrais changements.",
      "mobile.goToProfile": "Aller au profil",
      "mobile.openMenu": "Ouvrir le menu",
      "mobile.systemMenu": "Menu du système",
      "mobile.menu": "Menu",
      "mobile.chooseArea": "Choisissez une section de Fluir",
      "mobile.closeMenu": "Fermer le menu",
      "mobile.mainNavigation": "Navigation mobile principale",
      "mobile.more": "Plus",
      "mobile.defaultUser": "Utilisateur",
      "mobile.userProfile": "Profil utilisateur",
      "mobile.timelineShort": "Chronologie"
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
      "settings.feedback.translationLink": "Fehler melden",
      "settings.feedback.intro": "Eine seltsame Übersetzung, einen Systemfehler oder eine Idee gefunden? Du kannst hier einen Bericht vorbereiten, ohne deine Daten automatisch zu senden.",
      "settings.feedback.type": "Feedback-Typ",
      "settings.feedback.message": "Beschreibe, was passiert ist",
      "settings.feedback.placeholder": "Erkläre das Problem, wo es auftrat und was du erwartet hast.",
      "settings.feedback.diagnostics": "Grundlegende technische Daten in den kopierten Text aufnehmen: Seite, Sprache und Bildschirmgröße",
      "settings.feedback.copy": "Bericht kopieren",
      "settings.feedback.github": "Issue-Seite öffnen",
      "settings.feedback.copied": "Bericht kopiert.",
      "settings.feedback.empty": "Beschreibe das Problem, bevor du fortfährst.",
      "feedback.translation": "Übersetzungsproblem",
      "feedback.system": "Systemfehler",
      "feedback.accessibility": "Barrierefreiheit",
      "feedback.suggestion": "Vorschlag",
      "feedback.other": "Sonstiges",
      "common.you": "Du",
      "common.light": "Hell",
      "common.dark": "Dunkel",
      "sidebar.tagline": "System zur Lebensorganisation",
      "sidebar.mainNavigation": "Hauptnavigation",
      "dashboard.sidebarQuote": "Kleine, beständige Schritte schaffen echte Veränderung.",
      "mobile.goToProfile": "Zum Profil",
      "mobile.openMenu": "Menü öffnen",
      "mobile.systemMenu": "Systemmenü",
      "mobile.menu": "Menü",
      "mobile.chooseArea": "Wähle einen Fluir-Bereich",
      "mobile.closeMenu": "Menü schließen",
      "mobile.mainNavigation": "Mobile Hauptnavigation",
      "mobile.more": "Mehr",
      "mobile.defaultUser": "Benutzer",
      "mobile.userProfile": "Benutzerprofil",
      "mobile.timelineShort": "Zeitleiste"
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
      "settings.feedback.translationLink": "Segnala erro",
      "settings.feedback.intro": "Hai trovato una traduzione strana, un errore di sistema o hai un suggerimento? Puoi preparare una segnalazione qui senza inviare automaticamente i tuoi dati.",
      "settings.feedback.type": "Tipo di feedback",
      "settings.feedback.message": "Descrivi cosa è successo",
      "settings.feedback.placeholder": "Spiega il problema, dove è comparso e cosa ti aspettavi di vedere.",
      "settings.feedback.diagnostics": "Includi dati tecnici di base nel testo copiato: pagina, lingua e dimensioni dello schermo",
      "settings.feedback.copy": "Copia segnalazione",
      "settings.feedback.github": "Apri pagina segnalazioni",
      "settings.feedback.copied": "Segnalazione copiata.",
      "settings.feedback.empty": "Descrivi il problema prima di continuare.",
      "feedback.translation": "Problema di traduzione",
      "feedback.system": "Errore di sistema",
      "feedback.accessibility": "Accessibilità",
      "feedback.suggestion": "Suggerimento",
      "feedback.other": "Altro",
      "common.you": "Tu",
      "common.light": "Chiaro",
      "common.dark": "Scuro",
      "sidebar.tagline": "Sistema di organizzazione della vita",
      "sidebar.mainNavigation": "Navigazione principale",
      "dashboard.sidebarQuote": "Piccole azioni costanti creano cambiamenti reali.",
      "mobile.goToProfile": "Vai al profilo",
      "mobile.openMenu": "Apri menu",
      "mobile.systemMenu": "Menu di sistema",
      "mobile.menu": "Menu",
      "mobile.chooseArea": "Scegli un'area di Fluir",
      "mobile.closeMenu": "Chiudi menu",
      "mobile.mainNavigation": "Navigazione mobile principale",
      "mobile.more": "Altro",
      "mobile.defaultUser": "Utente",
      "mobile.userProfile": "Profilo utente",
      "mobile.timelineShort": "Cronologia"
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


  const LEGACY_PAGE_PHRASES = [
    ["Fluir | Tarefas", "Fluir | Tarefas", "Fluir | Tasks", "Fluir | Tareas", "Fluir | Tâches", "Fluir | Aufgaben", "Fluir | Attività"],
    ["Fluir | Hábitos", "Fluir | Hábitos", "Fluir | Habits", "Fluir | Hábitos", "Fluir | Habitudes", "Fluir | Gewohnheiten", "Fluir | Abitudini"],
    ["Fluir | Sono", "Fluir | Sono", "Fluir | Sleep", "Fluir | Sueño", "Fluir | Sommeil", "Fluir | Schlaf", "Fluir | Sonno"],
    ["Fluir | Água", "Fluir | Água", "Fluir | Water", "Fluir | Agua", "Fluir | Eau", "Fluir | Wasser", "Fluir | Acqua"],
    ["Fluir | Finanças", "Fluir | Finanças", "Fluir | Finances", "Fluir | Finanzas", "Fluir | Finances", "Fluir | Finanzen", "Fluir | Finanze"],
    ["Fluir | Diário emocional", "Fluir | Diário emocional", "Fluir | Emotional diary", "Fluir | Diario emocional", "Fluir | Journal émotionnel", "Fluir | Emotionstagebuch", "Fluir | Diario emotivo"],
    ["Fluir | Alimentação", "Fluir | Alimentação", "Fluir | Nutrition", "Fluir | Alimentación", "Fluir | Alimentation", "Fluir | Ernährung", "Fluir | Alimentazione"],
    ["Fluir | Saúde física", "Fluir | Saúde física", "Fluir | Physical health", "Fluir | Salud física", "Fluir | Santé physique", "Fluir | Körperliche Gesundheit", "Fluir | Salute fisica"],
    ["Fluir | Ciclo menstrual", "Fluir | Ciclo menstrual", "Fluir | Menstrual cycle", "Fluir | Ciclo menstrual", "Fluir | Cycle menstruel", "Fluir | Menstruationszyklus", "Fluir | Ciclo mestruale"],
    ["Fluir | Anexos", "Fluir | Anexos", "Fluir | Attachments", "Fluir | Archivos", "Fluir | Pièces jointes", "Fluir | Anhänge", "Fluir | Allegati"],
    ["Conquistas | Fluir", "Conquistas | Fluir", "Achievements | Fluir", "Logros | Fluir", "Réussites | Fluir", "Erfolge | Fluir", "Traguardi | Fluir"],
    ["Perfil | Fluir", "Perfil | Fluir", "Profile | Fluir", "Perfil | Fluir", "Profil | Fluir", "Profil | Fluir", "Profilo | Fluir"],
    ["Configurações | Fluir", "Definições | Fluir", "Settings | Fluir", "Configuración | Fluir", "Paramètres | Fluir", "Einstellungen | Fluir", "Impostazioni | Fluir"],
    ["Planos e Preços | Fluir", "Planos e Preços | Fluir", "Plans and Pricing | Fluir", "Planes y precios | Fluir", "Offres et tarifs | Fluir", "Tarife und Preise | Fluir", "Piani e prezzi | Fluir"],
    ["Fluir | Login e Cadastro", "Fluir | Início de sessão e registo", "Fluir | Sign in and Sign up", "Fluir | Inicio de sesión y registro", "Fluir | Connexion et inscription", "Fluir | Anmeldung und Registrierung", "Fluir | Accesso e registrazione"],
    ["Fluir | Configuração Inicial", "Fluir | Configuração Inicial", "Fluir | Initial Setup", "Fluir | Configuración inicial", "Fluir | Configuration initiale", "Fluir | Ersteinrichtung", "Fluir | Configurazione iniziale"],

    ["Planeje, priorize e acompanhe suas pendências do dia.", "Planeia, define prioridades e acompanha as tuas pendências do dia.", "Plan, prioritize, and track today's tasks.", "Planifica, prioriza y sigue tus pendientes del día.", "Planifiez, priorisez et suivez les tâches du jour.", "Plane, priorisiere und verfolge deine heutigen Aufgaben.", "Pianifica, dai priorità e segui le attività di oggi."],
    ["Acompanhe sua constância, sequência e evolução semanal.", "Acompanha a tua consistência, sequência e evolução semanal.", "Track your consistency, streak, and weekly progress.", "Sigue tu constancia, racha y progreso semanal.", "Suivez votre régularité, votre série et vos progrès hebdomadaires.", "Verfolge deine Beständigkeit, Serie und deinen Wochenfortschritt.", "Segui costanza, serie e progresso settimanale."],
    ["Registre suas noites, acompanhe qualidade e veja seu descanso ao longo da semana.", "Regista as tuas noites, acompanha a qualidade e vê o teu descanso ao longo da semana.", "Log your nights, track sleep quality, and review your rest throughout the week.", "Registra tus noches, sigue la calidad y revisa tu descanso durante la semana.", "Enregistrez vos nuits, suivez leur qualité et votre repos au fil de la semaine.", "Erfasse deine Nächte, Schlafqualität und Erholung im Wochenverlauf.", "Registra le notti, monitora la qualità e il riposo durante la settimana."],
    ["Registre sua água em ml e acompanhe sua meta diária.", "Regista a tua água em ml e acompanha a tua meta diária.", "Log your water in ml and track your daily goal.", "Registra tu agua en ml y sigue tu meta diaria.", "Enregistrez votre eau en ml et suivez votre objectif quotidien.", "Erfasse dein Wasser in ml und verfolge dein Tagesziel.", "Registra l'acqua in ml e monitora l'obiettivo giornaliero."],
    ["Registre receitas, despesas e acompanhe sua organização financeira.", "Regista receitas, despesas e acompanha a tua organização financeira.", "Record income and expenses and keep track of your finances.", "Registra ingresos y gastos y sigue tu organización financiera.", "Enregistrez revenus et dépenses et suivez votre organisation financière.", "Erfasse Einnahmen und Ausgaben und behalte deine Finanzen im Blick.", "Registra entrate e uscite e monitora la tua organizzazione finanziaria."],
    ["Escreva com calma, registre humor e acompanhe seus padrões emocionais.", "Escreve com calma, regista o humor e acompanha os teus padrões emocionais.", "Write calmly, log your mood, and track emotional patterns.", "Escribe con calma, registra tu estado de ánimo y sigue tus patrones emocionales.", "Écrivez calmement, notez votre humeur et suivez vos tendances émotionnelles.", "Schreibe in Ruhe, erfasse deine Stimmung und beobachte emotionale Muster.", "Scrivi con calma, registra l'umore e segui i tuoi schemi emotivi."],
    ["Registre refeições, acompanhe padrões e organize sua rotina alimentar.", "Regista refeições, acompanha padrões e organiza a tua rotina alimentar.", "Log meals, track patterns, and organize your eating routine.", "Registra comidas, sigue patrones y organiza tu rutina alimentaria.", "Enregistrez vos repas, suivez vos habitudes et organisez votre routine alimentaire.", "Erfasse Mahlzeiten, erkenne Muster und organisiere deine Ernährung.", "Registra i pasti, segui gli schemi e organizza la tua routine alimentare."],
    ["Registre treinos, sintomas, medidas e percepções do corpo.", "Regista treinos, sintomas, medidas e perceções do corpo.", "Log workouts, symptoms, measurements, and body observations.", "Registra entrenamientos, síntomas, medidas y sensaciones corporales.", "Enregistrez entraînements, symptômes, mesures et sensations corporelles.", "Erfasse Training, Symptome, Messwerte und Körperwahrnehmungen.", "Registra allenamenti, sintomi, misure e percezioni del corpo."],
    ["Registre menstruação, sintomas, fluxo e observações importantes.", "Regista menstruação, sintomas, fluxo e observações importantes.", "Log menstruation, symptoms, flow, and important notes.", "Registra menstruación, síntomas, flujo y observaciones importantes.", "Enregistrez les règles, symptômes, flux et observations importantes.", "Erfasse Menstruation, Symptome, Blutungsstärke und wichtige Beobachtungen.", "Registra mestruazioni, sintomi, flusso e osservazioni importanti."],
    ["Guarde links, documentos, imagens e referências associadas à sua rotina.", "Guarda ligações, documentos, imagens e referências associadas à tua rotina.", "Keep links, documents, images, and references connected to your routine.", "Guarda enlaces, documentos, imágenes y referencias relacionadas con tu rutina.", "Conservez liens, documents, images et références liés à votre routine.", "Speichere Links, Dokumente, Bilder und Referenzen zu deiner Routine.", "Conserva link, documenti, immagini e riferimenti legati alla tua routine."],
    ["Acompanhe marcos importantes da sua rotina, saúde, hábitos e organização.", "Acompanha marcos importantes da tua rotina, saúde, hábitos e organização.", "Track important milestones in your routine, health, habits, and organization.", "Sigue hitos importantes de tu rutina, salud, hábitos y organización.", "Suivez les étapes importantes de votre routine, santé, habitudes et organisation.", "Verfolge wichtige Meilensteine deiner Routine, Gesundheit und Gewohnheiten.", "Segui i traguardi importanti della routine, salute, abitudini e organizzazione."],

    ["Nova tarefa", "Nova tarefa", "New task", "Nueva tarea", "Nouvelle tâche", "Neue Aufgabe", "Nuova attività"],
    ["Novo hábito", "Novo hábito", "New habit", "Nuevo hábito", "Nouvelle habitude", "Neue Gewohnheit", "Nuova abitudine"],
    ["Registrar sono", "Registar sono", "Log sleep", "Registrar sueño", "Enregistrer le sommeil", "Schlaf erfassen", "Registra sonno"],
    ["Alterar meta", "Alterar meta", "Change goal", "Cambiar meta", "Modifier l'objectif", "Ziel ändern", "Modifica obiettivo"],
    ["Novo lançamento", "Novo lançamento", "New transaction", "Nuevo movimiento", "Nouvelle opération", "Neue Buchung", "Nuovo movimento"],
    ["Nova entrada", "Nova entrada", "New entry", "Nueva entrada", "Nouvelle entrée", "Neuer Eintrag", "Nuova voce"],
    ["Nova refeição", "Nova refeição", "New meal", "Nueva comida", "Nouveau repas", "Neue Mahlzeit", "Nuovo pasto"],
    ["Novo registro físico", "Novo registo físico", "New physical record", "Nuevo registro físico", "Nouvel enregistrement physique", "Neuer Körpereintrag", "Nuovo registro fisico"],
    ["Novo registro do ciclo", "Novo registo do ciclo", "New cycle record", "Nuevo registro del ciclo", "Nouvel enregistrement du cycle", "Neuer Zykluseintrag", "Nuovo registro del ciclo"],
    ["Novo anexo", "Novo anexo", "New attachment", "Nuevo archivo", "Nouvelle pièce jointe", "Neuer Anhang", "Nuovo allegato"],

    ["Lista de tarefas", "Lista de tarefas", "Task list", "Lista de tareas", "Liste des tâches", "Aufgabenliste", "Elenco attività"],
    ["Seus hábitos aparecem aqui.", "Os teus hábitos aparecem aqui.", "Your habits appear here.", "Tus hábitos aparecen aquí.", "Vos habitudes apparaissent ici.", "Deine Gewohnheiten erscheinen hier.", "Le tue abitudini appaiono qui."],
    ["Histórico de sono", "Histórico de sono", "Sleep history", "Historial de sueño", "Historique du sommeil", "Schlafverlauf", "Cronologia del sonno"],
    ["Controle de hoje", "Controlo de hoje", "Today's tracking", "Control de hoy", "Suivi du jour", "Heutige Übersicht", "Controllo di oggi"],
    ["Lançamentos", "Lançamentos", "Transactions", "Movimientos", "Opérations", "Buchungen", "Movimenti"],
    ["Entradas do diário", "Entradas do diário", "Diary entries", "Entradas del diario", "Entrées du journal", "Tagebucheinträge", "Voci del diario"],
    ["Refeições registradas", "Refeições registadas", "Logged meals", "Comidas registradas", "Repas enregistrés", "Erfasste Mahlzeiten", "Pasti registrati"],
    ["Registros físicos", "Registos físicos", "Physical records", "Registros físicos", "Enregistrements physiques", "Körpereinträge", "Registri fisici"],
    ["Registros do ciclo", "Registos do ciclo", "Cycle records", "Registros del ciclo", "Enregistrements du cycle", "Zykluseinträge", "Registri del ciclo"],
    ["Biblioteca de anexos", "Biblioteca de anexos", "Attachment library", "Biblioteca de archivos", "Bibliothèque de pièces jointes", "Anhangsbibliothek", "Raccolta allegati"],

    ["Nenhuma tarefa encontrada", "Nenhuma tarefa encontrada", "No tasks found", "No se encontraron tareas", "Aucune tâche trouvée", "Keine Aufgaben gefunden", "Nessuna attività trovata"],
    ["Nenhum hábito encontrado", "Nenhum hábito encontrado", "No habits found", "No se encontraron hábitos", "Aucune habitude trouvée", "Keine Gewohnheiten gefunden", "Nessuna abitudine trovata"],
    ["Nenhuma refeição encontrada", "Nenhuma refeição encontrada", "No meals found", "No se encontraron comidas", "Aucun repas trouvé", "Keine Mahlzeiten gefunden", "Nessun pasto trovato"],
    ["Nenhuma entrada encontrada", "Nenhuma entrada encontrada", "No entries found", "No se encontraron entradas", "Aucune entrée trouvée", "Keine Einträge gefunden", "Nessuna voce trovata"],
    ["Nenhum lançamento encontrado", "Nenhum lançamento encontrado", "No transactions found", "No se encontraron movimientos", "Aucune opération trouvée", "Keine Buchungen gefunden", "Nessun movimento trovato"],
    ["Nenhum registro encontrado", "Nenhum registo encontrado", "No records found", "No se encontraron registros", "Aucun enregistrement trouvé", "Keine Einträge gefunden", "Nessun registro trovato"],

    ["Configuração rápida", "Configuração rápida", "Quick setup", "Configuración rápida", "Configuration rapide", "Schnelleinrichtung", "Configurazione rapida"],
    ["Nome ou apelido", "Nome ou alcunha", "Name or nickname", "Nombre o apodo", "Nom ou surnom", "Name oder Spitzname", "Nome o soprannome"],
    ["Como quer ser chamado?", "Como queres ser chamado?", "How would you like to be called?", "¿Cómo quieres que te llamen?", "Comment souhaitez-vous être appelé ?", "Wie möchtest du genannt werden?", "Come vuoi essere chiamato?"],
    ["Meta de água diária", "Meta diária de água", "Daily water goal", "Meta diaria de agua", "Objectif d'eau quotidien", "Tägliches Wasserziel", "Obiettivo acqua giornaliero"],
    ["Módulos ativos", "Módulos ativos", "Active modules", "Módulos activos", "Modules actifs", "Aktive Module", "Moduli attivi"],
    ["Salvar alterações", "Guardar alterações", "Save changes", "Guardar cambios", "Enregistrer les modifications", "Änderungen speichern", "Salva modifiche"],
    ["Tamanho da fonte", "Tamanho da letra", "Font size", "Tamaño de fuente", "Taille de police", "Schriftgröße", "Dimensione carattere"],
    ["Pequena", "Pequena", "Small", "Pequeña", "Petite", "Klein", "Piccola"],
    ["Grande", "Grande", "Large", "Grande", "Grande", "Groß", "Grande"],
    ["Densidade do layout", "Densidade do layout", "Layout density", "Densidad del diseño", "Densité de mise en page", "Layout-Dichte", "Densità layout"],
    ["Compacta", "Compacta", "Compact", "Compacta", "Compacte", "Kompakt", "Compatta"],
    ["Confortável", "Confortável", "Comfortable", "Cómoda", "Confortable", "Komfortabel", "Confortevole"],
    ["Lembretes de hábitos", "Lembretes de hábitos", "Habit reminders", "Recordatorios de hábitos", "Rappels d'habitudes", "Gewohnheitserinnerungen", "Promemoria abitudini"],
    ["Resumo diário", "Resumo diário", "Daily summary", "Resumen diario", "Résumé quotidien", "Tageszusammenfassung", "Riepilogo giornaliero"],
    ["Alertas de sono", "Alertas de sono", "Sleep alerts", "Alertas de sueño", "Alertes de sommeil", "Schlafhinweise", "Avvisi sonno"],
    ["Lembretes de hidratação", "Lembretes de hidratação", "Hydration reminders", "Recordatorios de hidratación", "Rappels d'hydratation", "Trinkerinnerungen", "Promemoria idratazione"],
    ["Horário do resumo", "Hora do resumo", "Summary time", "Hora del resumen", "Heure du résumé", "Zeit der Zusammenfassung", "Ora del riepilogo"],
    ["Bloquear com senha", "Bloquear com palavra-passe", "Lock with password", "Bloquear con contraseña", "Verrouiller par mot de passe", "Mit Passwort sperren", "Blocca con password"],
    ["Ocultar valores financeiros", "Ocultar valores financeiros", "Hide financial values", "Ocultar valores financieros", "Masquer les montants financiers", "Finanzwerte ausblenden", "Nascondi valori finanziari"],
    ["Perfil visível apenas para mim", "Perfil visível apenas para mim", "Profile visible only to me", "Perfil visible solo para mí", "Profil visible uniquement par moi", "Profil nur für mich sichtbar", "Profilo visibile solo a me"],

    ["Seu espaço pessoal dentro do Fluir.", "O teu espaço pessoal dentro do Fluir.", "Your personal space inside Fluir.", "Tu espacio personal dentro de Fluir.", "Votre espace personnel dans Fluir.", "Dein persönlicher Bereich in Fluir.", "Il tuo spazio personale in Fluir."],
    ["Membro desde", "Membro desde", "Member since", "Miembro desde", "Membre depuis", "Mitglied seit", "Membro dal"],
    ["Hábitos ativos", "Hábitos ativos", "Active habits", "Hábitos activos", "Habitudes actives", "Aktive Gewohnheiten", "Abitudini attive"],
    ["Registros no diário", "Registos no diário", "Diary entries", "Registros en el diario", "Entrées du journal", "Tagebucheinträge", "Voci del diario"],
    ["Nível de foco", "Nível de foco", "Focus level", "Nivel de enfoque", "Niveau de concentration", "Fokusniveau", "Livello di concentrazione"],
    ["Tema preferido", "Tema preferido", "Preferred theme", "Tema preferido", "Thème préféré", "Bevorzugtes Design", "Tema preferito"],
    ["Lembretes", "Lembretes", "Reminders", "Recordatorios", "Rappels", "Erinnerungen", "Promemoria"],
    ["Visualização inicial", "Visualização inicial", "Start view", "Vista inicial", "Vue de départ", "Startansicht", "Vista iniziale"],

    ["Planos e preços", "Planos e preços", "Plans and pricing", "Planes y precios", "Offres et tarifs", "Tarife und Preise", "Piani e prezzi"],
    ["Escolha um plano que acompanhe sua rotina.", "Escolhe um plano que acompanhe a tua rotina.", "Choose a plan that fits your routine.", "Elige un plan que acompañe tu rutina.", "Choisissez une offre adaptée à votre routine.", "Wähle einen Tarif, der zu deiner Routine passt.", "Scegli un piano adatto alla tua routine."],
    ["Plano atual", "Plano atual", "Current plan", "Plan actual", "Offre actuelle", "Aktueller Tarif", "Piano attuale"],
    ["Gratuito", "Gratuito", "Free", "Gratuito", "Gratuit", "Kostenlos", "Gratuito"],
    ["Pessoal", "Pessoal", "Personal", "Personal", "Personnel", "Persönlich", "Personale"],
    ["Completo", "Completo", "Complete", "Completo", "Complet", "Komplett", "Completo"],
    ["Comparação de recursos", "Comparação de recursos", "Feature comparison", "Comparación de funciones", "Comparaison des fonctionnalités", "Funktionsvergleich", "Confronto funzionalità"],

    ["Bem-vindo de volta", "Bem-vindo de volta", "Welcome back", "Bienvenido de nuevo", "Bon retour", "Willkommen zurück", "Bentornato"],
    ["Criar conta", "Criar conta", "Create account", "Crear cuenta", "Créer un compte", "Konto erstellen", "Crea account"],
    ["Lembrar de mim", "Lembrar-me", "Remember me", "Recordarme", "Se souvenir de moi", "Angemeldet bleiben", "Ricordami"],
    ["Esqueci minha senha", "Esqueci-me da palavra-passe", "Forgot my password", "Olvidé mi contraseña", "Mot de passe oublié", "Passwort vergessen", "Password dimenticata"],
    ["Entrar", "Entrar", "Sign in", "Entrar", "Se connecter", "Anmelden", "Accedi"],
    ["Cadastrar", "Registar", "Sign up", "Registrarse", "S'inscrire", "Registrieren", "Registrati"],
    ["Confirmar senha", "Confirmar palavra-passe", "Confirm password", "Confirmar contraseña", "Confirmer le mot de passe", "Passwort bestätigen", "Conferma password"],
    ["Mostrar senha", "Mostrar palavra-passe", "Show password", "Mostrar contraseña", "Afficher le mot de passe", "Passwort anzeigen", "Mostra password"],

    ["Configuração inicial", "Configuração inicial", "Initial setup", "Configuración inicial", "Configuration initiale", "Ersteinrichtung", "Configurazione iniziale"],
    ["Sobre você", "Sobre ti", "About you", "Sobre ti", "À propos de vous", "Über dich", "Su di te"],
    ["Funcionalidades", "Funcionalidades", "Features", "Funciones", "Fonctionnalités", "Funktionen", "Funzionalità"],
    ["Preferências", "Preferências", "Preferences", "Preferencias", "Préférences", "Präferenzen", "Preferenze"],
    ["Quais funcionalidades você quer ativar?", "Que funcionalidades queres ativar?", "Which features do you want to enable?", "¿Qué funciones quieres activar?", "Quelles fonctionnalités souhaitez-vous activer ?", "Welche Funktionen möchtest du aktivieren?", "Quali funzionalità vuoi attivare?"],
    ["Revise sua configuração.", "Revê a tua configuração.", "Review your setup.", "Revisa tu configuración.", "Vérifiez votre configuration.", "Überprüfe deine Einrichtung.", "Controlla la configurazione."],
    ["Configuração inicial salva", "Configuração inicial guardada", "Initial setup saved", "Configuración inicial guardada", "Configuration initiale enregistrée", "Ersteinrichtung gespeichert", "Configurazione iniziale salvata"]
  ];

  const LEGACY_PAGE_LANGUAGE_INDEX = {
    "pt-BR": 0,
    "pt-PT": 1,
    en: 2,
    es: 3,
    fr: 4,
    de: 5,
    it: 6
  };

  Object.entries(LEGACY_PAGE_LANGUAGE_INDEX).forEach(([language, index]) => {
    if (language === DEFAULT_LANGUAGE) {
      return;
    }

    LEGACY_TEXT_TRANSLATIONS[language] =
      LEGACY_TEXT_TRANSLATIONS[language] || {};

    LEGACY_PAGE_PHRASES.forEach((entry) => {
      if (!LEGACY_TEXT_TRANSLATIONS[language][entry[0]]) {
        LEGACY_TEXT_TRANSLATIONS[language][entry[0]] =
          entry[index] || entry[0];
      }
    });
  });


  const LEGACY_LANDING_PHRASES = [
    ["Fluir | Organização da Vida", "Fluir | Organização da Vida", "Fluir | Life Organization", "Fluir | Organización de la Vida", "Fluir | Organisation de la vie", "Fluir | Lebensorganisation", "Fluir | Organizzazione della vita"],
    ["Organização da Vida", "Organização da Vida", "Life Organization", "Organización de la Vida", "Organisation de la vie", "Lebensorganisation", "Organizzazione della vita"],
    ["Sobre", "Sobre", "About", "Sobre", "À propos", "Über", "Informazioni"],
    ["Funcionalidades", "Funcionalidades", "Features", "Funciones", "Fonctionnalités", "Funktionen", "Funzionalità"],
    ["Versões", "Versões", "Versions", "Versiones", "Versions", "Versionen", "Versioni"],
    ["Web, mobile e desktop planejados", "Web, mobile e desktop planeados", "Web, mobile, and desktop planned", "Web, móvil y escritorio planificados", "Web, mobile et bureau prévus", "Web, Mobil und Desktop geplant", "Web, mobile e desktop pianificati"],
    ["Organize sua rotina, seus hábitos e seu bem-estar em um só lugar.", "Organiza a tua rotina, os teus hábitos e o teu bem-estar num só lugar.", "Organize your routine, habits, and well-being in one place.", "Organiza tu rutina, tus hábitos y tu bienestar en un solo lugar.", "Organisez votre routine, vos habitudes et votre bien-être au même endroit.", "Organisiere Routine, Gewohnheiten und Wohlbefinden an einem Ort.", "Organizza routine, abitudini e benessere in un unico posto."],
    ["Acessar sistema", "Aceder ao sistema", "Open system", "Acceder al sistema", "Accéder au système", "System öffnen", "Accedi al sistema"],
    ["Ver funcionalidades", "Ver funcionalidades", "View features", "Ver funciones", "Voir les fonctionnalités", "Funktionen ansehen", "Vedi funzionalità"],
    ["Sobre o projeto", "Sobre o projeto", "About the project", "Sobre el proyecto", "À propos du projet", "Über das Projekt", "Sul progetto"],
    ["Um sistema para acompanhar a vida com mais clareza.", "Um sistema para acompanhar a vida com mais clareza.", "A system for following life with greater clarity.", "Un sistema para seguir la vida con más claridad.", "Un système pour suivre la vie avec plus de clarté.", "Ein System, um das Leben klarer zu begleiten.", "Un sistema per seguire la vita con più chiarezza."],
    ["O que o sistema oferece", "O que o sistema oferece", "What the system offers", "Lo que ofrece el sistema", "Ce que propose le système", "Was das System bietet", "Cosa offre il sistema"],
    ["Criação e acompanhamento de atividades importantes da rotina.", "Criação e acompanhamento de atividades importantes da rotina.", "Create and track important routine activities.", "Crea y sigue actividades importantes de la rutina.", "Créez et suivez les activités importantes de votre routine.", "Erstelle und verfolge wichtige Aufgaben deiner Routine.", "Crea e segui attività importanti della routine."],
    ["Controle de hábitos pessoais com foco em constância e progresso.", "Controlo de hábitos pessoais com foco em consistência e progresso.", "Track personal habits with a focus on consistency and progress.", "Controla hábitos personales con enfoque en constancia y progreso.", "Suivez vos habitudes personnelles en mettant l'accent sur la régularité et les progrès.", "Verfolge persönliche Gewohnheiten mit Fokus auf Beständigkeit und Fortschritt.", "Monitora le abitudini personali con attenzione a costanza e progresso."],
    ["Hidratação", "Hidratação", "Hydration", "Hidratación", "Hydratation", "Hydration", "Idratazione"],
    ["Registro de consumo de água e acompanhamento diário.", "Registo do consumo de água e acompanhamento diário.", "Log water intake and track it daily.", "Registra el consumo de agua y haz seguimiento diario.", "Enregistrez votre consommation d'eau et suivez-la chaque jour.", "Erfasse deine Wasseraufnahme und verfolge sie täglich.", "Registra il consumo d'acqua e monitoralo ogni giorno."],
    ["Organização de entradas, saídas e metas financeiras.", "Organização de entradas, saídas e metas financeiras.", "Organize income, expenses, and financial goals.", "Organiza ingresos, gastos y metas financieras.", "Organisez revenus, dépenses et objectifs financiers.", "Organisiere Einnahmen, Ausgaben und finanzielle Ziele.", "Organizza entrate, uscite e obiettivi finanziari."],
    ["Acompanhamento da rotina de descanso e qualidade do sono.", "Acompanhamento da rotina de descanso e qualidade do sono.", "Track your rest routine and sleep quality.", "Sigue tu rutina de descanso y la calidad del sueño.", "Suivez votre routine de repos et la qualité de votre sommeil.", "Verfolge deine Schlafroutine und Schlafqualität.", "Monitora la routine di riposo e la qualità del sonno."],
    ["Área de usuário com informações pessoais e preferências.", "Área de utilizador com informações pessoais e preferências.", "User area with personal information and preferences.", "Área de usuario con información personal y preferencias.", "Espace utilisateur avec informations personnelles et préférences.", "Benutzerbereich mit persönlichen Informationen und Einstellungen.", "Area utente con informazioni personali e preferenze."],
    ["Versões do sistema", "Versões do sistema", "System versions", "Versiones del sistema", "Versions du système", "Systemversionen", "Versioni del sistema"],
    ["O Fluir foi pensado para funcionar em diferentes plataformas.", "O Fluir foi pensado para funcionar em diferentes plataformas.", "Fluir was designed to work across different platforms.", "Fluir fue pensado para funcionar en diferentes plataformas.", "Fluir a été conçu pour fonctionner sur différentes plateformes.", "Fluir wurde für verschiedene Plattformen entwickelt.", "Fluir è stato progettato per funzionare su diverse piattaforme."],
    ["Sistema Web", "Sistema Web", "Web system", "Sistema web", "Système web", "Web-System", "Sistema web"],
    ["App Android", "App Android", "Android app", "App Android", "Application Android", "Android-App", "App Android"],
    ["App iOS", "App iOS", "iOS app", "App iOS", "Application iOS", "iOS-App", "App iOS"],
    ["Desktop Futuro", "Desktop futuro", "Future desktop app", "Escritorio futuro", "Application de bureau à venir", "Zukünftige Desktop-App", "Desktop futuro"],
    ["Comece a explorar o Fluir", "Começa a explorar o Fluir", "Start exploring Fluir", "Empieza a explorar Fluir", "Commencez à explorer Fluir", "Entdecke Fluir", "Inizia a esplorare Fluir"],
    ["Acesse a tela de login e veja as áreas principais do sistema.", "Acede ao ecrã de início de sessão e vê as principais áreas do sistema.", "Open the sign-in screen and explore the system's main areas.", "Accede a la pantalla de inicio de sesión y explora las áreas principales del sistema.", "Accédez à l'écran de connexion et découvrez les principales sections du système.", "Öffne die Anmeldung und entdecke die wichtigsten Bereiche des Systems.", "Apri la schermata di accesso ed esplora le aree principali del sistema."],
    ["Entrar no sistema", "Entrar no sistema", "Enter system", "Entrar al sistema", "Accéder au système", "System öffnen", "Entra nel sistema"],
    ["Fluir — Sistema de Organização da Vida", "Fluir — Sistema de Organização da Vida", "Fluir — Life Organization System", "Fluir — Sistema de Organización de la Vida", "Fluir — Système d'organisation de la vie", "Fluir — System zur Lebensorganisation", "Fluir — Sistema di organizzazione della vita"]
  ];

  Object.entries(LEGACY_PAGE_LANGUAGE_INDEX).forEach(([language, index]) => {
    if (language === DEFAULT_LANGUAGE) {
      return;
    }

    LEGACY_LANDING_PHRASES.forEach((entry) => {
      if (!LEGACY_TEXT_TRANSLATIONS[language][entry[0]]) {
        LEGACY_TEXT_TRANSLATIONS[language][entry[0]] =
          entry[index] || entry[0];
      }
    });
  });

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
      /^(TITLE|H1|H2|H3|H4|H5|H6|BUTTON|A|LABEL|SMALL|OPTION|TH|TD|FOOTER)$/.test(element.tagName) ||
      element.matches(
        ".section-kicker, .notif-row-title, .notif-row-desc, .notif-row-time, .event-tag, .filter-btn, .tab-btn, .date-btn, .side-link, .mood-question, .week-text, .summary-card > p, .summary-card > small, .side-card h4, .focus-card > p, .focus-card > small"
      );

    if (textTargets) {
      if (element.children.length === 0) {
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
      } else {
        [...element.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .forEach((node) => {
            if (!Object.prototype.hasOwnProperty.call(node, "__fluirI18nSource")) {
              node.__fluirI18nSource = node.nodeValue || "";
            }

            const translated = translateLegacyString(
              node.__fluirI18nSource
            );

            if (translated !== node.nodeValue) {
              applyingLegacyTranslation = true;
              node.nodeValue = translated;
              applyingLegacyTranslation = false;
            }
          });
      }
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

    const standalonePages = ["", "index.html", "login.html", "setup.html"];

    if (
      !standalonePages.includes(page) ||
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

    const defaultValue =
      translations[DEFAULT_LANGUAGE]?.[key] ??
      fallback ??
      key;

    const translatedValue =
      translations[language]?.[key] ??
      translateLegacyString(defaultValue, language) ??
      defaultValue;

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
