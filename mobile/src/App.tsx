import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { BottomNav } from "./components/BottomNav";
import { DrawerMenu } from "./components/DrawerMenu";
import { MobileHeader } from "./components/MobileHeader";

import { Dashboard } from "./screens/Dashboard";
import { AssistantScreen } from "./screens/AssistantScreen";
import { HabitsScreen } from "./screens/HabitsScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { TasksScreen } from "./screens/TasksScreen";
import { WaterScreen } from "./screens/WaterScreen";

import {
  getCurrentUser, getOnboarding, loginUser, registerUser, saveOnboarding,
  sendPasswordReset, signOut, testBackendConnection, updatePassword,
} from "./services/api";
import { getSupabase } from "./infrastructure/supabase";
import type { Modules, OnboardingData, Screen, User } from "./types/fluir";

const defaultModules: Modules = {
  tasks: true, habits: true, water: true, sleep: false,
  finances: false, diary: false, nutrition: false,
  physicalHealth: false, menstrualCycle: false,
};
const emptyUser: User = { id: "", nome: "Visitante", email: "" };

function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [apiStatus, setApiStatus] = useState("Conexão não verificada");

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [pronomes, setPronomes] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [firstTask, setFirstTask] = useState("");
  const [firstHabit, setFirstHabit] = useState("");
  const [waterMode, setWaterMode] = useState("ml");
  const [modules, setModules] = useState<Modules>(defaultModules);

  const waterGoal = useMemo(() => {
    const n = Number(peso);
    return Number.isFinite(n) && n > 0 ? Math.round(n * 35) : 0;
  }, [peso]);

  function fillOnboarding(data: OnboardingData | null) {
    if (!data) return;
    setNome(data.nome || "");
    setPronomes(data.pronomes || "");
    setAltura(String(data.altura || ""));
    setPeso(String(data.peso || ""));
    setFirstTask(data.primeiraTarefa?.titulo || "");
    setFirstHabit(data.primeiroHabito?.titulo || "");
    setWaterMode(data.agua?.modoRegistro || "ml");
    if (data.modulos) {
      setModules({
        tasks: Boolean(data.modulos.tasks), habits: Boolean(data.modulos.habits),
        water: Boolean(data.modulos.water), sleep: Boolean(data.modulos.sleep),
        finances: Boolean(data.modulos.finances), diary: Boolean(data.modulos.diary),
        nutrition: Boolean(data.modulos.nutrition),
        physicalHealth: Boolean(data.modulos.physicalHealth),
        menstrualCycle: Boolean(data.modulos.menstrualCycle),
      });
    }
  }

  async function openAccount(account: User) {
    const onboarding = await getOnboarding();
    setIsDemo(false);
    setUser(account);
    setNome(account.nome);
    fillOnboarding(onboarding.payload);
    setScreen(onboarding.completed ? "dashboard" : "onboarding");
    setApiStatus("Autenticado via Supabase");
  }

  useEffect(() => {
    let active = true;
    try {
      const client = getSupabase();
      const subscription = client.auth.onAuthStateChange((event) => {
        if (!active) return;
        if (event === "PASSWORD_RECOVERY") {
          setPasswordRecovery(true);
          setScreen("login");
          setAuthMessage("Digite sua nova senha.");
        }
        if (event === "SIGNED_OUT") {
          setUser(null);
          setIsDemo(false);
          setScreen("login");
        }
      });
      void getCurrentUser()
        .then(async account => {
          if (!active || !account) return;
          const onboarding = await getOnboarding();
          if (!active) return;
          setUser(account);
          setNome(account.nome);
          fillOnboarding(onboarding.payload);
          setScreen(onboarding.completed ? "dashboard" : "onboarding");
          setApiStatus("Sessão restaurada via Supabase");
        })
        .catch(error => {
          if (active) setAuthMessage(
            error instanceof Error ? error.message : "Não foi possível verificar sua sessão."
          );
        })
        .finally(() => { if (active) setInitializing(false); });
      return () => { active = false; subscription.data.subscription.unsubscribe(); };
    } catch (error) {
      // Atualiza o estado fora da execução síncrona do effect.
      void Promise.resolve().then(() => {
        if (!active) return;
        setAuthMessage(error instanceof Error ? error.message : "Supabase indisponível.");
        setInitializing(false);
      });
      return () => { active = false; };
    }
  }, []);

  function toggleModule(module: keyof Modules) {
    if (isDemo) return;
    setModules(m => ({ ...m, [module]: !m[module] }));
  }

  async function handleTestBackend() {
    if (isDemo) { setApiStatus("Demonstração local: sem conexão ou salvamento"); return; }
    setLoading(true);
    try { setApiStatus(await testBackendConnection()); }
    catch (error) { setApiStatus(error instanceof Error ? error.message : "Supabase indisponível"); }
    finally { setLoading(false); }
  }

  async function handleLogin() {
    setAuthMessage("");
    setLoading(true);
    try {
      const account = await loginUser(email, senha);
      await openAccount({ id: account.id!, nome: account.nome || "Pessoa", email: account.email || email });
      setSenha("");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Falha ao entrar.");
    } finally { setLoading(false); }
  }

  async function handleRegister() {
    setAuthMessage("");
    setLoading(true);
    try {
      const registered = await registerUser(email, senha, nome);
      setSenha("");
      if (registered.confirmationRequired) {
        setAuthMessage("Cadastro recebido. Confirme seu e-mail e depois entre.");
      } else {
        const account = await getCurrentUser();
        if (!account?.id) throw new Error("Cadastro realizado, mas a sessão ainda não foi confirmada.");
        await openAccount({ id: account.id, nome: account.nome || nome, email: account.email || email });
      }
    } catch (error) { setAuthMessage(error instanceof Error ? error.message : "Falha no cadastro."); }
    finally { setLoading(false); }
  }

  async function handlePasswordReset() {
    setAuthMessage("");
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setAuthMessage("Se esse e-mail estiver cadastrado, você receberá as instruções de recuperação.");
    } catch (error) { setAuthMessage(error instanceof Error ? error.message : "Falha na recuperação."); }
    finally { setLoading(false); }
  }

  async function handlePasswordUpdate() {
    setLoading(true);
    try {
      await updatePassword(senha);
      setSenha("");
      setPasswordRecovery(false);
      setAuthMessage("Senha atualizada. Entre com sua nova senha.");
    } catch (error) { setAuthMessage(error instanceof Error ? error.message : "Falha ao atualizar senha."); }
    finally { setLoading(false); }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      if (!isDemo) await signOut();
      setUser(null);
      setIsDemo(false);
      setPasswordRecovery(false);
      setScreen("login");
      setAuthMessage("");
      setSenha("");
    } catch (error) { setApiStatus(error instanceof Error ? error.message : "Não foi possível sair."); }
    finally { setLoading(false); }
  }

  function handleDemoAccess() {
    setIsDemo(true);
    setUser({ id: "", nome: "Visitante", email: "Demonstração sem conta" });
    setNome("Visitante");
    setScreen("dashboard");
    setApiStatus("DEMONSTRAÇÃO: não salva nem sincroniza dados");
  }

  async function handleSaveOnboarding() {
    setAuthMessage("");
    if (isDemo || !user?.id) {
      setApiStatus("Entre na sua conta para salvar informações.");
      setAuthMessage("A demonstração não salva informações. Entre em uma conta.");
      return;
    }
    if (!nome.trim()) { setApiStatus("Informe seu nome para continuar."); return; }

    const weight = Number(peso);
    const height = Number(altura);
    const onboardingData: OnboardingData = {
      usuarioId: user.id,
      nome: nome.trim(), apelido: nome.trim(), pronomes, generoNascimento: "",
      altura: Number.isFinite(height) ? height : 0,
      peso: Number.isFinite(weight) ? weight : 0, energiaAtual: "media",
      modulos: {
        timeline: true, tasks: modules.tasks, habits: modules.habits,
        sleep: modules.sleep, water: modules.water, finances: modules.finances,
        diary: modules.diary, nutrition: modules.nutrition,
        physicalHealth: modules.physicalHealth, menstrualCycle: modules.menstrualCycle,
        attachments: true,
      },
      agua: { metaCalculadaMl: waterGoal, metaFinalMl: waterGoal, modoRegistro: waterMode },
      primeiraTarefa: firstTask.trim() ? {
        titulo: firstTask.trim(), tempoEstimadoMinutos: 30, energiaGasta: "media"
      } : null,
      primeiroHabito: firstHabit.trim() ? {
        titulo: firstHabit.trim(), frequenciaSemanal: 7, melhorHorario: "manha"
      } : null,
    };

    setLoading(true);
    try {
      await saveOnboarding(onboardingData);
      setUser(u => u ? ({ ...u, nome: nome.trim() }) : null);
      setScreen("dashboard");
      setApiStatus("Onboarding salvo no Supabase");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao salvar configuração.";
      setApiStatus(message);
      setAuthMessage(message);
      // Nunca simular sucesso ou avançar após falha.
    } finally { setLoading(false); }
  }

  function renderScreen() {
    if (screen === "login") {
      return (
        <LoginScreen
          email={email} senha={senha} nome={nome}
          carregando={loading} aviso={authMessage} passwordRecovery={passwordRecovery}
          onEmailChange={setEmail} onSenhaChange={setSenha} onNomeChange={setNome}
          onLogin={handleLogin} onRegister={handleRegister}
          onRecover={handlePasswordReset} onUpdatePassword={handlePasswordUpdate}
          onDemo={handleDemoAccess}
        />
      );
    }
    if (screen === "onboarding") {
      return (
        <OnboardingScreen
          nome={nome} pronomes={pronomes} altura={altura} peso={peso}
          metaAgua={waterGoal} modulos={modules} carregando={loading} aviso={authMessage}
          firstTask={firstTask} firstHabit={firstHabit} waterMode={waterMode}
          onNomeChange={setNome} onPronomesChange={setPronomes}
          onAlturaChange={setAltura} onPesoChange={setPeso}
          onFirstTaskChange={setFirstTask} onFirstHabitChange={setFirstHabit}
          onWaterModeChange={setWaterMode} onToggleModule={toggleModule}
          onSave={handleSaveOnboarding}
        />
      );
    }
    if (screen === "tasks") return <TasksScreen firstTask={firstTask} onFirstTaskChange={setFirstTask} isDemo={isDemo} />;
    if (screen === "habits") return <HabitsScreen firstHabit={firstHabit} onFirstHabitChange={setFirstHabit} />;
    if (screen === "water") return <WaterScreen metaAgua={waterGoal} waterMode={waterMode} onWaterModeChange={setWaterMode} />;
    if (screen === "assistant") return <AssistantScreen isDemo={isDemo} />;
    if (screen === "settings") {
      return (
        <SettingsScreen
          nome={nome} peso={peso} altura={altura} modulos={modules}
          onNomeChange={setNome} onPesoChange={setPeso}
          onAlturaChange={setAltura} onToggleModule={toggleModule}
          onLogout={handleLogout} onSave={handleSaveOnboarding} isDemo={isDemo}
        />
      );
    }
    return (
      <Dashboard
        nome={nome} metaAgua={waterGoal} modulos={modules}
        firstTask={firstTask} firstHabit={firstHabit}
        waterMode={waterMode} onEditSetup={() => setScreen("settings")}
      />
    );
  }

  const navVisible = screen !== "login" && screen !== "register" && screen !== "onboarding";
  if (initializing) return <main className="app-shell"><p role="status">Verificando sessão...</p></main>;

  return (
    <main className="app-shell">
      <section className="phone-frame">
        <MobileHeader user={user ?? emptyUser} onOpenMenu={() => setDrawerOpen(true)} />
        {navVisible && (
          <section className="api-card">
            <div>
              <small>{isDemo ? "Demonstração" : "Status da API"}</small>
              <p>{apiStatus}</p>
            </div>
            <button type="button" onClick={handleTestBackend} disabled={loading}>
              {loading ? "..." : "Verificar"}
            </button>
          </section>
        )}
        <div className="screen-area">{renderScreen()}</div>
        {navVisible && (
          <>
            <BottomNav currentScreen={screen} onChangeScreen={setScreen} isDemo={isDemo} onOpenMenu={() => setDrawerOpen(true)} />
            <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onChangeScreen={setScreen} />
          </>
        )}
      </section>
    </main>
  );
}

export default App;
