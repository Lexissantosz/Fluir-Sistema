// Supabase Edge Function | Fluir IA
// Implantar somente após validar RLS, segredos e rate limit em staging.
// Nenhuma service_role key é necessária para respostas de texto.
import { createClient } from "npm:@supabase/supabase-js@2.119.0";

type ChatRequest = { mensagem?: unknown; consentimento?: unknown };

const LIMIT = 1200;
const PROVIDER_TIMEOUT_MS = 12000;
const VALID_TONES = new Set(["calmo", "direto", "motivador", "neutro"]);

function responseJson(body: Record<string, unknown>, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
      "Cache-Control": "no-store",
    },
  });
}

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin") ?? "";
  const allowlist = (Deno.env.get("FLUIR_ALLOWED_ORIGINS") ?? "")
    .split(",").map(value => value.trim()).filter(Boolean);

  // CORS é defesa adicional; a autorização real depende do JWT e do RLS.
  if (!origin || !allowlist.includes(origin)) {
    return new Response(null, { status: 403, headers: { "Vary": "Origin" } });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Max-Age": "3600",
        "Vary": "Origin",
      },
    });
  }

  if (request.method !== "POST") {
    return responseJson({ mensagem: "Método não permitido." }, 405, origin);
  }

  if (!request.headers.get("Content-Type")?.toLowerCase().includes("application/json")) {
    return responseJson({ mensagem: "É necessário enviar JSON." }, 415, origin);
  }

  const authHeader = request.headers.get("Authorization") ?? "";
  const jwt = /^Bearer\s+(.+)$/i.exec(authHeader)?.[1] ?? "";
  if (!jwt) {
    return responseJson({ mensagem: "Autenticação necessária." }, 401, origin);
  }

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const publishable = Deno.env.get("SUPABASE_ANON_KEY") ??
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
  if (!url || !publishable) {
    return responseJson({ mensagem: "Serviço temporariamente indisponível." }, 503, origin);
  }

  const supabase = createClient(url, publishable, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !userData.user) {
    return responseJson({ mensagem: "Sessão inválida." }, 401, origin);
  }

  let input: ChatRequest;
  try {
    const raw = await request.text();
    if (raw.length > 4096) return responseJson({ mensagem: "Mensagem muito grande." }, 413, origin);
    input = JSON.parse(raw) as ChatRequest;
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new Error("Formato inválido");
    }
  } catch {
    return responseJson({ mensagem: "JSON inválido." }, 400, origin);
  }

  const mensagem = typeof input.mensagem === "string" ? input.mensagem.trim() : "";
  if (input.consentimento !== true || !mensagem || mensagem.length > LIMIT) {
    return responseJson({
      mensagem: "Confirme o consentimento e envie até 1200 caracteres.",
    }, 400, origin);
  }

  // Toda chamada é limitada atomicamente POR USUÁRIO, mesmo sob concorrência.
  const { data: reserved, error: reserveError } = await supabase.rpc("fluir_ai_reserve_call");
  if (reserveError) {
    return responseJson({ mensagem: "Não foi possível verificar seu limite de uso." }, 503, origin);
  }
  if (reserved !== true) {
    return responseJson({ mensagem: "Limite temporário de mensagens atingido." }, 429, origin);
  }

  const { data: profile, error: profileError } = await supabase
    .from("fluir_profiles")
    .select("communication_tone")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (profileError) {
    return responseJson({ mensagem: "Não foi possível carregar as preferências." }, 503, origin);
  }

  const tone = typeof profile?.communication_tone === "string" &&
      VALID_TONES.has(profile.communication_tone)
    ? profile.communication_tone : "calmo";
  const geminiKey = Deno.env.get("FLUIR_GEMINI_API_KEY") ?? "";
  const model = Deno.env.get("FLUIR_AI_MODEL") || "gemini-2.5-flash";
  if (!geminiKey || !/^[a-zA-Z0-9._-]{2,90}$/.test(model)) {
    return responseJson({ mensagem: "IA não configurada neste ambiente." }, 503, origin);
  }

  const instruction = [
    "Você é o assistente Fluir, em português brasileiro.",
    "Tom de comunicação preferido: " + tone + ".",
    "Seja claro, conciso e respeitoso. Responda em até 900 caracteres.",
    "Você não pode alterar dados do aplicativo. Nunca afirme que salvou, excluiu,",
    "agendou ou consultou registros de contas. Oriente a confirmação na interface.",
    "Não infira ou envie dados médicos, financeiros ou do diário do usuário.",
    "Não dê diagnóstico médico e não invente informações pessoais.",
  ].join(" ");

  try {
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(model) + ":generateContent";
    const provider = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instruction }] },
        contents: [{ role: "user", parts: [{ text: mensagem }] }],
        generationConfig: { temperature: 0.45, maxOutputTokens: 440 },
      }),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
    if (!provider.ok) {
      return responseJson({
        mensagem: provider.status === 429 ? "IA temporariamente ocupada." : "IA indisponível nesta tentativa.",
      }, provider.status === 429 ? 429 : 503, origin);
    }

    const result = await provider.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string" || !text.trim()) {
      return responseJson({ mensagem: "A IA não retornou uma resposta válida." }, 503, origin);
    }
    return responseJson({ resposta: text.trim().slice(0, 2500), geradoPorIA: true }, 200, origin);
  } catch {
    return responseJson({ mensagem: "A IA demorou ou a conexão falhou." }, 503, origin);
  }
});
