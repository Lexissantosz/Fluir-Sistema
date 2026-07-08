import { SummaryCard } from "../components/SummaryCard";
import type { Modules } from "../types/fluir";

type DashboardProps = {
  nome: string;
  metaAgua: number;
  modulos: Modules;
  firstTask: string;
  firstHabit: string;
  waterMode: string;
  onEditSetup: () => void;
};

export function Dashboard({
  nome,
  metaAgua,
  modulos,
  firstTask,
  firstHabit,
  waterMode,
  onEditSetup,
}: DashboardProps) {
  const activeModulesCount = Object.values(modulos).filter(Boolean).length;

  return (
    <section className="dashboard-screen">
      <div className="dashboard-welcome-card">
        <div>
          <span>Início</span>
          <h1>Olá, {nome}</h1>
          <p>Respire fundo. Um dia de cada vez, no seu ritmo.</p>
        </div>

        <div className="dashboard-avatar">{nome.charAt(0).toUpperCase()}</div>
      </div>

      <div className="today-focus-card">
        <div>
          <span>Foco de hoje</span>
          <strong>
            {firstTask.trim() || firstHabit.trim() || "Configure seu primeiro passo"}
          </strong>
          <small>
            {firstTask.trim()
              ? "Primeira tarefa escolhida no onboarding."
              : firstHabit.trim()
              ? "Primeiro hábito escolhido no onboarding."
              : "Adicione uma tarefa ou hábito no setup."}
          </small>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-title-row">
          <h2>Resumo</h2>
          <span>{activeModulesCount} módulos ativos</span>
        </div>

        <div className="dashboard-summary-grid">
          <SummaryCard
            title="Água"
            value={modulos.water ? `${metaAgua || 0} ml` : "Off"}
            description={
              modulos.water
                ? `Registro por ${waterMode === "copos" ? "copos" : "ml"}`
                : "desativado"
            }
          />

          <SummaryCard
            title="Tarefas"
            value={modulos.tasks ? "Ativo" : "Off"}
            description={firstTask.trim() || "sem tarefa inicial"}
          />

          <SummaryCard
            title="Hábitos"
            value={modulos.habits ? "Ativo" : "Off"}
            description={firstHabit.trim() || "sem hábito inicial"}
          />

          <SummaryCard
            title="Sono"
            value={modulos.sleep ? "Ativo" : "Off"}
            description="descanso"
          />
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-title-row">
          <h2>Primeiros passos</h2>
          <span>onboarding</span>
        </div>

        <div className="starter-list">
          {modulos.tasks && (
            <article className="starter-card">
              <span>Tarefa inicial</span>
              <strong>{firstTask.trim() || "Nenhuma tarefa criada"}</strong>
              <small>
                {firstTask.trim()
                  ? "Essa tarefa já está pronta para aparecer no painel."
                  : "Volte na configuração inicial para adicionar uma tarefa."}
              </small>
            </article>
          )}

          {modulos.habits && (
            <article className="starter-card">
              <span>Hábito inicial</span>
              <strong>{firstHabit.trim() || "Nenhum hábito criado"}</strong>
              <small>
                {firstHabit.trim()
                  ? "Esse hábito será usado como primeiro acompanhamento."
                  : "Volte na configuração inicial para adicionar um hábito."}
              </small>
            </article>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-title-row">
          <h2>Módulos</h2>
          <span>mobile</span>
        </div>

        <div className="module-status-list">
          <ModuleStatus title="Água" active={modulos.water} />
          <ModuleStatus title="Tarefas" active={modulos.tasks} />
          <ModuleStatus title="Hábitos" active={modulos.habits} />
          <ModuleStatus title="Diário" active={modulos.diary} />
          <ModuleStatus title="Finanças" active={modulos.finances} />
          <ModuleStatus title="Sono" active={modulos.sleep} />
        </div>
      </div>

      <button className="secondary-button" type="button" onClick={onEditSetup}>
        Editar configuração inicial
      </button>
    </section>
  );
}

type ModuleStatusProps = {
  title: string;
  active: boolean;
};

function ModuleStatus({ title, active }: ModuleStatusProps) {
  return (
    <article className={`module-status-card ${active ? "active" : ""}`}>
      <div>
        <strong>{title}</strong>
        <span>{active ? "Disponível no painel" : "Desativado"}</span>
      </div>

      <small>{active ? "Ativo" : "Off"}</small>
    </article>
  );
}