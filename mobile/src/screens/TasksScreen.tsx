import { useEffect, useState } from "react";
import {
  createTask, deleteTask, listTasks, setTaskComplete,
  type FluirTask,
} from "../services/tasks";

type TasksScreenProps = {
  firstTask: string;
  onFirstTaskChange: (value: string) => void;
  isDemo: boolean;
};

export function TasksScreen({ firstTask, onFirstTaskChange, isDemo }: TasksScreenProps) {
  const [tasks, setTasks] = useState<FluirTask[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(isDemo ? "Demonstração: nenhuma tarefa é salva." : "");

  useEffect(() => {
    if (isDemo) return;
    let active = true;
    void listTasks().then(rows => {
      if (active) setTasks(rows);
    }).catch(error => {
      if (active) setNotice(error instanceof Error ? error.message : "Erro ao carregar tarefas.");
    });
    return () => { active = false; };
  }, [isDemo]);

  async function save() {
    if (isDemo) { setNotice("A demonstração não salva registros. Entre em uma conta."); return; }
    setBusy(true);
    try {
      const task = await createTask(firstTask);
      setTasks(rows => [task, ...rows]);
      onFirstTaskChange("");
      setNotice("Tarefa salva no Supabase.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível criar a tarefa.");
    } finally { setBusy(false); }
  }

  async function toggle(task: FluirTask) {
    if (isDemo) return;
    setBusy(true);
    try {
      await setTaskComplete(task.id, !task.completed);
      setTasks(rows => rows.map(row =>
        row.id === task.id ? { ...row, completed: !task.completed } : row));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível alterar a tarefa.");
    } finally { setBusy(false); }
  }

  async function remove(task: FluirTask) {
    if (isDemo) return;
    setBusy(true);
    try {
      await deleteTask(task.id);
      setTasks(rows => rows.filter(row => row.id !== task.id));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível excluir a tarefa.");
    } finally { setBusy(false); }
  }

  return (
    <section className="module-screen">
      <span className="screen-badge">Tarefas</span>
      <h1>Minhas tarefas</h1>
      <p>Organize o que precisa ser feito de forma rápida e simples.</p>
      {notice && <p className="login-note" role="status">{notice}</p>}
      <div className="module-form-card">
        <label>
          Nova tarefa
          <input
            value={firstTask}
            onChange={event => onFirstTaskChange(event.target.value)}
            maxLength={150}
            placeholder="Ex: terminar atividade do curso"
            disabled={busy || isDemo}
          />
        </label>
        <button className="primary-button" type="button" onClick={() => void save()}
          disabled={busy || isDemo || !firstTask.trim()}>
          {busy ? "Salvando..." : "Salvar tarefa"}
        </button>
      </div>
      <article className="module-info-card">
        <span>Tarefas sincronizadas</span>
        {tasks.length === 0
          ? <strong>{isDemo ? "Modo de demonstração" : "Nenhuma tarefa cadastrada"}</strong>
          : <ul>
              {tasks.map(task => (
                <li key={task.id}>
                  <label>
                    <input type="checkbox" checked={task.completed}
                      onChange={() => void toggle(task)} disabled={busy} />
                    <span>{task.title}</span>
                  </label>
                  <button type="button" onClick={() => void remove(task)} disabled={busy}>
                    Excluir
                  </button>
                </li>
              ))}
            </ul>}
      </article>
    </section>
  );
}
