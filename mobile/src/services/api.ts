import type { LoginResponse, OnboardingData } from "../types/fluir";
import { getSupabase } from "../infrastructure/supabase";

export async function testBackendConnection(): Promise<string> {
  const { error } = await getSupabase().from("fluir_profiles").select("user_id").limit(1);
  if (error) throw error;
  return "Supabase conectado";
}

export async function getCurrentUser(): Promise<LoginResponse | null> {
  const client = getSupabase();
  const { data: identity, error: authError } = await client.auth.getUser();
  if (authError) throw authError;
  if (!identity.user) return null;

  const { data: profile, error: profileError } = await client
    .from("fluir_profiles")
    .select("display_name")
    .eq("user_id", identity.user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  return {
    id: identity.user.id,
    nome: (profile?.display_name as string | undefined) ||
      identity.user.email?.split("@")[0] || "Pessoa",
    email: identity.user.email || "",
  };
}

export async function loginUser(email: string, senha: string): Promise<LoginResponse> {
  const client = getSupabase();
  const { error } = await client.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: senha,
  });
  if (error) throw error;
  const user = await getCurrentUser();
  if (!user) throw new Error("Não foi possível verificar sua conta.");
  return user;
}

export async function registerUser(email: string, senha: string, nome: string):
  Promise<{ confirmationRequired: boolean }> {
  if (nome.trim().length < 2 || senha.length < 8) {
    throw new Error("Informe seu nome e uma senha de pelo menos 8 caracteres.");
  }
  const { data, error } = await getSupabase().auth.signUp({
    email: email.trim().toLowerCase(),
    password: senha,
    options: { data: { name: nome.trim() }, emailRedirectTo: window.location.origin },
  });
  if (error) throw error;
  return { confirmationRequired: !data.session };
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await getSupabase().auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: window.location.origin }
  );
  if (error) throw error;
}

export async function updatePassword(newPassword: string): Promise<void> {
  if (newPassword.length < 8) throw new Error("A senha precisa ter pelo menos 8 caracteres.");
  const { error } = await getSupabase().auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function getOnboarding(): Promise<{ completed: boolean; payload: OnboardingData | null }> {
  const client = getSupabase();
  const { data: identity, error: authError } = await client.auth.getUser();
  if (authError || !identity.user) throw authError || new Error("Sessão inválida.");
  const { data, error } = await client.from("fluir_onboarding")
    .select("completed,payload").eq("user_id", identity.user.id).maybeSingle();
  if (error) throw error;
  return {
    completed: data?.completed === true,
    payload: data?.payload ? data.payload as OnboardingData : null,
  };
}

export async function saveOnboarding(data: OnboardingData):
  Promise<{ mensagem: string; onboardingConcluido: boolean }> {
  const client = getSupabase();
  const { data: identity, error: authError } = await client.auth.getUser();
  if (authError || !identity.user) throw authError || new Error("Sessão inválida.");
  if (identity.user.id !== data.usuarioId) throw new Error("Os dados não pertencem à sessão.");
  // O RPC verifica auth.uid() e salva onboarding+tarefa+hábito em transação.
  const { error } = await client.rpc("fluir_complete_onboarding", { p_payload: data });
  if (error) throw error;
  const { error: profileError } = await client.from("fluir_profiles")
    .update({ display_name: data.nome.trim() })
    .eq("user_id", identity.user.id);
  if (profileError) throw profileError;
  return { mensagem: "Configuração salva.", onboardingConcluido: true };
}
