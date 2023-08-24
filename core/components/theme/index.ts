import { setupNext } from "./setup";
import useTheme from "./hook";

const theme = {
  default: "light",
  themes: ["light", "dark"],
  setup: () => setupNext(theme.default),
  toggle: () => {
    const getTheme = document.documentElement.dataset.theme;
    const values = theme.themes;
    const index = values.indexOf(getTheme ?? theme.default);
    const next = values[(index + 1) % values.length];
    theme.set(next);
  },
  set: async (theme: string) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event("storage"));
  },
  get: () => {
    const getTheme = document.documentElement.dataset.theme;
    return getTheme ?? theme.default;
  },
  use: useTheme,
};

export type Theme = typeof theme;

export default theme;
