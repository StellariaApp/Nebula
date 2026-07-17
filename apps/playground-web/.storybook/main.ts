import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Storybook 10.5 (builder Vite) — ADR-007. Consume @stellaria/nebula-web YA
 * COMPILADO (dist con CSS precompilado, ADR-016): no necesita el plugin de VE.
 * viewport/controls/backgrounds son core en SB10; solo se añade addon-a11y.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
