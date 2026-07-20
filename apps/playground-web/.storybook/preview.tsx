import type { Decorator, Preview } from "@storybook/react-vite";

import { Box, NebulaProvider, type OfficialThemeName } from "@stellaria/nebula-web";

const THEME_ITEMS: { value: OfficialThemeName; title: string }[] = [
  { value: "nebula-light", title: "Nebula Light" },
  { value: "nebula-dark", title: "Nebula Dark" },
  { value: "sober-light", title: "Sober" },
  { value: "playful", title: "Playful" },
];

/** Colapsa animaciones/transiciones para simular prefers-reduced-motion. */
const REDUCED_MOTION_CSS =
  "*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}";

const withTheme: Decorator = (Story, context) => {
  const { theme = "nebula-light", reducedMotion = "no-preference" } = context.globals as {
    theme?: OfficialThemeName;
    reducedMotion?: "reduce" | "no-preference";
  };
  return (
    // key={theme} remonta el provider al cambiar de tema (defaultTheme es inicial).
    <NebulaProvider key={theme} defaultTheme={theme} storage={null}>
      {reducedMotion === "reduce" ? <style>{REDUCED_MOTION_CSS}</style> : null}
      {/*
        El canvas pinta la superficie y el texto del tema activo. Sin esto, las
        stories en tema oscuro se renderizan sobre el blanco de Storybook y axe
        reporta contraste insuficiente — un falso negativo que no refleja cómo se
        consume la librería (la app siempre pinta su superficie base).
      */}
      <Box bg="surface.base" c="text.primary" mih="100vh" p="md">
        <Story />
      </Box>
    </NebulaProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: {
    theme: "nebula-light",
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
