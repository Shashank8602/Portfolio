"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_MODE, DEFAULT_THEME, type Mode, type ThemeName } from "./theme";

export function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-mode"] });
  return () => observer.disconnect();
}

function snapshot() {
  const root = document.documentElement;
  return `${root.getAttribute("data-theme") ?? DEFAULT_THEME}|${root.getAttribute("data-mode") ?? DEFAULT_MODE}`;
}

export function useTheme(): { theme: ThemeName; mode: Mode } {
  const value = useSyncExternalStore(subscribeToTheme, snapshot, () => `${DEFAULT_THEME}|${DEFAULT_MODE}`);
  const [theme, mode] = value.split("|") as [ThemeName, Mode];
  return { theme, mode };
}
