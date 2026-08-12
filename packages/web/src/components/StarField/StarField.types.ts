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
  /**
   * How many stars. The cost is paid once, in nodes and in a CSS animation the GPU composites — it
   * is not a per-frame cost on the main thread, so density is a visual decision rather than a
   * budget one.
   * @default "md"
   */
  density?: StarDensity | undefined;
  /**
   * Seeds the low-discrepancy sequence the star layout comes from. The layout is generated, never
   * random, so server and client agree and hydration holds; change this for a different sky at the
   * same density.
   * @default 1
   */
  seed?: number | undefined;
  /** Whether the rule grid is drawn behind the stars. @default true */
  grid?: boolean | undefined;
  /** Side of a grid cell, in pixels. Read only with `grid`. @default 56 */
  gridSize?: number | undefined;
  /**
   * The elliptical mask that dissolves both layers towards the edges. It is what stops the field
   * ending in a visible seam where its region does.
   * @default true
   */
  fade?: boolean | undefined;
  /**
   * Whether the stars pulse. It stops on its own under `prefers-reduced-motion` and under
   * `motion.tier: "minimal"`, and the field is swapped for an even static one — not frozen wherever
   * each star happened to be, which would leave some of them invisible.
   * @default true
   */
  twinkle?: boolean | undefined;
  /**
   * Drifts grid and stars at different rates as the page scrolls, and pins the field to the viewport
   * to do it. It never subscribes on a coarse pointer or under reduced motion: on touch that is a
   * performance stop, not a preference one.
   * @default false
   */
  parallax?: boolean | undefined;
  /**
   * The grid's alpha, as a percentage of `color`. ADR-129 pins it at 1 for the page-wide ambient
   * layer; the default belongs to a hero, where the field is the region's one dominant effect.
   * @default 4
   */
  translucency?: number | undefined;
  /**
   * Whose scroll drives the parallax. Left out it listens to the window, which is wrong whenever the
   * page scrolls inside a container instead of the document — there the field would simply not move.
   */
  scroller?: RefObject<HTMLElement | null> | undefined;
  /**
   * The colour of grid and stars alike: the grid takes `translucency` of it, the stars 70 %. It is a
   * text role by default so the field follows the theme's ink rather than a fixed white.
   * @default "text.primary"
   */
  color?: ColorExtended | undefined;
  /** The tint of the occasional accent star, which also carries a wider glow. @default "accent.400" */
  accentColor?: ColorExtended | undefined;
  /**
   * One star in every this many takes `accentColor`. It feeds the generator, so changing it does not
   * merely recolour the accents — it picks a different set of them.
   * @default 5
   */
  accentEvery?: number | undefined;
  /**
   * Adds the slow drifting colour blobs behind the field. It is a second effect on top of an effect,
   * so it belongs only where the field is unquestionably the region's focus.
   * @default false
   */
  aurora?: boolean | undefined;
  /** Pins the field to the viewport. `parallax` already does this, so the two rarely go together. @default false */
  fixed?: boolean | undefined;
  zIndex?: number | undefined;
  className?: string | undefined;
}
