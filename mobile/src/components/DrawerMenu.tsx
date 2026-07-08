import type { Screen } from "../types/fluir";

type DrawerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onChangeScreen: (screen: Screen) => void;
};

const drawerItems: { label: string; screen: Screen }[] = [
  { label: "Início", screen: "dashboard" },
  { label: "Tarefas", screen: "tasks" },
  { label: "Hábitos", screen: "habits" },
  { label: "Água", screen: "water" },
  { label: "Configurações", screen: "settings" },
];

export function DrawerMenu({
  isOpen,
  onClose,
  onChangeScreen,
}: DrawerMenuProps) {
  function handleNavigate(screen: Screen) {
    onChangeScreen(screen);
    onClose();
  }

  return (
    <div className={`drawer-overlay ${isOpen ? "show" : ""}`} onClick={onClose}>
      <aside className="drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <strong>Menu</strong>
            <span>Áreas do Fluir Mobile</span>
          </div>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="drawer-list">
          {drawerItems.map((item) => (
            <button
              type="button"
              key={item.screen}
              onClick={() => handleNavigate(item.screen)}
            >
              <span>◇</span>
              {item.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}