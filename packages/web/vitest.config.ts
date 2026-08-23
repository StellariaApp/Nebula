import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    environment: "jsdom",
    // El script de arranque del tema es un `<script>` inline: sin esto el DOM de las pruebas no lo
    // ejecuta y su degradación —pintar aunque no haya almacén— no se podría comprobar corriendo.
    environmentOptions: { jsdom: { runScripts: "dangerously" } },
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["src/__tests__/setup.ts"],
    // El default de 5 s se quedó corto al pasar la suite de 578 a ~700 tests: los
    // más pesados —teclear sobre la colección de 240 prefijos, virtualizar 60
    // filas— lo rozaban y fallaban de forma intermitente según la carga de la
    // máquina, no por un defecto del componente.
    testTimeout: 15_000,
  },
});
