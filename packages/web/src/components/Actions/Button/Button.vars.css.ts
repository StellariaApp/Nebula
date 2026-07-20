import { createVar } from "@vanilla-extract/css";

/**
 * CSS vars locales del componente (ADR-018 §3). El `recipe()` las consume; el
 * componente las asigna en runtime resolviendo `theme.variantMap[variant]`.
 * Así el significado visual de cada variante lo decide el TEMA, no el componente,
 * sin renunciar al CSS estático para la estructura.
 */
export const bg = createVar();
export const bgHover = createVar();
export const bgActive = createVar();
export const fg = createVar();
export const borderColor = createVar();
export const borderWidth = createVar();
export const backdropFilter = createVar();
export const glow = createVar();
