import type { ThemeClassMap } from "../web/identity.js";

import { CLASSES as nebulaClasses, CSS as nebulaCss } from "./nebula/web.js";
import { CLASSES as rosetteClasses, CSS as rosetteCss } from "./rosette/web.js";
import { CLASSES as stellariaClasses, CSS as stellariaCss } from "./stellaria/web.js";
import { CLASSES as lagrangeClasses, CSS as lagrangeCss } from "./lagrange/web.js";
import { CLASSES as polarisClasses, CSS as polarisCss } from "./polaris/web.js";
import { CLASSES as auroraClasses, CSS as auroraCss } from "./aurora/web.js";
import { CLASSES as novaClasses, CSS as novaCss } from "./nova/web.js";
import { CLASSES as eclipseClasses, CSS as eclipseCss } from "./eclipse/web.js";
import { CLASSES as cosmosClasses, CSS as cosmosCss } from "./cosmos/web.js";
import { CLASSES as sunClasses, CSS as sunCss } from "./sun/web.js";

/**
 * Los 10 temas materializados: su clase y su CSS (ADR-168).
 *
 * Se compilan al importar este modulo. Son 20 reglas y pesan 8,1 kB brotli juntas —los
 * temas comparten los mismos 627 nombres de propiedad, asi que se deduplican entre si y uno solo ya
 * cuesta 4,4. Quien quiera dos importa `@stellaria/nebula-themes/<tema>/web` dos veces.
 */
export const CLASSES: ThemeClassMap = {
  nebula: nebulaClasses,
  rosette: rosetteClasses,
  stellaria: stellariaClasses,
  lagrange: lagrangeClasses,
  polaris: polarisClasses,
  aurora: auroraClasses,
  nova: novaClasses,
  eclipse: eclipseClasses,
  cosmos: cosmosClasses,
  sun: sunClasses,
};

export const CSS =
  nebulaCss +
  rosetteCss +
  stellariaCss +
  lagrangeCss +
  polarisCss +
  auroraCss +
  novaCss +
  eclipseCss +
  cosmosCss +
  sunCss;
