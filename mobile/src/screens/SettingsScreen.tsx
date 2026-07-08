import type { Modules } from "../types/fluir";

type SettingsScreenProps = {
  nome: string;
  peso: string;
  altura: string;
  modulos: Modules;
  onNomeChange: (value: string) => void;
  onPesoChange: (value: string) => void;
  onAlturaChange: (value: string) => void;
  onToggleModule: (moduleName: keyof Modules) => void;
};

export function SettingsScreen({
  nome,
  peso,
  altura,
  modulos,
  onNomeChange,
  onPesoChange,
  onAlturaChange,
  onToggleModule,
}: SettingsScreenProps) {
  return (
    <section className="module-screen">
      <span className="screen-badge">Configurações</span>

      <h1>Ajustes rápidos</h1>
      <p>Altere dados principais sem precisar refazer o onboarding.</p>

      <div className="module-form-card">
        <label>
          Nome ou apelido
          <input
            value={nome}
            onChange={(event) => onNomeChange(event.target.value)}
            placeholder="Seu nome"
          />
        </label>

        <div className="form-grid">
          <label>
            Altura
            <input
              value={altura}
              onChange={(event) => onAlturaChange(event.target.value)}
              placeholder="cm"
            />
          </label>

          <label>
            Peso
            <input
              value={peso}
              onChange={(event) => onPesoChange(event.target.value)}
              placeholder="kg"
            />
          </label>
        </div>
      </div>

      <div className="module-form-card">
        <strong className="settings-mini-title">Módulos principais</strong>

        <div className="settings-module-list">
          <button
            type="button"
            className={modulos.tasks ? "active" : ""}
            onClick={() => onToggleModule("tasks")}
          >
            Tarefas
          </button>

          <button
            type="button"
            className={modulos.habits ? "active" : ""}
            onClick={() => onToggleModule("habits")}
          >
            Hábitos
          </button>

          <button
            type="button"
            className={modulos.water ? "active" : ""}
            onClick={() => onToggleModule("water")}
          >
            Água
          </button>

          <button
            type="button"
            className={modulos.diary ? "active" : ""}
            onClick={() => onToggleModule("diary")}
          >
            Diário
          </button>
        </div>
      </div>
    </section>
  );
}