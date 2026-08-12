import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

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
import type { TextSlotProps } from "../Text/Text.types.js";

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

export interface ButtonProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled" | MotionConflictingProps>,
    StyleProps,
    PressLifecycleProps,
    PermissionProps {
  /**
   * The element it renders. With anything other than `button` — an `a` for a CTA that navigates, a
   * router `Link` — React Aria adds the `role`, the `tabIndex` and the Space and Enter handling, so
   * the keyboard contract does not degrade. The `type` is only written when the element is a button.
   */
  component?: ElementType | undefined;
  /** Only has an effect with `component`: these are the attributes of the element you chose. */
  href?: string | undefined;
  /** Envoltorio de `leftSection`. */
  leftSectionProps?: BoxSlotProps | undefined;
  /** Envoltorio de `rightSection`. */
  rightSectionProps?: BoxSlotProps | undefined;
  /**
   * The label, which wraps `children`. With `loading` it dims alongside the sections, which is how
   * the button makes room for the spinner without changing size.
   */
  labelProps?: TextSlotProps | undefined;
  /**
   * The recipe the theme resolves background, border, glow and glass from, all at once. It is the
   * variant and not `color` that decides how loudly the button reads, so a secondary action stays
   * secondary whatever scale you tint it with.
   * @default "filled"
   */
  variant?: Variant | undefined;
  /**
   * The control's height and padding. The label does not carry its own type scale — it inherits the
   * button's — so this is the one step that resizes the whole thing.
   * @default "md"
   */
  size?: Size | undefined;
  /**
   * Overrides the glass step the variant's recipe asks for. It is ignored in three cases that are
   * not errors: a variant whose recipe has no glass, a theme with `effects.glass.enabled` off, and
   * a `color` that is not one of the theme's scales — a hex or a role path never takes glass.
   */
  glass?: GlassLevel | undefined;
  /**
   * The scale the variant draws from. Name the scale and let the variant pick the steps out of it;
   * pinning a step here is what breaks the hover and active states, which are derived from it.
   * @default "primary"
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
   * @default false
   */
  disabled?: boolean | undefined;
  /**
   * Lays a spinner over the button, marks it `aria-busy` and disables it. Label and sections dim in
   * place instead of being removed, so the button holds its width while the work runs.
   * @default false
   */
  loading?: boolean | undefined;
  /** Stretches the button to its container instead of hugging the label. @default false */
  fullWidth?: boolean | undefined;
  /**
   * An adornment before the label. It is `aria-hidden`, so it can only ever repeat what the label
   * already says — an icon that carries meaning of its own belongs in the label.
   */
  leftSection?: ReactNode | undefined;
  /** The same after the label, and `aria-hidden` for the same reason. */
  rightSection?: ReactNode | undefined;
  /**
   * The label. It is wrapped in a `Text` that inherits, so it takes the button's own type instead of
   * imposing paragraph type on it.
   */
  children?: ReactNode | undefined;
}
