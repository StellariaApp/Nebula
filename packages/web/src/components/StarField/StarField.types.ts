import type { RefObject } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type StarDensity = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * A grid background with stars: the Stellaria visual signature as a system component.
 *
 * It is decorative (`aria-hidden`) and takes no flow: it mounts as an absolute sibling inside a
 * positioned region. The twinkle and the parallax turn off with `prefers-reduced-motion` and with
 * `motion.tier: "minimal"`; the grid and the stars stay static and legible.
 *
 * GUARDRAIL (docs/06 §6): one dominant effect per region. It belongs on a hero, a landing, a login,
 * an empty state or an entry screen — not behind a table or a form.
 *
 * The one exception is the page-wide ambient layer (ADR-129): `fixed`, behind everything, with
 * `translucency` at 1 and `density` at `sm` or lower, and nothing else on the page claiming a
 * dominant effect. Any denser calibration behind a table or a form is out of contract.
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
