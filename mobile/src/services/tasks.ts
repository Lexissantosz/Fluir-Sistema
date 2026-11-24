import { getSupabase } from "../infrastructure/supabase";

export type FluirTask = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  completed: boolean;
  task_date: string | null;
  created_at: string;
};

async function authenticatedUserId(): Promise<string> {
  const { data, error } = await getSupabase().auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("É necessário entrar na sua conta.");
  return data.user.id;
}

export async function listTasks(): Promise<FluirTask[]> {
  const id = await authenticatedUserId();
  const { data, error } = await getSupabase().from("fluir_tasks")
    .select("id,user_id,title,description,category,priority,completed,task_date,created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as FluirTask[];
}

export async function createTask(title: string): Promise<FluirTask> {
  const id = await authenticatedUserId();
  const clean = title.trim();
  if (clean.length < 1 || clean.length > 150) {
    throw new Error("O título precisa ter entre 1 e 150 caracteres.");
  }
  const { data, error } = await getSupabase().from("fluir_tasks")
    .insert({ user_id: id, title: clean, source: "manual" })
    .select("id,user_id,title,description,category,priority,completed,task_date,created_at")
    .single();
  if (error) throw error;
  return data as FluirTask;
}

export async function setTaskComplete(taskId: string, completed: boolean): Promise<void> {
  const id = await authenticatedUserId();
  const { data, error } = await getSupabase().from("fluir_tasks")
    .update({ completed, updated_at: new Date().toISOString() })
    .eq("id", taskId).eq("user_id", id)
    .select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Tarefa não encontrada ou acesso negado.");
}

export async function deleteTask(taskId: string): Promise<void> {
  const id = await authenticatedUserId();
  const { data, error } = await getSupabase().from("fluir_tasks")
    .delete().eq("id", taskId).eq("user_id", id)
    .select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Tarefa não encontrada ou acesso negado.");
}
