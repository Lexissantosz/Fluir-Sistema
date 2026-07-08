type HabitsScreenProps = {
  firstHabit: string;
  onFirstHabitChange: (value: string) => void;
};

export function HabitsScreen({ firstHabit, onFirstHabitChange }: HabitsScreenProps) {
  return (
    <section className="module-screen">
      <span className="screen-badge">Hábitos</span>

      <h1>Meus hábitos</h1>
      <p>Crie hábitos e acompanhe sua constância aos poucos.</p>

      <div className="module-form-card">
        <label>
          Hábito principal
          <input
            value={firstHabit}
            onChange={(event) => onFirstHabitChange(event.target.value)}
            placeholder="Ex: beber água ao acordar"
          />
        </label>

        <button className="primary-button" type="button">
          Salvar hábito
        </button>
      </div>

      <article className="module-info-card">
        <span>Hábito atual</span>
        <strong>{firstHabit.trim() || "Nenhum hábito cadastrado"}</strong>
        <small>
          Depois essa tela poderá ter frequência semanal, melhor horário e histórico.
        </small>
      </article>
    </section>
  );
}