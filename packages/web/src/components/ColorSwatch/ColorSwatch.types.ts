import type { ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface ColorSwatchProps extends StyleProps {
  /**
   * What the swatch paints. Anything starting with `#` or containing a function call is used
   * verbatim, which is what lets it show a raw value a user picked; anything else is resolved
   * through the theme scales at their 600 step.
   */
  color: ColorExtended | (string & {});
  /** The swatch's square, as a raw pixel length rather than a step. @default 24 */
  size?: number | undefined;
  /** How round it is. @default "full" */
  radius?: "sm" | "md" | "full" | undefined;
  /**
   * Keeps the inset shadow that stops a pale swatch from disappearing into a pale surface. It is
   * the only thing giving a near-white swatch an edge, so turning it off needs a border of your own.
   * @default true
   */
  withShadow?: boolean | undefined;
  /** What sits on top of the colour — usually a check mark for the selected one. */
  children?: ReactNode | undefined;
  /**
   * Names the colour for assistive tech. Without it a static swatch is `aria-hidden`, which is right
   * beside a written colour name and wrong when the swatch stands alone. A pressable swatch always
   * has a name: this, or the raw `color` as a last resort.
   */
  label?: string | undefined;
  /**
   * Turns the swatch into a real button. It is what makes it selectable, and it also changes the
   * element: without it the swatch is a `span` and takes no focus.
   */
  onPress?: (() => void) | undefined;
  className?: string | undefined;
}
