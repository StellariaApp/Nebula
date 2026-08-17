import type { NebulaTheme } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "./contract.css.js";
import type { MaterializedTheme } from "./identity.js";
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
