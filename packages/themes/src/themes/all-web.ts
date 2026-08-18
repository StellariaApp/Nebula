import { CLASSES as nebulaClasses, CSS as nebulaCss } from "./nebula/web.js";
import { CLASSES as rosetaClasses, CSS as rosetaCss } from "./roseta/web.js";
import { CLASSES as rigelClasses, CSS as rigelCss } from "./rigel/web.js";
import { CLASSES as arcturusClasses, CSS as arcturusCss } from "./arcturus/web.js";
import { CLASSES as vegaClasses, CSS as vegaCss } from "./vega/web.js";
import { CLASSES as auroraClasses, CSS as auroraCss } from "./aurora/web.js";
import { CLASSES as helixClasses, CSS as helixCss } from "./helix/web.js";
import { CLASSES as antaresClasses, CSS as antaresCss } from "./antares/web.js";
import { CLASSES as titanClasses, CSS as titanCss } from "./titan/web.js";
import { CLASSES as sunClasses, CSS as sunCss } from "./sun/web.js";
import { CLASSES as halleyClasses, CSS as halleyCss } from "./halley/web.js";
import { CLASSES as velaClasses, CSS as velaCss } from "./vela/web.js";
import { CLASSES as eclipseClasses, CSS as eclipseCss } from "./eclipse/web.js";
import { CLASSES as coronaClasses, CSS as coronaCss } from "./corona/web.js";

import type { ThemeClassMap } from "../web/identity.js";

/**
 * Los 14 temas materializados: sus clases y su CSS (ADR-168, ADR-169).
 *
 * Se compilan al importar este modulo, y se reparten: lo que vale igual en las 28
 * combinaciones va una sola vez a `:root` y cada clase lleva solo lo suyo.
 *
 * Todo va dentro de `@layer nebula.theme`, la capa mas baja: un tema define valores por defecto y
 * cualquier cosa mas especifica —empezando por el catalogo— debe poder pisarlos.
 *
 * Quien solo quiera uno importa `@stellaria/nebula-themes/<tema>/web`. Los dos CSS no son
 * intercambiables: cada conjunto calcula su base sobre lo que contiene.
 */
export const CLASSES: ThemeClassMap = {
  nebula: nebulaClasses,
  roseta: rosetaClasses,
  rigel: rigelClasses,
  arcturus: arcturusClasses,
  vega: vegaClasses,
  aurora: auroraClasses,
  helix: helixClasses,
  antares: antaresClasses,
  titan: titanClasses,
  sun: sunClasses,
  halley: halleyClasses,
  vela: velaClasses,
  eclipse: eclipseClasses,
  corona: coronaClasses,
};

export const CSS =
  nebulaCss +
  rosetaCss +
  rigelCss +
  arcturusCss +
  vegaCss +
  auroraCss +
  helixCss +
  antaresCss +
  titanCss +
  sunCss +
  halleyCss +
  velaCss +
  eclipseCss +
  coronaCss;
