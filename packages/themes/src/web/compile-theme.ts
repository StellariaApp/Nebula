import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "./contract.css.js";
import type { ThemeSchemes } from "../themes/registry.js";
import type { MaterializedTheme, ThemeClassMap } from "./identity.js";

const SCHEMES: readonly ColorScheme[] = ["dark", "light"];
import { ThemeToVars } from "./theme-vars.js";

/**
 * FNV-1a over the declaration body. It has to be deterministic — the server and the client must
 * agree on the class name or hydration breaks — which rules out a counter or anything random.
 */
function Hash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

export interface CompiledTheme extends MaterializedTheme {
  css: string;
}

/**
 * Materializes a theme as a class at runtime (ADR-164), for the theme that has no build to be
 * precompiled at: one that arrives from a backend, one per tenant, or one being edited live.
 *
 * It injects nothing. The caller puts `css` where it belongs — a `<style>` rendered on the server so
 * the theme arrives painted, or one swapped on the client — because the nonce, the mount point and
 * the order against the cascade layers are the consumer's to decide.
 *
 * The result is a `MaterializedTheme`, so it goes straight into the provider's `themes` registry or
 * its `defaultTheme`.
 */
export function CompileTheme(theme: NebulaTheme): CompiledTheme {
  const assigned = assignInlineVars(vars, ThemeToVars(theme));
  const body = Object.entries(assigned)
    .map(([name, value]) => `${name}:${String(value)}`)
    .join(";");
  const class_name = `nebula-t-${Hash(body)}`;
  return { theme, className: class_name, css: `.${class_name}{${body}}` };
}

/** La capa donde viven las reglas de tema (ADR-169). La declara `packages/web/styles.css`. */
export const THEME_LAYER = "nebula.theme";

export interface CompiledSet {
  classes: ThemeClassMap;
  css: string;
}

function Declarations(theme: NebulaTheme): Record<string, string> {
  const assigned = assignInlineVars(vars, ThemeToVars(theme));
  return Object.fromEntries(Object.entries(assigned).map(([k, v]) => [k, String(v)]));
}

function Body(entries: readonly (readonly [string, string])[]): string {
  return entries.map(([name, value]) => `${name}:${value}`).join(";");
}

/**
 * Materializa un conjunto entero de temas repartiendo lo que comparten (ADR-169).
 *
 * De las 627 variables del contrato, 445 valen lo mismo en las 20 combinaciones del paquete: sólo
 * cambian los colores. Emitir cada tema completo repite ese 67% una vez por tema, y eso es lo que
 * el navegador acaba parseando antes de pintar.
 *
 * Lo común va a una regla en `:root` y cada clase lleva sólo lo suyo, así que montar un tema sigue
 * siendo anadir UNA clase.
 *
 * **La base se calcula sobre el conjunto que se le pase.** Dos temas comparten mas que diez, asi que
 * el CSS de un conjunto NO es intercambiable con el de otro: cada uno es coherente consigo mismo.
 * Para un tema suelto y autonomo esta `CompileTheme`.
 */
export function CompileThemes(themes: Record<string, ThemeSchemes>): CompiledSet {
  const flat: { name: string; scheme: ColorScheme; declarations: Record<string, string> }[] = [];
  for (const [name, schemes] of Object.entries(themes)) {
    for (const scheme of SCHEMES) {
      flat.push({ name, scheme, declarations: Declarations(schemes[scheme]) });
    }
  }
  if (flat.length === 0) return { classes: {}, css: "" };

  const first = flat[0] as (typeof flat)[number];
  const names = Object.keys(first.declarations);
  const shared = names.filter((k) =>
    flat.every((entry) => entry.declarations[k] === first.declarations[k]),
  );
  const shared_set = new Set(shared);

  const rules: string[] = [
    `:root{${Body(shared.map((k) => [k, first.declarations[k] as string] as const))}}`,
  ];
  const classes: ThemeClassMap = {};

  for (const entry of flat) {
    const own = names
      .filter((k) => !shared_set.has(k))
      .map((k) => [k, entry.declarations[k] as string] as const);
    const class_name = `nebula-t-${Hash(`${entry.name}:${entry.scheme}:${Body(own)}`)}`;
    rules.push(`.${class_name}{${Body(own)}}`);
    const pair = classes[entry.name] ?? ({} as Record<ColorScheme, string>);
    pair[entry.scheme] = class_name;
    classes[entry.name] = pair;
  }

  return { classes, css: `@layer ${THEME_LAYER}{${rules.join("")}}` };
}
