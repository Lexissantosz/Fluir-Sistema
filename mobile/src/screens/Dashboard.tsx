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
  return (
    <section className="screen-card dashboard-card">
      <span className="screen-badge">Dashboard</span>

      <div className="dashboard-hero">
        <div>
          <h1>Olá, {nome}</h1>
          <p>
            Seu painel mobile já está preparado para usar a mesma API do sistema
            web.
          </p>
        </div>

        <div className="dashboard-avatar">{nome.charAt(0).toUpperCase()}</div>
      </div>

      <div className="today-card">

        <div className="dashboard-section">
  <div className="section-title-row">
    <h2>Comece por aqui</h2>
    <span>configuração inicial</span>
  </div>

  <div className="starter-list">
    {modulos.tasks && (
      <article className="starter-card">
        <span>Tarefa inicial</span>
        <strong>{firstTask.trim() || "Nenhuma tarefa criada"}</strong>
        <small>
          {firstTask.trim()
            ? "Primeira tarefa cadastrada no onboarding."
            : "Adicione uma tarefa na configuração inicial."}
        </small>
      </article>
    )}

    {modulos.habits && (
      <article className="starter-card">
        <span>Hábito inicial</span>
        <strong>{firstHabit.trim() || "Nenhum hábito criado"}</strong>
        <small>
          {firstHabit.trim()
            ? "Primeiro hábito cadastrado no onboarding."
            : "Adicione um hábito na configuração inicial."}
        </small>
      </article>
    )}
  </div>
</div>

  <span>Resumo de hoje</span>
  <strong>{modulos.water ? `${metaAgua || 0} ml` : "0 ml"}</strong>
  <small>
    {modulos.water
      ? `Meta diária configurada para registro por ${waterMode === "copos" ? "copos" : "ml"}`
      : "Módulo de água desativado"}
  </small>
</div>

      <h2>Módulos ativos</h2>

      <div className="mobile-module-grid">
        <SummaryCard
          title="Tarefas"
          value={modulos.tasks ? "Ativo" : "Off"}
          description="organização diária"
        />

        <SummaryCard
          title="Hábitos"
          value={modulos.habits ? "Ativo" : "Off"}
          description="constância"
        />

        <SummaryCard
          title="Água"
          value={modulos.water ? "Ativo" : "Off"}
          description="hidratação"
        />

        <SummaryCard
          title="Sono"
          value={modulos.sleep ? "Ativo" : "Off"}
          description="descanso"
        />

        <SummaryCard
          title="Finanças"
          value={modulos.finances ? "Ativo" : "Off"}
          description="controle"
        />

        <SummaryCard
          title="Diário"
          value={modulos.diary ? "Ativo" : "Off"}
          description="registros"
        />
      </div>

      <button className="secondary-button" type="button" onClick={onEditSetup}>
        Editar configuração
      </button>
    </section>
  );
}