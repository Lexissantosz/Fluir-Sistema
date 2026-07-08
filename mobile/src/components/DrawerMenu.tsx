type DrawerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const drawerItems = [
  "Dashboard",
  "Timeline",
  "Tarefas",
  "Hábitos",
  "Água",
  "Sono",
  "Finanças",
  "Diário",
  "Configurações",
  "Perfil",
];

export function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
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
            <button type="button" key={item} onClick={onClose}>
              <span>◇</span>
              {item}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}