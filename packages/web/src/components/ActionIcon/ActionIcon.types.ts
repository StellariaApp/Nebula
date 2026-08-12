import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type {
  ColorExtended,
  GlassLevel,
  PermissionProps,
  Size,
  Variant,
  VariantProps,
} from "@stellaria/nebula-tokens";

import type { PressLifecycleProps } from "../../utils/press-props.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

type MotionConflictingProps =
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop";

export interface ActionIconProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled" | MotionConflictingProps>,
    StyleProps,
    PressLifecycleProps,
    PermissionProps {
  /**
   * Wrapper for the icon. With `loading` it dims, which is how the button makes room for the spinner
   * without changing size; the spinner itself has no slot, because it is the mechanism of the animation.
   */
  iconProps?: BoxSlotProps | undefined;
  /**
   * The recipe the theme resolves background, border, glow and glass from, all at once. A row of
   * icon buttons reads as one control strip only if they share it.
   */
  variant?: Variant | undefined;
  /**
   * The button's square, in both axes at once. It is the tap target, so anything below `md` on a
   * touch surface has to be given room by its container instead.
   */
  size?: Size | undefined;
  /**
   * The scale the variant draws from. Name the scale and let the variant pick the steps out of it;
   * pinning a step here is what breaks the hover and active states, which are derived from it.
   */
  color?: ColorExtended | undefined;
  /**
   * Read only by `variant="gradient"`, where it replaces the theme's pair. `deg` is 135 if you do
   * not say otherwise, and `animate` needs this override to exist at all — it does nothing over the
   * theme's own gradient.
   */
  gradient?: VariantProps["gradient"] | undefined;
  /**
   * Blocks the press and drops the hover and press animation with it. No need to pair it with
   * `loading`, which already disables on its own.
   */
  disabled?: boolean | undefined;
  /**
   * Lays a spinner over the button, marks it `aria-busy` and disables it. The icon dims in place
   * rather than being swapped out, so the button holds its square while the work runs.
   */
  loading?: boolean | undefined;
  /**
   * The glyph, and the whole of the button's content. It is `aria-hidden`, so the control has no
   * accessible name until you give it one — an `aria-label` here is not optional.
   */
  children?: ReactNode | undefined;
  /**
   * Overrides the glass step the variant's recipe asks for. It is ignored in three cases that are
   * not errors: a variant whose recipe has no glass, a theme with `effects.glass.enabled` off, and
   * a `color` that is not one of the theme's scales — a hex or a role path never takes glass.
   */
  glass?: GlassLevel | undefined;
}
