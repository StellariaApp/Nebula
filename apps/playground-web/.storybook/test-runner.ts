import { getStoryContext, type TestRunnerConfig } from "@storybook/test-runner";
import { checkA11y, injectAxe } from "axe-playwright";

/**
 * Gate a11y (docs/03 §4.1): axe sobre TODAS las stories vía test-runner + Playwright
 * (ADR-017). Fallo = exit code ≠ 0. La regla `region` (todo el contenido dentro de
 * landmarks) se desactiva: las stories son fragmentos de componente, no páginas.
 * Una story puede exonerarse con `parameters.a11y.disable = true`, o desactivar reglas
 * concretas con `parameters.a11y.rules`. Lo usan las láminas de comparación de temas:
 * repiten la misma composición una vez por tema, así que cualquier landmark que contenga
 * aparece duplicado por construcción y `landmark-unique` no es aplicable.
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
 *
 * Al margen fijo se le suma una espera acotada a que ningún `[data-reveal]` esté a media
 * opacidad. El margen solo no basta desde que el reveal pinta de verdad su estado oculto:
 * la sexta tarjeta de `Motion/Reveal › Stagger` sigue entrando a los 400 ms —retardo de
 * stagger más los 682 ms del muelle— y axe la pillaba traslúcida. Se acota a un selector
 * concreto, así que las animaciones decorativas infinitas siguen sin poder colgar el gate,
 * y si aun así no asienta se sigue adelante en vez de fallar por la espera.
 */
const SETTLE_MS = 400;
const REVEAL_SETTLE_MS = 2500;
const OPAQUE = 0.99;
const CLEAR = 0.01;

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const story_context = await getStoryContext(page, context);
    const params = story_context.parameters as {
      a11y?: { disable?: boolean; rules?: Record<string, { enabled: boolean }> };
    };
    if (params.a11y?.disable === true) return;

    await page.waitForTimeout(SETTLE_MS);
    await page
      .waitForFunction(
        (range) =>
          [...document.querySelectorAll("[data-reveal]")].every((node) => {
            const value = Number(getComputedStyle(node).opacity);
            return value < range.clear || value > range.opaque;
          }),
        { clear: CLEAR, opaque: OPAQUE },
        { timeout: REVEAL_SETTLE_MS },
      )
      .catch(() => undefined);

    await checkA11y(page, "body", {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        rules: { region: { enabled: false }, ...(params.a11y?.rules ?? {}) },
      },
    });
  },
};

export default config;
