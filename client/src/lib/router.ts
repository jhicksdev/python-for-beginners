import { readable } from "svelte/store";

function slugFromHash(): string | null {
  const hash = window.location.hash.replace(/^#\/?/, "").replace(/\/$/, "");
  return hash.length > 0 ? hash : null;
}

export const currentSlug = readable<string | null>(slugFromHash(), (set) => {
  const onHashChange = () => set(slugFromHash());
  window.addEventListener("hashchange", onHashChange);
  return () => window.removeEventListener("hashchange", onHashChange);
});

export function navigate(slug: string) {
  window.location.hash = `/${slug}`;
}

export function goHome() {
  window.location.hash = "";
}

export function lastChapter(): string | null {
  return localStorage.getItem("python-tutorial-last-chapter");
}

export function rememberChapter(slug: string) {
  localStorage.setItem("python-tutorial-last-chapter", slug);
}
