import Icon from "./Icon";
export default function ThemeToggle({ theme, onToggle }) {
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-label={theme === "dark" ? "Aktifkan light mode" : "Aktifkan dark mode"} aria-pressed={theme === "dark"} title="Ganti suasana langit"><span className="theme-toggle-track"><span className="theme-toggle-thumb"><Icon name={theme === "dark" ? "moon" : "sun"} size={15} /></span><Icon name="sun" size={13} /><Icon name="moon" size={13} /></span><span className="theme-toggle-label">{theme === "dark" ? "Night" : "Day"}</span></button>;
}
