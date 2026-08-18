import { resolve } from "node:path";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

/**
 * `@stellaria/nebula-themes` deja de construirse con `tsc` plano porque desde ADR-168 declara el
 * contrato CSS, y eso lo compila Vanilla Extract: los nombres de las custom properties salen de aquí
 * y nadie fuera de esta compilación puede saberlos.
 *
 * Un entry por subpath. Lo que **no** lleva `/web` en la ruta no toca CSS y es lo único que
 * `packages/native` importa, así que Vanilla Extract nunca entra en su árbol.
 */
export default defineConfig({
  // libInjectCss reinyecta `import "./x.css"` en cada chunk (Vite en modo libreria no lo hace).
  // Sin el, el .vanilla.css se queda en el dist sin que nadie lo importe: la clase del tema acaba
  // puesta en <html> y ninguna regla la define, asi que todas las vars caen a su valor inicial.
  plugins: [vanillaExtractPlugin({ identifiers: "debug" }), libInjectCss()],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        "web/index": resolve(import.meta.dirname, "src/web/index.ts"),
        "themes/registry": resolve(import.meta.dirname, "src/themes/registry.ts"),
        "themes/all-web": resolve(import.meta.dirname, "src/themes/all-web.ts"),
        "themes/nebula/index": resolve(import.meta.dirname, "src/themes/nebula/index.ts"),
        "themes/nebula/web": resolve(import.meta.dirname, "src/themes/nebula/web.ts"),
        "themes/roseta/index": resolve(import.meta.dirname, "src/themes/roseta/index.ts"),
        "themes/roseta/web": resolve(import.meta.dirname, "src/themes/roseta/web.ts"),
        "themes/zenit/index": resolve(import.meta.dirname, "src/themes/zenit/index.ts"),
        "themes/zenit/web": resolve(import.meta.dirname, "src/themes/zenit/web.ts"),
        "themes/apolo/index": resolve(import.meta.dirname, "src/themes/apolo/index.ts"),
        "themes/apolo/web": resolve(import.meta.dirname, "src/themes/apolo/web.ts"),
        "themes/halo/index": resolve(import.meta.dirname, "src/themes/halo/index.ts"),
        "themes/halo/web": resolve(import.meta.dirname, "src/themes/halo/web.ts"),
        "themes/aurora/index": resolve(import.meta.dirname, "src/themes/aurora/index.ts"),
        "themes/aurora/web": resolve(import.meta.dirname, "src/themes/aurora/web.ts"),
        "themes/helix/index": resolve(import.meta.dirname, "src/themes/helix/index.ts"),
        "themes/helix/web": resolve(import.meta.dirname, "src/themes/helix/web.ts"),
        "themes/marte/index": resolve(import.meta.dirname, "src/themes/marte/index.ts"),
        "themes/marte/web": resolve(import.meta.dirname, "src/themes/marte/web.ts"),
        "themes/titan/index": resolve(import.meta.dirname, "src/themes/titan/index.ts"),
        "themes/titan/web": resolve(import.meta.dirname, "src/themes/titan/web.ts"),
        "themes/sun/index": resolve(import.meta.dirname, "src/themes/sun/index.ts"),
        "themes/sun/web": resolve(import.meta.dirname, "src/themes/sun/web.ts"),
        "themes/cometa/index": resolve(import.meta.dirname, "src/themes/cometa/index.ts"),
        "themes/cometa/web": resolve(import.meta.dirname, "src/themes/cometa/web.ts"),
        "themes/vela/index": resolve(import.meta.dirname, "src/themes/vela/index.ts"),
        "themes/vela/web": resolve(import.meta.dirname, "src/themes/vela/web.ts"),
        "themes/grafito/index": resolve(import.meta.dirname, "src/themes/grafito/index.ts"),
        "themes/grafito/web": resolve(import.meta.dirname, "src/themes/grafito/web.ts"),
        "themes/nova/index": resolve(import.meta.dirname, "src/themes/nova/index.ts"),
        "themes/nova/web": resolve(import.meta.dirname, "src/themes/nova/web.ts"),
        "themes/quasar/index": resolve(import.meta.dirname, "src/themes/quasar/index.ts"),
        "themes/quasar/web": resolve(import.meta.dirname, "src/themes/quasar/web.ts"),
        "themes/eclipse/index": resolve(import.meta.dirname, "src/themes/eclipse/index.ts"),
        "themes/eclipse/web": resolve(import.meta.dirname, "src/themes/eclipse/web.ts"),
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
