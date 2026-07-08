type LoginScreenProps = {
  email: string;
  senha: string;
  carregando: boolean;
  onEmailChange: (value: string) => void;
  onSenhaChange: (value: string) => void;
  onLogin: () => void;
  onDemo: () => void;
};

export function LoginScreen({
  email,
  senha,
  carregando,
  onEmailChange,
  onSenhaChange,
  onLogin,
  onDemo,
}: LoginScreenProps) {
  return (
    <section className="screen-card login-card">
      <span className="screen-badge">Login</span>

      <h1>Seu Fluir no celular</h1>

      <p>
        Entre na sua conta ou crie um acesso para começar a organizar sua rotina
        pelo app mobile.
      </p>

      <label>
        Email
        <input
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          type="email"
          placeholder="Digite seu email"
        />
      </label>

      <label>
        Senha
        <input
          value={senha}
          onChange={(event) => onSenhaChange(event.target.value)}
          type="password"
          placeholder="Digite sua senha"
        />
      </label>

      <button className="primary-button" type="button" onClick={onLogin}>
        {carregando ? "Entrando..." : "Entrar"}
      </button>

      <button className="secondary-button login-secondary" type="button" onClick={onDemo}>
        Criar conta / modo demonstração
      </button>

      <p className="login-note">
        No PC do curso, o backend pode não conectar por causa do Java 11. O modo
        demonstração mantém o fluxo do app funcionando.
      </p>
    </section>
  );
}