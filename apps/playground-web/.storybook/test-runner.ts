import { getStoryContext, type TestRunnerConfig } from "@storybook/test-runner";
import { checkA11y, injectAxe } from "axe-playwright";

/**
 * Gate a11y (docs/03 §4.1): axe sobre TODAS las stories vía test-runner + Playwright
 * (ADR-017). Fallo = exit code ≠ 0. La regla `region` (todo el contenido dentro de
 * landmarks) se desactiva: las stories son fragmentos de componente, no páginas.
 * Una story puede exonerarse con `parameters.a11y.disable = true`.
 *
 * El contexto es `body`, no `#storybook-root`: los overlays (Popover, Tooltip, Modal,
 * Drawer, Menu) se renderizan en un portal fuera de la raíz de la story, así que
 * acotarlo a `#storybook-root` dejaba sin auditar justo el contenido de W2.4.
 *
 * Antes de auditar se deja asentar la animación de entrada: axe calcula el contraste
 * sobre el color compuesto, y un elemento a media opacidad da falsos positivos de
 * `color-contrast`. Es un margen fijo y no una espera a `getAnimations()`, porque las
 * animaciones decorativas infinitas (spinner, shimmer, rayas, glow) nunca resuelven su
 * promesa `finished` y colgarían el gate.
 */
const SETTLE_MS = 400;

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const story_context = await getStoryContext(page, context);
    const params = story_context.parameters as { a11y?: { disable?: boolean } };
    if (params.a11y?.disable === true) return;

    await page.waitForTimeout(SETTLE_MS);

    await checkA11y(page, "body", {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: { rules: { region: { enabled: false } } },
    });
  },
};

export default config;
