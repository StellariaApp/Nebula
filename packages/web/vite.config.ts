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
      // Un entry por subpath export (ADR-014 regla 3). `preserveModules` mantiene
      // el árbol, así que el aislamiento real lo da que `src/index.ts` NO
      // reexporte nada de estos subpaths.
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        "command/index": resolve(import.meta.dirname, "src/command/index.ts"),
        "charts/index": resolve(import.meta.dirname, "src/charts/index.ts"),
        "datagrid/index": resolve(import.meta.dirname, "src/datagrid/index.ts"),
        "dnd/index": resolve(import.meta.dirname, "src/dnd/index.ts"),
        "carousel/index": resolve(import.meta.dirname, "src/carousel/index.ts"),
        "media/index": resolve(import.meta.dirname, "src/media/index.ts"),
        "editor/index": resolve(import.meta.dirname, "src/editor/index.ts"),
      },
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      // react-aria cae en /^react/; motion y los runtimes de VE (recipes/sprinkles)
      // son dependencies declaradas: se importan, no se bundlean (ADR-018).
      external: [
        /^react/,
        /^@stellaria\//,
        /^@vanilla-extract\/(dynamic|recipes|sprinkles)/,
        /^motion/,
        // Deps de subpath (ADR-058): se importan, no se bundlean, para que el
        // consumidor las deduplique con las suyas.
        /^@tanstack\//,
        /^recharts/,
        /^@dnd-kit\//,
        /^embla-carousel/,
        /^@tiptap\//,
        /^prosemirror-/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
