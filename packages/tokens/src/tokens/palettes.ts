/**
 * Las 16 paletas base declaradas por nombre.
 *
 * TODO(F0.3): los VALORES 50–950 se generan con `tools/palette-gen` (OKLCH,
 * ADR-009) usando las semillas de Stellaria como carácter — los hex legacy
 * 100–900 NO se portan 1:1 (decisión cerrada). Hasta entonces este módulo
 * solo expone los nombres.
 */
import type { PaletteName } from "../theme/primitives";

export const paletteNames = [
  "indigo",
  "violet",
  "green",
  "yellow",
  "red",
  "blue",
  "orange",
  "teal",
  "pink",
  "cyan",
  "lime",
  "grape",
  "rose",
  "gold",
  "light",
  "dark",
] as const satisfies readonly PaletteName[];
