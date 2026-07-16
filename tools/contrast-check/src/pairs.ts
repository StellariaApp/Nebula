/**
 * Pares texto/superficie y estados a validar (docs/03 §1 reglas 2 y 4, §4.2):
 * - texto normal 4.5:1; large text y componentes UI 3:1; focus ≥3:1.
 * - disabled está EXENTO de contraste (WCAG 2.2 · 1.4.3) — no se valida.
 */
import type { NebulaTheme } from "@stellaria/nebula-tokens";

export interface ContrastPair {
  label: string;
  fg: (theme: NebulaTheme) => string;
  bg: (theme: NebulaTheme) => string;
  min: number;
}

const SURFACES = ["base", "raised", "overlay", "sunken"] as const;
const STATUSES = ["success", "warning", "error", "info"] as const;

export function buildPairs(): ContrastPair[] {
  const pairs: ContrastPair[] = [];

  // Texto normal sobre cada superficie (4.5:1)
  for (const role of ["primary", "secondary", "muted"] as const) {
    for (const surface of SURFACES) {
      pairs.push({
        label: `text.${role} / surface.${surface}`,
        fg: (t) => t.colors.text[role],
        bg: (t) => t.colors.surface[surface],
        min: 4.5,
      });
    }
  }

  // Texto invertido sobre superficie invertida (tooltip/toast oscuro)
  pairs.push({
    label: "text.inverted / gray.900 (superficie invertida)",
    fg: (t) => t.colors.text.inverted,
    bg: (t) => t.colors.gray["900"],
    min: 4.5,
  });

  // Variante filled + estado hover (600 → 700)
  pairs.push(
    {
      label: "text.onPrimary / primary.600 (filled)",
      fg: (t) => t.colors.text.onPrimary,
      bg: (t) => t.colors.primary["600"],
      min: 4.5,
    },
    {
      label: "text.onPrimary / primary.700 (filled:hover)",
      fg: (t) => t.colors.text.onPrimary,
      bg: (t) => t.colors.primary["700"],
      min: 4.5,
    },
  );

  // Texto semántico (paso 700 designado para texto de estado) sobre base
  for (const status of STATUSES) {
    pairs.push({
      label: `semantic.${status}.700 (texto) / surface.base`,
      fg: (t) => t.colors.semantic[status]["700"],
      bg: (t) => t.colors.surface.base,
      min: 4.5,
    });
  }

  // Componentes UI (3:1): borde fuerte, filled como bloque, y focus ring
  for (const surface of SURFACES) {
    pairs.push(
      {
        label: `border.strong / surface.${surface} (UI)`,
        fg: (t) => t.colors.border.strong,
        bg: (t) => t.colors.surface[surface],
        min: 3,
      },
      {
        label: `border.focus / surface.${surface} (focus ≥3:1)`,
        fg: (t) => t.colors.border.focus,
        bg: (t) => t.colors.surface[surface],
        min: 3,
      },
    );
  }
  pairs.push({
    label: "primary.600 (UI filled) / surface.base",
    fg: (t) => t.colors.primary["600"],
    bg: (t) => t.colors.surface.base,
    min: 3,
  });

  return pairs;
}
