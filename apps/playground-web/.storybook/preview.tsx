import { useEffect } from "react";

import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import type { Decorator, Preview } from "@storybook/react-vite";

import { officialThemes } from "@stellaria/nebula-themes";
import { NebulaProvider, type OfficialThemeName } from "@stellaria/nebula-web";

const THEME_ITEMS: { value: OfficialThemeName; title: string }[] = [
  { value: "light", title: "Nebula Light" },
  { value: "dark", title: "Nebula Dark" },
  { value: "sober-light", title: "Sober" },
  { value: "playful", title: "Playful" },
];

const REDUCED_MOTION_CSS =
  "*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}";

const withTheme: Decorator = (Story, context) => {
  const { theme = "dark", reducedMotion = "no-preference" } = context.globals as {
    theme?: OfficialThemeName;
    reducedMotion?: "reduce" | "no-preference";
  };

  useEffect(() => {
    const { body } = document;
    const colors = officialThemes[theme].colors;
    const prev_bg = body.style.background;
    const prev_color = body.style.color;
    body.style.background = colors.surface.base;
    body.style.color = colors.text.primary;
    return () => {
      body.style.background = prev_bg;
      body.style.color = prev_color;
    };
  }, [theme]);

  return (
    <NebulaProvider key={theme} defaultTheme={theme} storage={null}>
      {reducedMotion === "reduce" ? <style>{REDUCED_MOTION_CSS}</style> : null}
      <Story />
    </NebulaProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: {
    theme: "dark",
    reducedMotion: "no-preference",
  },
  globalTypes: {
    theme: {
      description: "Tema Nebula",
      toolbar: {
        title: "Tema",
        icon: "paintbrush",
        items: THEME_ITEMS,
        dynamicTitle: true,
      },
    },
    reducedMotion: {
      description: "prefers-reduced-motion",
      toolbar: {
        title: "Motion",
        icon: "lightning",
        items: [
          { value: "no-preference", title: "Motion on" },
          { value: "reduce", title: "Reduced motion" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "fullscreen",
    // El gate a11y lo corre `checkA11y` en test-runner.ts sobre `body`. Dejar además el test
    // automático del addon lanza una segunda instancia de axe en paralelo y ambas chocan
    // ("Axe is already running") en stories con animación en curso.
    a11y: { test: "off" },
    viewport: {
      options: {
        phone: { name: "Phone", styles: { width: "576px", height: "900px" } },
        tablet: { name: "Tablet", styles: { width: "768px", height: "1024px" } },
        laptop: { name: "Laptop", styles: { width: "1024px", height: "800px" } },
        desktop: { name: "Desktop", styles: { width: "1280px", height: "900px" } },
        wide: { name: "Wide", styles: { width: "1536px", height: "960px" } },
      },
    },
  },
};

export default preview;
