import { useState } from "react";
import type { Modules } from "../types/fluir";

type OnboardingScreenProps = {
  nome: string;
  pronomes: string;
  altura: string;
  peso: string;
  metaAgua: number;
  modulos: Modules;
  carregando: boolean;
  firstTask: string;
firstHabit: string;
waterMode: string;
  onNomeChange: (value: string) => void;
  onPronomesChange: (value: string) => void;
  onAlturaChange: (value: string) => void;
  onPesoChange: (value: string) => void;
  onToggleModule: (moduleName: keyof Modules) => void;
  onSave: () => void;
  onFirstTaskChange: (value: string) => void;
onFirstHabitChange: (value: string) => void;
onWaterModeChange: (value: string) => void;
};

type Step = 1 | 2 | 3;

export function OnboardingScreen({
  nome,
  pronomes,
  altura,
  peso,
  metaAgua,
  modulos,
  carregando,
  firstTask,
  firstHabit,
  waterMode,
  onNomeChange,
  onPronomesChange,
  onAlturaChange,
  onPesoChange,
  onFirstTaskChange,
  onFirstHabitChange,
  onWaterModeChange,
  onToggleModule,
  onSave,
}: OnboardingScreenProps) {
  const [step, setStep] = useState<Step>(1);

  function goNext() {
    if (step === 1 && !nome.trim()) {
      alert("Digite seu nome antes de continuar.");
      return;
    }

    if (step < 3) {
      setStep((currentStep) => (currentStep + 1) as Step);
    }
  }

  function goBack() {
    if (step > 1) {
      setStep((currentStep) => (currentStep - 1) as Step);
    }
  }

  return (
    <section className="screen-card onboarding-card">
      <div className="onboarding-top">
        <span className="screen-badge">Onboarding</span>
        <span className="step-pill">Etapa {step} de 3</span>
      </div>

      <div className="step-indicator">
        <StepDot active={step === 1} done={step > 1} number="1" label="Dados" />
        <div className="step-line" />
        <StepDot active={step === 2} done={step > 2} number="2" label="Módulos" />
        <div className="step-line" />
        <StepDot active={step === 3} done={false} number="3" label="Ajustes" />
      </div>

      {step === 1 && (
        <>
          <h1>Vamos conhecer você</h1>

          <p>
            Essas informações ajudam o Fluir a personalizar sua experiência no app.
          </p>

          <label>
            Nome ou apelido
            <input
              value={nome}
              onChange={(event) => onNomeChange(event.target.value)}
              placeholder="Como quer ser chamado?"
            />
          </label>

          <label>
            Pronomes
            <select
              value={pronomes}
              onChange={(event) => onPronomesChange(event.target.value)}
            >
              <option value="">Selecione uma opção</option>
              <option value="ele/dele">ele/dele</option>
              <option value="ela/dela">ela/dela</option>
              <option value="elu/delu">elu/delu</option>
              <option value="prefiro-nao-dizer">Prefiro não dizer</option>
            </select>
          </label>

          <div className="form-row">
            <label>
              Altura
              <input
                value={altura}
                onChange={(event) => onAlturaChange(event.target.value)}
                type="number"
                placeholder="cm"
              />
            </label>

            <label>
              Peso
              <input
                value={peso}
                onChange={(event) => onPesoChange(event.target.value)}
                type="number"
                placeholder="kg"
              />
            </label>
          </div>

          {metaAgua > 0 && (
            <div className="water-preview">
              <small>Meta sugerida de água</small>
              <strong>{metaAgua} ml por dia</strong>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <h1>Escolha seus módulos</h1>

          <p>
            Ative apenas as áreas que fazem sentido agora. Depois você poderá
            mudar isso nas configurações.
          </p>

          <div className="fixed-modules-mobile">
            <strong>Sempre disponíveis</strong>
            <span>
              Dashboard, Timeline, Anexos, Conquistas, Configurações, Perfil e
              Planos.
            </span>
          </div>

          <div className="module-list">
            <ModuleButton
              title="Tarefas"
              description="Organize atividades por tempo, energia e prioridade."
              active={modulos.tasks}
              onClick={() => onToggleModule("tasks")}
            />

            <ModuleButton
              title="Diário"
              description="Registre pensamentos, humor e acontecimentos."
              active={modulos.diary}
              onClick={() => onToggleModule("diary")}
            />

            <ModuleButton
              title="Água"
              description="Acompanhe sua meta diária de hidratação."
              active={modulos.water}
              onClick={() => onToggleModule("water")}
            />

            <ModuleButton
              title="Hábitos"
              description="Crie hábitos e acompanhe sua constância."
              active={modulos.habits}
              onClick={() => onToggleModule("habits")}
            />

            <ModuleButton
              title="Nutrição"
              description="Planeje metas de alimentação e calorias."
              active={modulos.nutrition}
              onClick={() => onToggleModule("nutrition")}
            />

            <ModuleButton
              title="Treinos"
              description="Monte treinos, séries e descansos."
              active={modulos.physicalHealth}
              onClick={() => onToggleModule("physicalHealth")}
            />

            <ModuleButton
              title="Ciclo menstrual"
              description="Acompanhe ciclo, sintomas e estimativas."
              active={modulos.menstrualCycle}
              onClick={() => onToggleModule("menstrualCycle")}
            />

            <ModuleButton
              title="Sono"
              description="Registre horários, duração e qualidade do sono."
              active={modulos.sleep}
              onClick={() => onToggleModule("sleep")}
            />

            <ModuleButton
              title="Finanças"
              description="Controle gastos, ganhos e metas financeiras."
              active={modulos.finances}
              onClick={() => onToggleModule("finances")}
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1>Ajustes iniciais</h1>

          <p>
            Configure rapidamente os módulos escolhidos. Depois você poderá editar
            tudo com mais calma.
          </p>

          {modulos.water && (
  <div className="module-config-mobile">
    <strong>Água</strong>
    <span>Meta calculada com base no peso informado.</span>

    <p>
      {metaAgua > 0
        ? `${metaAgua} ml por dia`
        : "Informe o peso para calcular a meta."}
    </p>

    <label className="compact-field">
      Modo de registro
      <select
        value={waterMode}
        onChange={(event) => onWaterModeChange(event.target.value)}
      >
        <option value="ml">Registrar por ml</option>
        <option value="copos">Registrar por copos</option>
      </select>
    </label>
  </div>
)}

          {modulos.tasks && (
  <div className="module-config-mobile">
    <strong>Tarefas</strong>
    <span>Crie uma primeira tarefa para começar o painel.</span>

    <label className="compact-field">
      Primeira tarefa
      <input
        value={firstTask}
        onChange={(event) => onFirstTaskChange(event.target.value)}
        placeholder="Ex: Revisar atividade"
      />
    </label>
  </div>
)}

          {modulos.habits && (
  <div className="module-config-mobile">
    <strong>Hábitos</strong>
    <span>Crie um primeiro hábito para acompanhar sua constância.</span>

    <label className="compact-field">
      Primeiro hábito
      <input
        value={firstHabit}
        onChange={(event) => onFirstHabitChange(event.target.value)}
        placeholder="Ex: Beber água ao acordar"
      />
    </label>
  </div>
)}

          {modulos.sleep && (
            <div className="module-config-mobile">
              <strong>Sono</strong>
              <span>Área preparada para registrar horários e qualidade do sono.</span>
              <p>Será integrada ao histórico do usuário futuramente.</p>
            </div>
          )}

          {modulos.finances && (
            <div className="module-config-mobile">
              <strong>Finanças</strong>
              <span>Área preparada para controle financeiro pessoal.</span>
              <p>Ganhos, gastos e metas poderão ser salvos no backend.</p>
            </div>
          )}

          {modulos.diary && (
            <div className="module-config-mobile">
              <strong>Diário</strong>
              <span>Área preparada para registros emocionais e acontecimentos.</span>
              <p>O histórico será salvo futuramente no banco de dados.</p>
            </div>
          )}

          {!Object.values(modulos).some(Boolean) && (
            <div className="module-config-mobile">
              <strong>Nenhum módulo opcional escolhido</strong>
              <span>Você ainda terá acesso aos módulos fixos do Fluir.</span>
              <p>É possível ativar módulos depois nas configurações.</p>
            </div>
          )}
        </>
      )}

      <div className="onboarding-actions-mobile">
        {step > 1 && (
          <button className="secondary-button" type="button" onClick={goBack}>
            Voltar
          </button>
        )}

        {step < 3 && (
          <button className="primary-button" type="button" onClick={goNext}>
            Continuar
          </button>
        )}

        {step === 3 && (
          <button className="primary-button" type="button" onClick={onSave}>
            {carregando ? "Salvando..." : "Salvar e começar"}
          </button>
        )}
      </div>
    </section>
  );
}

type StepDotProps = {
  active: boolean;
  done: boolean;
  number: string;
  label: string;
};

function StepDot({ active, done, number, label }: StepDotProps) {
  return (
    <div className={`step-dot ${active ? "active" : ""} ${done ? "done" : ""}`}>
      <span>{done ? "✓" : number}</span>
      <small>{label}</small>
    </div>
  );
}

type ModuleButtonProps = {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
};

function ModuleButton({ title, description, active, onClick }: ModuleButtonProps) {
  return (
    <button
      type="button"
      className={`module-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div>
        <span>{title}</span>
        <p>{description}</p>
      </div>

      <strong>{active ? "Ativo" : "Inativo"}</strong>
    </button>
  );
}