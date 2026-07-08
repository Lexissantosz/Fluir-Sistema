import type { LoginResponse, OnboardingData } from "../types/fluir";

const API_BASE_URL = "http://localhost:8080/api";

export async function testBackendConnection(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/usuarios/teste`);

  if (!response.ok) {
    throw new Error("Não foi possível conectar ao backend.");
  }

  return response.text();
}

export async function loginUser(
  email: string,
  senha: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  });

  if (!response.ok) {
    throw new Error("Login inválido ou backend indisponível.");
  }

  return response.json();
}

export async function saveOnboarding(
  data: OnboardingData
): Promise<{ mensagem?: string; onboardingConcluido?: boolean }> {
  const response = await fetch(`${API_BASE_URL}/onboarding/salvar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Não foi possível salvar o onboarding.");
  }

  return response.json();
}