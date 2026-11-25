import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

// Somente chave publicavel. NUNCA colocar service_role no navegador.
export function getSupabase(): SupabaseClient {
  if (instance) return instance;

  const url = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
  const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "").trim();

  if (!/^https:\/\/[^/]+\.supabase\.co\/?$/.test(url) || !key) {
    throw new Error("Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.");
  }

  instance = createClient(url, key, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
  });
  return instance;
}
