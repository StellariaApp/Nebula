import { style, type StyleRule } from "@vanilla-extract/css";

import { breakpoints } from "@stellaria/nebula-tokens";

import { util_layer } from "../../theme/layers.css.js";
import { OpenVarName, STYLE_PROPS, type PropSpec } from "../../utils/style-registry.js";

export const BREAKPOINT_ORDER = ["base", "phone", "tablet", "laptop", "desktop", "wide"] as const;

export type BreakpointName = (typeof BREAKPOINT_ORDER)[number];

type Declaration = Omit<StyleRule, "@media" | "@supports" | "@container" | "@layer">;

/**
 * Una prop de estilo puede escribir tambien una custom property —`p` publica `--nb-pad`—, y esas no
 * valen como clave suelta: vanilla-extract las quiere bajo `vars`. Se separan aqui, que es el unico
 * sitio que recorre `spec.css`, para que el carril abierto publique lo mismo que el de tokens: un
 * `p={20}` deja la variable igual que un `p="md"`, y la banda a sangre no depende de cual cayo.
 */
function Declare(spec: PropSpec, value: string): Declaration {
  const properties: Record<string, string> = {};
  const custom: Record<string, string> = {};

  for (const css of spec.css) {
    if (css.startsWith("--")) custom[css] = value;
    else properties[css] = value;
  }

  return Object.keys(custom).length === 0 ? properties : { ...properties, vars: custom };
}

function Reference(name: string, level: BreakpointName): string {
  return `var(${OpenVarName(name, level)}, revert-layer)`;
}

/**
 * Un valor suelto —`p={20}`— no necesita tramos: el elemento escribe `--nb-p` y la clase la lee.
 * Como la escribe siempre, no hay nada que heredar de un antepasado.
 */
function PlainClass(spec: PropSpec, name: string): string {
  return style({ "@layer": { [util_layer]: Declare(spec, `var(${OpenVarName(name, "base")})`) } });
}

/**
 * Un valor por breakpoint lleva una regla por tramo, y cada una lee SOLO la variable de su tramo.
 *
 * Antes cada tramo encadenaba hacia abajo —`var(--nb-p-laptop, var(--nb-p-tablet, var(--nb-p)))`—
 * para que un `{ base, laptop }` no se rompiese en desktop. Ese encadenado lo hace ahora
 * `ExtractStyleProps`, que escribe los seis tramos ya resueltos, y con eso se van dos defectos:
 *
 * - las custom properties se heredan, y un tramo que el elemento no declaraba lo tomaba de un
 *   antepasado: `p={{ base: 10, tablet: 30 }}` le dejaba su 30 en tablet a un hijo con otro `p`;
 * - un `{ tablet: 20 }` sin base dejaba `padding: var(--nb-p)` invalida en tiempo de computo, o sea
 *   en `0`, pisando el relleno del componente. El tramo sin valor llega como `initial` y cae a
 *   `revert-layer`: la regla se retira y manda la capa de abajo.
 */
function SteppedClass(spec: PropSpec, name: string): string {
  const media: Record<string, Declaration> = {};

  for (const level of BREAKPOINT_ORDER) {
    if (level === "base") continue;
    media[`screen and (min-width: ${String(breakpoints[level])}px)`] = Declare(
      spec,
      Reference(name, level),
    );
  }

  return style({
    "@layer": { [util_layer]: { ...Declare(spec, Reference(name, "base")), "@media": media } },
  });
}

const plain_by_prop: Record<string, string> = {};
const stepped_by_prop: Record<string, string> = {};

for (const [name, spec] of Object.entries(STYLE_PROPS) as [string, PropSpec][]) {
  plain_by_prop[name] = PlainClass(spec, name);
  stepped_by_prop[name] = SteppedClass(spec, name);
}

export const OPEN_CLASS: Readonly<Record<string, string>> = plain_by_prop;
export const OPEN_STEPPED_CLASS: Readonly<Record<string, string>> = stepped_by_prop;
