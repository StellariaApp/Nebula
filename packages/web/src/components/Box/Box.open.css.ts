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

function Chain(name: string, step: number): string {
  let reference = `var(${OpenVarName(name, "base")})`;
  for (let level = 1; level <= step; level += 1) {
    reference = `var(${OpenVarName(name, BREAKPOINT_ORDER[level] as string)}, ${reference})`;
  }
  return reference;
}

function OpenClass(name: string, spec: PropSpec): string {
  const media: Record<string, Declaration> = {};

  for (let step = 1; step < BREAKPOINT_ORDER.length; step += 1) {
    const level = BREAKPOINT_ORDER[step] as Exclude<BreakpointName, "base">;
    media[`screen and (min-width: ${String(breakpoints[level])}px)`] = Declare(
      spec,
      Chain(name, step),
    );
  }

  return style({
    "@layer": { [util_layer]: { ...Declare(spec, Chain(name, 0)), "@media": media } },
  });
}

const class_by_prop: Record<string, string> = {};

for (const [name, spec] of Object.entries(STYLE_PROPS) as [string, PropSpec][]) {
  class_by_prop[name] = OpenClass(name, spec);
}

export const OPEN_CLASS: Readonly<Record<string, string>> = class_by_prop;
