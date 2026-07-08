type TasksScreenProps = {
  firstTask: string;
  onFirstTaskChange: (value: string) => void;
};

export function TasksScreen({ firstTask, onFirstTaskChange }: TasksScreenProps) {
  return (
    <section className="module-screen">
      <span className="screen-badge">Tarefas</span>

      <h1>Minhas tarefas</h1>
      <p>Organize o que precisa ser feito de forma rápida e simples.</p>

      <div className="module-form-card">
        <label>
          Tarefa rápida
          <input
            value={firstTask}
            onChange={(event) => onFirstTaskChange(event.target.value)}
            placeholder="Ex: terminar atividade do curso"
          />
        </label>

        <button className="primary-button" type="button">
          Salvar tarefa
        </button>
      </div>

      <article className="module-info-card">
        <span>Tarefa atual</span>
        <strong>{firstTask.trim() || "Nenhuma tarefa cadastrada"}</strong>
        <small>
          Depois essa tela poderá ter lista de tarefas, prioridade, prazo e status.
        </small>
      </article>
    </section>
  );
}