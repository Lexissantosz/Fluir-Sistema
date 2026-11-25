type LoginScreenProps = {
  email: string;
  senha: string;
  nome: string;
  carregando: boolean;
  aviso: string;
  passwordRecovery: boolean;
  onEmailChange: (value: string) => void;
  onSenhaChange: (value: string) => void;
  onNomeChange: (value: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  onRecover: () => void;
  onUpdatePassword: () => void;
  onDemo: () => void;
};

export function LoginScreen({
  email, senha, nome, carregando, aviso, passwordRecovery,
  onEmailChange, onSenhaChange, onNomeChange,
  onLogin, onRegister, onRecover, onUpdatePassword, onDemo,
}: LoginScreenProps) {
  return (
    <section className="screen-card login-card">
      <span className="screen-badge">{passwordRecovery ? "Recuperação" : "Sua conta"}</span>
      <h1>{passwordRecovery ? "Defina sua nova senha" : "Seu Fluir no celular"}</h1>
      <p>
        {passwordRecovery
          ? "Informe uma nova senha para acessar sua conta com segurança."
          : "Entre, crie uma conta ou explore a demonstração sem salvar dados."}
      </p>

      {!passwordRecovery && (
        <label>
          E-mail
          <input
            value={email} onChange={event => onEmailChange(event.target.value)}
            type="email" autoComplete="email" placeholder="Digite seu e-mail"
            disabled={carregando}
          />
        </label>
      )}

      <label>
        {passwordRecovery ? "Nova senha" : "Senha"}
        <input
          value={senha} onChange={event => onSenhaChange(event.target.value)}
          type="password" autoComplete={passwordRecovery ? "new-password" : "current-password"}
          placeholder={passwordRecovery ? "Mínimo de 8 caracteres" : "Digite sua senha"}
          disabled={carregando}
        />
      </label>

      {passwordRecovery ? (
        <button className="primary-button" type="button" onClick={onUpdatePassword} disabled={carregando}>
          {carregando ? "Atualizando..." : "Salvar nova senha"}
        </button>
      ) : (
        <>
          <button className="primary-button" type="button" onClick={onLogin} disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
          <label>
            Nome (para criar sua conta)
            <input
              value={nome} onChange={event => onNomeChange(event.target.value)}
              autoComplete="name" placeholder="Seu nome" disabled={carregando}
            />
          </label>
          <button className="secondary-button login-secondary" type="button"
            onClick={onRegister} disabled={carregando}>
            Criar conta
          </button>
          <button className="secondary-button login-secondary" type="button"
            onClick={onRecover} disabled={carregando}>
            Esqueci minha senha
          </button>
          <button className="secondary-button login-secondary" type="button"
            onClick={onDemo} disabled={carregando}>
            Explorar demonstração
          </button>
          <p className="login-note">
            Demonstração não é conta real e não grava nem sincroniza seus registros.
            Contas antigas do Fluir ainda precisam passar por migração de identidade.
          </p>
        </>
      )}

      {aviso && <p className="login-note" role="status">{aviso}</p>}
    </section>
  );
}
