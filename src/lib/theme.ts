export const THEMES = ["nebula", "matrix", "sunset"] as const;
export type ThemeName = (typeof THEMES)[number];
export type Mode = "dark" | "light";

export const THEME_LABELS: Record<ThemeName, { label: string; colors: [string, string] }> = {
  nebula: { label: "Nebula", colors: ["#22d3ee", "#8b5cf6"] },
  matrix: { label: "Matrix", colors: ["#10b981", "#a3e635"] },
  sunset: { label: "Sunset", colors: ["#f59e0b", "#ec4899"] },
};

export const DEFAULT_THEME: ThemeName = "nebula";

/**
 * Themes visitors can use. All three are still fully defined in globals.css; to bring the
 * others back, add them here (e.g. ["nebula", "matrix", "sunset"]). With more than one
 * enabled, the colour picker appears in the navbar and `/theme <name>` works in the console.
 */
export const ENABLED_THEMES: readonly ThemeName[] = ["nebula"];
export const THEME_PICKER_ENABLED = ENABLED_THEMES.length > 1;
export const DEFAULT_MODE: Mode = "dark";

const THEME_KEY = "portfolio-theme";
const MODE_KEY = "portfolio-mode";

/** Inline <head> script: applies the saved theme before first paint (no flash). */
export const themeInitScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_KEY}"),m=localStorage.getItem("${MODE_KEY}");if(t&&/^(${ENABLED_THEMES.join(
  "|",
)})$/.test(t))d.setAttribute("data-theme",t);if(m==="light"||m==="dark")d.setAttribute("data-mode",m)}catch(e){}})()`;

export function setTheme({ theme, mode }: { theme?: ThemeName; mode?: Mode }) {
  const root = document.documentElement;
  if (theme) root.setAttribute("data-theme", theme);
  if (mode) root.setAttribute("data-mode", mode);
  try {
    if (theme) localStorage.setItem(THEME_KEY, theme);
    if (mode) localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* storage unavailable (private mode) — the theme still applies for this visit */
  }
}

/** Re-applies the stored theme (React's dev-mode remount resets <html> attributes). */
export function restoreTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    const m = localStorage.getItem(MODE_KEY);
    const root = document.documentElement;
    if (t && (ENABLED_THEMES as readonly string[]).includes(t)) root.setAttribute("data-theme", t);
    if (m === "light" || m === "dark") root.setAttribute("data-mode", m);
  } catch {
    /* ignore */
  }
}
