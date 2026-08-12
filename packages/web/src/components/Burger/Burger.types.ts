import type { ComponentPropsWithoutRef } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { PressLifecycleProps } from "../../utils/press-props.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface BurgerProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled" | "onChange">,
    StyleProps,
    PressLifecycleProps {
  /** The breakpoint below which the button appears; always, by default. */
  showBelow?: "always" | "phone" | "tablet" | "laptop" | undefined;
  /**
   * The open state, controlled. Passing it takes the state away from the button for good: it stops
   * tracking its own, and `onChange` becomes the only thing that can move it.
   */
  opened?: boolean | undefined;
  /**
   * Where the state starts when nothing controls it. Ignored the moment `opened` is passed.
   * @default false
   */
  defaultOpened?: boolean | undefined;
  /**
   * Fires with the state the button is moving TO, in both modes — so it is the change hook when
   * uncontrolled and the only way to move when controlled.
   */
  onChange?: ((opened: boolean) => void) | undefined;
  /**
   * The button's box, and with it how far the bars travel as they cross. The two are tied on
   * purpose: a bar that moves the wrong distance does not land on a clean X.
   * @default "md"
   */
  size?: Size | undefined;
  /**
   * The bars' colour. A role path like the default resolves straight to that token; naming one of
   * the theme's scales instead takes its 600 step.
   * @default "text.primary"
   */
  color?: ColorExtended | undefined;
  /** Blocks the press, so the state can only be moved from outside. @default false */
  disabled?: boolean | undefined;
  /**
   * The button's accessible name while closed — three bare bars have no text of their own. Say what
   * the press does, not what the state is: `aria-expanded` already carries the state.
   * It is English by default (ADR-120); translate it at the call site.
   * @default "Open menu"
   */
  openLabel?: string | undefined;
  /**
   * The name it takes while open, swapped in alongside `aria-expanded`.
   * @default "Close menu"
   */
  closeLabel?: string | undefined;
}
