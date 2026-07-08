import { useMemo, useState } from "react";
import "./App.css";

import { BottomNav } from "./components/BottomNav";
import { DrawerMenu } from "./components/DrawerMenu";
import { MobileHeader } from "./components/MobileHeader";

import { Dashboard } from "./screens/Dashboard";
import { LoginScreen } from "./screens/LoginScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";

import { loginUser, saveOnboarding, testBackendConnection } from "./services/api";

import type { Modules, OnboardingData, Screen, User } from "./types/fluir";

function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("API ainda não testada");

  const [user, setUser] = useState<User>({
    id: 1,
    nome: "Alex",
    email: "Perfil do usuário",
  });

  const [email, setEmail] = useState("alex@email.com");
  const [senha, setSenha] = useState("123456");

  const [nome, setNome] = useState("Alex");
  const [pronomes, setPronomes] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");

  const [firstTask, setFirstTask] = useState("");
const [firstHabit, setFirstHabit] = useState("");
const [waterMode, setWaterMode] = useState("ml");

  const [modules, setModules] = useState<Modules>({
    tasks: true,
    habits: true,
    water: true,
    sleep: false,
    finances: false,
    diary: false,
    nutrition: false,
    physicalHealth: false,
    menstrualCycle: false,
  });

  const waterGoal = useMemo(() => {
    const numericWeight = Number(peso);

    if (!numericWeight || numericWeight <= 0) {
      return 0;
    }

    return numericWeight * 35;
  }, [peso]);

  function toggleModule(moduleName: keyof Modules) {
    setModules((currentModules) => ({
      ...currentModules,
      [moduleName]: !currentModules[moduleName],
    }));
  }

  async function handleTestBackend() {
    try {
      setLoading(true);
      setApiStatus("Testando conexão com o backend...");

      const response = await testBackendConnection();

      setApiStatus(`Backend conectado: ${response}`);
    } catch {
      setApiStatus("Backend não conectado neste PC. App em modo demonstração.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      alert("Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, senha);

      const loggedUser: User = {
        id: data.id || 1,
        nome: data.nome || "Usuário",
        email: data.email || email,
      };

      setUser(loggedUser);
      setNome(loggedUser.nome);
      setScreen("onboarding");
    } catch {
      alert(
        "Backend indisponível neste PC. O app vai continuar em modo demonstração."
      );

      const demoUser: User = {
        id: 1,
        nome: "Alex",
        email,
      };

      setUser(demoUser);
      setNome(demoUser.nome);
      setScreen("onboarding");
    } finally {
      setLoading(false);
    }
  }

  function handleDemoAccess() {
  const demoUser: User = {
    id: 1,
    nome: "Alex",
    email: email || "usuario@email.com",
  };

  setUser(demoUser);
  setNome(demoUser.nome);
  setScreen("onboarding");
}

  async function handleSaveOnboarding() {
    if (!nome.trim()) {
      alert("Digite seu nome.");
      return;
    }

    const numericHeight = Number(altura);
    const numericWeight = Number(peso);

    const onboardingData: OnboardingData = {
      usuarioId: user.id,
      nome,
      apelido: nome,
      pronomes,
      generoNascimento: "",
      altura: numericHeight || 0,
      peso: numericWeight || 0,
      energiaAtual: "media",
      modulos: {
        timeline: true,
        tasks: modules.tasks,
        habits: modules.habits,
        sleep: modules.sleep,
        water: modules.water,
        finances: modules.finances,
        diary: modules.diary,
        nutrition: modules.nutrition,
        physicalHealth: modules.physicalHealth,
        menstrualCycle: modules.menstrualCycle,
        attachments: true,
      },
      agua: {
  metaCalculadaMl: waterGoal,
  metaFinalMl: waterGoal,
  modoRegistro: waterMode,
},

primeiraTarefa: firstTask.trim()
  ? {
      titulo: firstTask.trim(),
      tempoEstimadoMinutos: 30,
      energiaGasta: "media",
    }
  : null,

primeiroHabito: firstHabit.trim()
  ? {
      titulo: firstHabit.trim(),
      frequenciaSemanal: 7,
      melhorHorario: "manha",
    }
  : null,
    };

    try {
      setLoading(true);

      await saveOnboarding(onboardingData);

      setUser((currentUser) => ({
        ...currentUser,
        nome,
      }));

      setScreen("dashboard");
    } catch {
      alert(
        "Não foi possível salvar no backend agora. O fluxo mobile vai continuar em modo demonstração."
      );

      setUser((currentUser) => ({
        ...currentUser,
        nome,
      }));

      setScreen("dashboard");
    } finally {
      setLoading(false);
    }
  }

  function renderScreen() {
    if (screen === "login") {
      return (
        <LoginScreen
  email={email}
  senha={senha}
  carregando={loading}
  onEmailChange={setEmail}
  onSenhaChange={setSenha}
  onLogin={handleLogin}
  onDemo={handleDemoAccess}
/>
      );
    }

    if (screen === "onboarding") {
      return (
        <OnboardingScreen
  nome={nome}
  pronomes={pronomes}
  altura={altura}
  peso={peso}
  metaAgua={waterGoal}
  modulos={modules}
  carregando={loading}
  firstTask={firstTask}
  firstHabit={firstHabit}
  waterMode={waterMode}
  onNomeChange={setNome}
  onPronomesChange={setPronomes}
  onAlturaChange={setAltura}
  onPesoChange={setPeso}
  onFirstTaskChange={setFirstTask}
  onFirstHabitChange={setFirstHabit}
  onWaterModeChange={setWaterMode}
  onToggleModule={toggleModule}
  onSave={handleSaveOnboarding}
/>
      );
    }

    return (
      <Dashboard
  nome={nome}
  metaAgua={waterGoal}
  modulos={modules}
  firstTask={firstTask}
  firstHabit={firstHabit}
  waterMode={waterMode}
  onEditSetup={() => setScreen("onboarding")}
/>
    );
  }

  return (
    <main className="app-shell">
      <section className="phone-frame">
        <MobileHeader user={user} onOpenMenu={() => setDrawerOpen(true)} />

        <section className="api-card">
          <div>
            <small>Status da API</small>
            <p>{apiStatus}</p>
          </div>

          <button type="button" onClick={handleTestBackend}>
            {loading ? "..." : "Testar"}
          </button>
        </section>

        <div className="screen-area">{renderScreen()}</div>

        {screen === "dashboard" && (
  <>
    <BottomNav
      currentScreen={screen}
      onChangeScreen={setScreen}
      onOpenMenu={() => setDrawerOpen(true)}
    />

    <DrawerMenu
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    />
  </>
)}

      </section>
    </main>
  );
}

export default App;