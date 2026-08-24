import { writable } from "svelte/store";

const KEY = "python-tutorial-theme";

export type Theme = "light" | "dark";

function initialTheme(): Theme {
  const stored = localStorage.getItem(KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

const initial = initialTheme();

export const theme = writable<Theme>(initial);

theme.subscribe((t) => {
  apply(t);
  localStorage.setItem(KEY, t);
});

apply(initial);
