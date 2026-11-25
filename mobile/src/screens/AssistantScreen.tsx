import { useState } from "react";
import { askFluirAssistant } from "../services/assistant";

type AssistantScreenProps = { isDemo: boolean };

export function AssistantScreen({ isDemo }: AssistantScreenProps) {
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");

  async function send() {
    if (isDemo) {
      setNotice("A demonstração não se conecta à IA real.");
      return;
    }
    setBusy(true);
    setNotice("");
    setAnswer("");
    try {
      setAnswer(await askFluirAssistant(message, consent));
      setMessage("");
      setConsent(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível obter uma resposta.");
    } finally { setBusy(false); }
  }

  return (
    <section className="module-screen">
      <span className="screen-badge">Assistente IA</span>
      <h1>Fluir Assistente</h1>
      <p>Peça ajuda para planejar sua rotina. A IA não altera seus registros.</p>
      {isDemo && <p className="login-note">Demonstração: não há chamadas à IA nem acesso aos seus dados.</p>}
      <div className="module-form-card">
        <label>
          Sua mensagem
          <textarea value={message} rows={4} maxLength={1200} disabled={isDemo || busy}
            onChange={event => setMessage(event.target.value)}
            placeholder="Como organizar minhas tarefas hoje?" />
        </label>
        <label>
          <input type="checkbox" checked={consent} disabled={isDemo || busy}
            onChange={event => setConsent(event.target.checked)} />
          Concordo em enviar esta mensagem ao provedor de IA para gerar uma resposta.
        </label>
        <button className="primary-button" type="button" disabled={isDemo || busy || !consent || !message.trim()}
          onClick={() => void send()}>
          {busy ? "Respondendo..." : "Enviar"}
        </button>
      </div>
      {answer && <article className="module-info-card"><strong>Resposta</strong><p>{answer}</p></article>}
      {notice && <p role="status" className="login-note">{notice}</p>}
    </section>
  );
}
