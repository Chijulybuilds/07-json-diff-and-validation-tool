import { Moon, Sun } from "lucide-react";
export default function ThemeToggle({ theme, onToggle }: { theme: "dark" | "light"; onToggle: () => void }) {
  return <button className="icon-button" onClick={onToggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Toggle theme">
    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
  </button>;
}