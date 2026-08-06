import type { RefObject } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type StarDensity = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Fondo de retícula con estrellas: la firma visual de Stellaria como componente del sistema.
 *
 * Es decorativo (`aria-hidden`) y no ocupa flujo: se monta como hermano absoluto dentro de una región
 * posicionada. El parpadeo y el parallax se apagan con `prefers-reduced-motion` y con
 * `motion.tier: "minimal"`; la retícula y las estrellas se quedan estáticas y legibles.
 *
 * GUARDRAIL (docs/06 §6): un solo efecto dominante por región. Va en hero, landing, login, empty
 * state o pantalla de entrada — no detrás de una tabla ni de un formulario.
 */
export interface StarFieldProps extends Omit<StyleProps, "opacity"> {
  density?: StarDensity | undefined;
  seed?: number | undefined;
  grid?: boolean | undefined;
  gridSize?: number | undefined;
  fade?: boolean | undefined;
  twinkle?: boolean | undefined;
  parallax?: boolean | undefined;
  translucency?: number | undefined;
  scroller?: RefObject<HTMLElement | null> | undefined;
  color?: ColorExtended | undefined;
  accentColor?: ColorExtended | undefined;
  accentEvery?: number | undefined;
  aurora?: boolean | undefined;
  fixed?: boolean | undefined;
  zIndex?: number | undefined;
  className?: string | undefined;
}
