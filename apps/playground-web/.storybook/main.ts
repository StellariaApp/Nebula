import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

const here = dirname(fileURLToPath(import.meta.url));
const webSrc = resolve(here, "../../../packages/web/src");

/** Los siete subpath exports de `@stellaria/nebula-web` (ADR-014 regla 3, ADR-060, ADR-061). */
const SUBPATHS = ["command", "charts", "datagrid", "dnd", "carousel", "media", "editor"];

/**
 * Storybook 10.5 (builder Vite) — ADR-007.
 *
 * - **dev**: aliasa `@stellaria/nebula-web` a su código FUENTE y añade el plugin
 *   de Vanilla Extract, para tener HMR mientras se autoran componentes (W1.4+).
 * - **build** (y por tanto el gate `a11y` de CI): consume el `dist` precompilado,
 *   de modo que lo auditado sea el artefacto real que recibe el consumidor
 *   (ADR-016), no el código fuente.
 *
 * El alias se declara en **forma de array y con los subpaths primero**. Con la forma de objeto,
 * Vite hace sustitución por prefijo: `@stellaria/nebula-web/dnd` se convertía en
 * `…/src/index.ts/dnd` y no resolvía. El gate de a11y nunca lo vio porque compila el `dist` y
 * resuelve por los `exports` del package.json, así que el fallo solo existía en dev.
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

    const existing = viteConfig.resolve?.alias;
    const inherited = Array.isArray(existing)
      ? existing
      : Object.entries(existing ?? {}).map(([find, replacement]) => ({
          find,
          replacement: replacement as string,
        }));

    return {
      ...viteConfig,
      plugins: [...(viteConfig.plugins ?? []), vanillaExtractPlugin()],
      resolve: {
        ...viteConfig.resolve,
        alias: [
          ...SUBPATHS.map((name) => ({
            find: `@stellaria/nebula-web/${name}`,
            replacement: resolve(webSrc, name, "index.ts"),
          })),
          { find: /^@stellaria\/nebula-web$/, replacement: resolve(webSrc, "index.ts") },
          ...inherited,
        ],
      },
    };
  },
};

export default config;
