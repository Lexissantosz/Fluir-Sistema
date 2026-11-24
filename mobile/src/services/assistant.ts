import { getSupabase } from "../infrastructure/supabase";

export async function askFluirAssistant(message: string, consent: boolean): Promise<string> {
  const text = message.trim();
  if (!consent || text.length < 1 || text.length > 1200) {
    throw new Error("Confirme o consentimento e escreva até 1200 caracteres.");
  }
  const { data: session, error: authError } = await getSupabase().auth.getUser();
  if (authError) throw authError;
  if (!session.user) throw new Error("Entre na sua conta para usar a IA.");

  const { data, error } = await getSupabase().functions.invoke("fluir-assistant-chat", {
    body: { mensagem: text, consentimento: true },
  });
  if (error) {
    throw new Error("A IA está indisponível ou a função ainda não foi configurada.");
  }
  if (typeof data?.resposta !== "string" || !data.resposta.trim()) {
    throw new Error(data?.mensagem || "O assistente não retornou uma resposta válida.");
  }
  return data.resposta.trim();
}
