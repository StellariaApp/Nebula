import { resolve } from "node:path";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

/**
 * Build en modo librería (ADR-016): precompila el CSS de Vanilla Extract dentro
 * del paquete. `preserveModules` + `cssCodeSplit` conservan el tree-shaking por
 * módulo (un JS + su CSS por componente). Las `.d.ts` las emite `tsc` aparte
 * (ver package.json build). React, workspace deps y @vanilla-extract/dynamic
 * (runtime) quedan external.
 */
export default defineConfig({
  // libInjectCss reinyecta `import "./x.css"` en cada chunk JS (Vite lib mode no lo
  // hace), para que importar el paquete arrastre su CSS precompilado (ADR-016).
  plugins: [vanillaExtractPlugin({ identifiers: "debug" }), libInjectCss()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      external: [/^react/, /^@stellaria\//, /^@vanilla-extract\/dynamic/],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
