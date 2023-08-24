export const toggle = (theme: any) => {
  const getTheme = document.documentElement.dataset.theme;
  const values = theme.themes;
  const index = values.indexOf(getTheme ?? theme.default);
  const next = values[(index + 1) % values.length];
  theme.set(next);
};

export const set = async (theme: string) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  window.dispatchEvent(new Event("storage"));
};

export const get = (theme: any) => {
  const getTheme = document.documentElement.dataset.theme;
  return getTheme ?? theme.default;
};
