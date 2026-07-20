import { getStoryContext, type TestRunnerConfig } from "@storybook/test-runner";
import { checkA11y, injectAxe } from "axe-playwright";

/**
 * Gate a11y (docs/03 §4.1): axe sobre TODAS las stories vía test-runner + Playwright
 * (ADR-017). Fallo = exit code ≠ 0. La regla `region` (todo el contenido dentro de
 * landmarks) se desactiva: las stories son fragmentos de componente, no páginas.
 * Una story puede exonerarse con `parameters.a11y.disable = true`.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const story_context = await getStoryContext(page, context);
    const params = story_context.parameters as { a11y?: { disable?: boolean } };
    if (params.a11y?.disable === true) return;

    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: { rules: { region: { enabled: false } } },
    });
  },
};

export default config;
