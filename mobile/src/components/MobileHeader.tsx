import type { User } from "../types/fluir";

type MobileHeaderProps = {
  user: User;
  onOpenMenu: () => void;
};

export function MobileHeader({ user, onOpenMenu }: MobileHeaderProps) {
  const initial = user.nome.trim().charAt(0).toUpperCase() || "F";

  return (
    <header className="mobile-header">
      <div className="mobile-user">
        <div className="mobile-avatar">{initial}</div>

        <div>
          <strong>{user.nome || "Usuário"}</strong>
          <span>{user.email || "Perfil do usuário"}</span>
        </div>
      </div>

      <button
        className="menu-button"
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir menu"
      >
        ☰
      </button>
    </header>
  );
}