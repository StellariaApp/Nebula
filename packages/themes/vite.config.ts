import { resolve } from "node:path";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";

/**
 * `@stellaria/nebula-themes` deja de construirse con `tsc` plano porque desde ADR-168 declara el
 * contrato CSS, y eso lo compila Vanilla Extract: los nombres de las custom properties salen de aquí
 * y nadie fuera de esta compilación puede saberlos.
 *
 * Un entry por subpath. Lo que **no** lleva `/web` en la ruta no toca CSS y es lo único que
 * `packages/native` importa, así que Vanilla Extract nunca entra en su árbol.
 */
export default defineConfig({
  plugins: [vanillaExtractPlugin({ identifiers: "debug" })],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        "web/index": resolve(import.meta.dirname, "src/web/index.ts"),
        "themes/registry": resolve(import.meta.dirname, "src/themes/registry.ts"),
        "themes/all-web": resolve(import.meta.dirname, "src/themes/all-web.ts"),
        "themes/nebula/index": resolve(import.meta.dirname, "src/themes/nebula/index.ts"),
        "themes/nebula/web": resolve(import.meta.dirname, "src/themes/nebula/web.ts"),
        "themes/rosette/index": resolve(import.meta.dirname, "src/themes/rosette/index.ts"),
        "themes/rosette/web": resolve(import.meta.dirname, "src/themes/rosette/web.ts"),
        "themes/stellaria/index": resolve(import.meta.dirname, "src/themes/stellaria/index.ts"),
        "themes/stellaria/web": resolve(import.meta.dirname, "src/themes/stellaria/web.ts"),
        "themes/lagrange/index": resolve(import.meta.dirname, "src/themes/lagrange/index.ts"),
        "themes/lagrange/web": resolve(import.meta.dirname, "src/themes/lagrange/web.ts"),
        "themes/polaris/index": resolve(import.meta.dirname, "src/themes/polaris/index.ts"),
        "themes/polaris/web": resolve(import.meta.dirname, "src/themes/polaris/web.ts"),
        "themes/aurora/index": resolve(import.meta.dirname, "src/themes/aurora/index.ts"),
        "themes/aurora/web": resolve(import.meta.dirname, "src/themes/aurora/web.ts"),
        "themes/nova/index": resolve(import.meta.dirname, "src/themes/nova/index.ts"),
        "themes/nova/web": resolve(import.meta.dirname, "src/themes/nova/web.ts"),
        "themes/eclipse/index": resolve(import.meta.dirname, "src/themes/eclipse/index.ts"),
        "themes/eclipse/web": resolve(import.meta.dirname, "src/themes/eclipse/web.ts"),
        "themes/cosmos/index": resolve(import.meta.dirname, "src/themes/cosmos/index.ts"),
        "themes/cosmos/web": resolve(import.meta.dirname, "src/themes/cosmos/web.ts"),
        "themes/sun/index": resolve(import.meta.dirname, "src/themes/sun/index.ts"),
        "themes/sun/web": resolve(import.meta.dirname, "src/themes/sun/web.ts"),
      },
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      external: [/^@stellaria\//, /^@vanilla-extract\//, "zod"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
