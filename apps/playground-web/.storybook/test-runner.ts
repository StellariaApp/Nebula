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
 * Antes de auditar se deja asentar la animación de entrada: axe calcula el contraste sobre el
 * color compuesto, y un elemento a media opacidad da falsos positivos de `color-contrast`.
 *
 * Al margen fijo se le suma una espera acotada a que **no quede ninguna animación finita en
 * curso**. Las decorativas infinitas —spinner, shimmer, rayas, glow— se ignoran por su
 * `iterations: Infinity`, que es lo que impedía esperar a `getAnimations()` sin colgar el gate.
 * El margen solo no bastaba: la sexta tarjeta de `Motion/Reveal › Stagger`, el globo de
 * `FieldError` y el botón de un estado vacío seguían entrando a los 400 ms y axe los medía
 * traslúcidos. Si aun así no asienta se sigue adelante en vez de fallar por la espera.
 */
const SETTLE_MS = 400;
const MOTION_SETTLE_MS = 2500;

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
        () =>
          document.getAnimations().every((animation) => {
            if (animation.playState !== "running") return true;
            return animation.effect?.getTiming().iterations === Infinity;
          }),
        undefined,
        { timeout: MOTION_SETTLE_MS },
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
