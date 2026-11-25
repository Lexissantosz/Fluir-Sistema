export type Screen =
  | "login"
  | "register"
  | "onboarding"
  | "dashboard"
  | "tasks"
  | "habits"
  | "water"
  | "assistant"
  | "settings";
  
export type User = {
  id: string;
  nome: string;
  email: string;
};

export type Modules = {
  tasks: boolean;
  habits: boolean;
  water: boolean;
  sleep: boolean;
  finances: boolean;
  diary: boolean;
  nutrition: boolean;
  physicalHealth: boolean;
  menstrualCycle: boolean;
};

export type OnboardingData = {
  usuarioId: string;
  nome: string;
  apelido: string;
  pronomes: string;
  generoNascimento: string;
  altura: number;
  peso: number;
  energiaAtual: string;
  modulos: {
    timeline: boolean;
    tasks: boolean;
    habits: boolean;
    sleep: boolean;
    water: boolean;
    finances: boolean;
    diary: boolean;
    nutrition: boolean;
    physicalHealth: boolean;
    menstrualCycle: boolean;
    attachments: boolean;
  };
  agua: {
    metaCalculadaMl: number;
    metaFinalMl: number;
    modoRegistro: string;
  };
  primeiraTarefa: {
  titulo: string;
  tempoEstimadoMinutos: number;
  energiaGasta: string;
} | null;

primeiroHabito: {
  titulo: string;
  frequenciaSemanal: number;
  melhorHorario: string;
} | null;
};

export type LoginResponse = {
  id: string;
  nome: string;
  email: string;
  mensagem?: string;
};