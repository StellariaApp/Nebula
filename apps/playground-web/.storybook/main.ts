import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

const here = dirname(fileURLToPath(import.meta.url));
const webSrc = resolve(here, "../../../packages/web/src/index.ts");

/**
 * Storybook 10.5 (builder Vite) — ADR-007.
 *
 * - **dev**: aliasa `@stellaria/nebula-web` a su código FUENTE y añade el plugin
 *   de Vanilla Extract, para tener HMR mientras se autoran componentes (W1.4+).
 * - **build** (y por tanto el gate `a11y` de CI): consume el `dist` precompilado,
 *   de modo que lo auditado sea el artefacto real que recibe el consumidor
 *   (ADR-016), no el código fuente.
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
  viteFinal: async (viteConfig, { configType }) => {
    if (configType !== "DEVELOPMENT") return viteConfig;

    const { vanillaExtractPlugin } = await import("@vanilla-extract/vite-plugin");
    return {
      ...viteConfig,
      plugins: [...(viteConfig.plugins ?? []), vanillaExtractPlugin()],
      resolve: {
        ...viteConfig.resolve,
        alias: {
          ...viteConfig.resolve?.alias,
          "@stellaria/nebula-web": webSrc,
        },
      },
    };
  },
};

export default config;
