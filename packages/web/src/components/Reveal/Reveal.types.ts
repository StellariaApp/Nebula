import type { CSSProperties, ElementType, ReactNode } from "react";

import type { SpringName } from "@stellaria/nebula-tokens";

import type { TransitionPreset } from "../Transition/Transition.types.js";

import type { StyleProps } from "../../utils/style-props.js";

export type RevealPreset = TransitionPreset;

/** Con que estado nace el elemento antes de que el cliente decida. */
export type RevealInitial = "hidden" | "settled";

export interface RevealProps extends StyleProps {
  /**
   * What is revealed. It is never hidden by the stylesheet: the hidden state is applied from the
   * client only once motion is known to be allowed, so with JS off, without an
   * `IntersectionObserver`, or under reduced motion the content is simply there.
   */
  children?: ReactNode | undefined;
  /**
   * The element it paints. It swaps the root for its animated twin rather than wrapping it, so this
   * component adds no node — which is what lets it sit between a grid and its items.
   * @default "div"
   */
  component?: ElementType | undefined;
  /**
   * Which way it enters. Same seven presets as `Transition`, with a different trigger: that one
   * fires on `mounted`, this one on coming into view.
   * @default "slide-up"
   */
  preset?: RevealPreset | undefined;
  /** Uses a theme spring instead of a tween, which leaves `duration` unread. @default "gentle" */
  spring?: SpringName | undefined;
  /** Length of the entrance in milliseconds. Ignored when `spring` is set. */
  duration?: number | undefined;
  /**
   * Whether it reveals once and stays. Turning it off makes content re-animate every time it
   * re-enters the viewport, which reads as flicker on a page the user scrolls back up.
   * @default true
   */
  once?: boolean | undefined;
  /**
   * How much of the element has to be visible before it fires, from 0 to 1. Keep it low for tall
   * blocks: an element taller than the viewport can never reach a high threshold, and would never
   * reveal at all.
   * @default 0.2
   */
  amount?: number | undefined;
  /**
   * The observer's root margin. The default pulls the trigger line 10 % up from the bottom edge, so
   * the entrance starts before the element is flush with the fold rather than after.
   * @default "0px 0px -10% 0px"
   */
  rootMargin?: string | undefined;
  /**
   * Position in a stagger, which delays this one relative to its siblings. Pass the map index over a
   * list; the delay is capped, so a long list does not end with an element waiting seconds.
   */
  index?: number | undefined;
  /**
   * How far a `slide-*` travels, in pixels. Ignored by `fade`, `scale` and `pop`, which do not move.
   *
   * It is the knob that changes most between one product and another — the entrance reads bigger or
   * smaller by distance far more than by duration — and it used to be fixed in the preset, so moving
   * it meant a `className` over the component.
   * @default 24
   */
  distance?: number | undefined;
  /**
   * What the element looks like before the client has decided anything.
   *
   * - `"hidden"` — the default — ships it hidden from the very first paint, in or out of the
   *   viewport. Once mounted, the observer compares it against the viewport and whatever is visible
   *   animates in. This is what makes the entrance actually *play* instead of the content simply
   *   being there.
   *
   *   The stylesheet only declares that hidden state under `(scripting: enabled) and
   *   (prefers-reduced-motion: no-preference)`, so a page with scripting off — or a reader who asked
   *   for less motion — never has anything to un-hide. That is the difference from the usual
   *   `opacity: 0`, which leaves the page blank forever when the script fails to arrive.
   *
   * - `"settled"` ships it visible and only animates what scrolls in later. It costs the entrance
   *   of everything above the fold and buys back the paint: nothing that marks LCP starts invisible.
   *
   * @default "hidden"
   */
  initial?: RevealInitial | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}
