type WaterScreenProps = {
  metaAgua: number;
  waterMode: string;
  onWaterModeChange: (value: string) => void;
};

export function WaterScreen({
  metaAgua,
  waterMode,
  onWaterModeChange,
}: WaterScreenProps) {
  return (
    <section className="module-screen">
      <span className="screen-badge">Água</span>

      <h1>Controle de água</h1>
      <p>Acompanhe sua meta diária e escolha como prefere registrar o consumo.</p>

      <article className="water-main-card">
        <span>Meta diária</span>
        <strong>{metaAgua > 0 ? `${metaAgua} ml` : "Não calculada"}</strong>
        <small>Meta inicial baseada no peso informado.</small>
      </article>

      <div className="module-form-card">
        <label>
          Forma de registro
          <select
            value={waterMode}
            onChange={(event) => onWaterModeChange(event.target.value)}
          >
            <option value="ml">Registrar por ml</option>
            <option value="copos">Registrar por copos</option>
          </select>
        </label>

        <button className="primary-button" type="button">
          Registrar consumo
        </button>
      </div>
    </section>
  );
}