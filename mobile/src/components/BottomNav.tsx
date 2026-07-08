import type { Screen } from "../types/fluir";

type BottomNavProps = {
  currentScreen: Screen;
  onChangeScreen: (screen: Screen) => void;
  onOpenMenu: () => void;
};

export function BottomNav({
  currentScreen,
  onChangeScreen,
  onOpenMenu,
}: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <button
        type="button"
        className={currentScreen === "dashboard" ? "active" : ""}
        onClick={() => onChangeScreen("dashboard")}
      >
        <i>⌘</i>
        Início
      </button>

      <button
        type="button"
        className={currentScreen === "onboarding" ? "active" : ""}
        onClick={() => onChangeScreen("onboarding")}
      >
        <i>✦</i>
        Setup
      </button>

      <button type="button" onClick={onOpenMenu}>
        <i>☷</i>
        Mais
      </button>
    </nav>
  );
}