"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const theme_key = "theme";
const theme_change_event = "theme-change";
const media_query = "(prefers-color-scheme: dark)";

function get_theme(): Theme {
  if (typeof window === "undefined") return "light";

  const saved_theme = localStorage.getItem(theme_key);
  if (saved_theme === "dark" || saved_theme === "light") return saved_theme;

  return window.matchMedia(media_query).matches ? "dark" : "light";
}

function apply_theme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function set_theme_value(theme: Theme) {
  localStorage.setItem(theme_key, theme);
  apply_theme(theme);
  window.dispatchEvent(new Event(theme_change_event));
}

function subscribe(on_change: () => void) {
  const media = window.matchMedia(media_query);

  const on_media_change = () => {
    if (!localStorage.getItem(theme_key)) apply_theme(get_theme());
    on_change();
  };

  window.addEventListener("storage", on_change);
  window.addEventListener(theme_change_event, on_change);
  media.addEventListener("change", on_media_change);

  return () => {
    window.removeEventListener("storage", on_change);
    window.removeEventListener(theme_change_event, on_change);
    media.removeEventListener("change", on_media_change);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, get_theme, () => "light");
  const is_dark = theme === "dark";

  const toggle_theme = () => {
    const next_theme: Theme = is_dark ? "light" : "dark";
    set_theme_value(next_theme);
  };

  return (
    <button
      aria-label={is_dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-secondary"
      onClick={toggle_theme}
      title={is_dark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
    >
      {is_dark ? <Sun size={14} /> : <Moon size={14} />}
      <span>{is_dark ? "Light" : "Dark"}</span>
    </button>
  );
}
