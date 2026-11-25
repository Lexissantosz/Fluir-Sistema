import { getSupabase } from "../infrastructure/supabase";

export type PrivateBucket = "fluir-avatars" | "fluir-attachments";

const allowed: Record<PrivateBucket, { maxBytes: number; mimes: string[] }> = {
  "fluir-avatars": { maxBytes: 2 * 1024 * 1024, mimes: ["image/jpeg", "image/png", "image/webp"] },
  "fluir-attachments": {
    maxBytes: 10 * 1024 * 1024,
    mimes: ["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain"]
  },
};

async function owner(): Promise<string> {
  const { data, error } = await getSupabase().auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("É necessário autenticar para acessar arquivos.");
  return data.user.id;
}

const extensions: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "application/pdf": "pdf", "text/plain": "txt"
};

export async function uploadPrivateFile(bucket: PrivateBucket, file: File):
  Promise<{ path: string }> {
  const userId = await owner();
  const rules = allowed[bucket];
  if (!rules.mimes.includes(file.type) || file.size > rules.maxBytes || file.size === 0) {
    throw new Error("Formato ou tamanho de arquivo não permitido.");
  }
  const path = `${userId}/${crypto.randomUUID()}.${extensions[file.type]}`;
  const { data, error } = await getSupabase().storage.from(bucket)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return { path: data.path };
}

export async function getPrivateFileUrl(bucket: PrivateBucket, path: string):
  Promise<string> {
  const userId = await owner();
  if (!path.startsWith(`${userId}/`) || path.includes("..")) {
    throw new Error("Acesso ao arquivo não permitido.");
  }
  const { data, error } = await getSupabase().storage.from(bucket)
    .createSignedUrl(path, 300);
  if (error) throw error;
  return data.signedUrl;
}

export async function removePrivateFile(bucket: PrivateBucket, path: string):
  Promise<void> {
  const userId = await owner();
  if (!path.startsWith(`${userId}/`) || path.includes("..")) {
    throw new Error("Acesso ao arquivo não permitido.");
  }
  const { error } = await getSupabase().storage.from(bucket).remove([path]);
  if (error) throw error;
}
