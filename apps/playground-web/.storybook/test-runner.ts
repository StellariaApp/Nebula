import { getStoryContext, type TestRunnerConfig } from "@storybook/test-runner";
import { checkA11y, injectAxe } from "axe-playwright";
import { toMatchImageSnapshot } from "jest-image-snapshot";

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
 *
 * El margen fijo cubre además lo que aparece por temporizador y no por animación: el globo de
 * `FieldError` espera `VALIDATING_DELAY` (500 ms) antes de montarse, así que con un margen menor la
 * espera de animaciones pasaba en vacío —el nodo aún no existía— y axe lo medía entrando.
 */
const SETTLE_MS = 700;
const MOTION_SETTLE_MS = 2500;

/**
 * Gate de regresión visual (docs/03 §4.8, ADR-037 y su enmienda ADR-112). Corre en la misma pasada
 * del test-runner que axe, encendido por `NEBULA_GATE=visual`, porque compartir el arranque del
 * Storybook es lo que hace que el gate no cueste un segundo runner.
 *
 * El alcance lo fija ADR-037 §2 y es deliberadamente estrecho: las cinco láminas de
 * `Foundations/Visual QA` más las stories `Composition` y `AllThemes` de cada componente. Las
 * matrices `Variants`/`Sizes`/`States` quedan fuera a propósito — capturarlas produce cientos de
 * imágenes que cambian en bloque ante cualquier recalibración de token, y una revisión que nadie lee
 * es un gate que no existe.
 *
 * Antes de disparar se espera a `document.fonts.ready`. El margen fijo no sirve para esto: si la
 * Geist no ha llegado, el navegador mide con la de reserva y todo lo que abraza su contenido —un
 * botón, una etiqueta, una celda— sale con otro ancho. Sin esta espera el gate compara dos
 * tipografías y llama regresión a la diferencia; se detectó al correrlo por primera vez en W5.0,
 * con seis láminas fallando entre 0,17 % y 0,20 % sin que ningún componente hubiera cambiado.
 *
 * El determinismo del §3, con lo que se puede fijar desde aquí: viewport constante, `reduced-motion`
 * —la misma vía que unifica ADR-034—, y `animations: "disabled"` en la captura, que congela las
 * decorativas infinitas que el gate de axe ya no puede esperar.
 *
 * El baseline lleva la plataforma en su ruta (ADR-112). Desde ADR-149 el «entorno único» del §3 es la
 * imagen de Playwright anclada por digest, así que `linux` es el baseline que manda y `win32` queda
 * para correrlo en local antes de abrir un PR.
 *
 * Se enciende por el nombre del script que arranca la cadena y no por un `VAR=valor` en línea, que en
 * Windows no es sintaxis válida. `npm_lifecycle_event` lo hereda todo el árbol de procesos, así que
 * llega igual a través de `concurrently`.
 *
 * El prefijo importa: `visual:update` regenera el baseline y es tan «visual» como `visual`. Con una
 * comparación exacta se iba por la rama de axe —14 minutos de accesibilidad, cero capturas y el job
 * en verde—, que es la peor forma de fallar que hay.
 */
const VISUAL =
  process.env["NEBULA_GATE"] === "visual" ||
  process.env["npm_lifecycle_event"]?.startsWith("visual") === true;
const VIEWPORT = { width: 1280, height: 900 };

/**
 * ADR-037 §3 pide un umbral «pequeño pero no nulo». Medido: dos pasadas seguidas en la misma máquina
 * dan **cero** píxeles de diferencia en las 75 capturas —`animations: "disabled"` congela también las
 * decorativas infinitas—, así que el margen no cubre ruido observado sino la deriva de entorno que el
 * propio §3 anticipa. Por eso se queda en 0,1 % y no en el 1 % o 2 % habituales: con capturas de
 * ~1280×3000, el 1 % se traga que un bloque de texto baje una línea, que es justo lo que el gate
 * existe para ver.
 */
const DIFF_RATIO = 0.001;

function InScope(title: string, name: string): boolean {
  if (title.startsWith("Foundations/Visual QA/")) return true;
  return name === "Composition" || name === "AllThemes";
}

function SnapshotName(title: string, name: string): string {
  return `${title}--${name}`.replace(/[^\w-]+/g, "-").toLowerCase();
}

/**
 * El fichero de configuracion se carga en Node, fuera de Jest, asi que aqui arriba no hay `expect`.
 * `setup` es el unico hook que corre ya dentro del entorno de Jest, que es donde el matcher existe.
 */
interface ImageMatcher {
  toMatchImageSnapshot: (options: Record<string, unknown>) => void;
}

declare const expect: ((received: unknown) => ImageMatcher) & {
  extend: (matchers: Record<string, unknown>) => void;
};

const config: TestRunnerConfig = {
  setup() {
    if (VISUAL) expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    await page.setViewportSize(VIEWPORT);
    if (VISUAL) await page.emulateMedia({ reducedMotion: "reduce" });
    else await injectAxe(page);
  },
  async postVisit(page, context) {
    const story_context = await getStoryContext(page, context);
    const params = story_context.parameters as {
      a11y?: { disable?: boolean; rules?: Record<string, { enabled: boolean }> };
    };

    if (VISUAL) {
      if (!InScope(context.title, context.name)) return;
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await page.waitForTimeout(SETTLE_MS);
      const shot = await page.screenshot({
        fullPage: true,
        animations: "disabled",
        caret: "hide",
      });
      expect(shot).toMatchImageSnapshot({
        customSnapshotsDir: `${import.meta.dirname}/../__snapshots__/visual/${process.platform}`,
        customDiffDir: `${import.meta.dirname}/../__snapshots__/visual/__diff__`,
        customSnapshotIdentifier: SnapshotName(context.title, context.name),
        failureThresholdType: "percent",
        failureThreshold: DIFF_RATIO,
      });
      return;
    }

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
