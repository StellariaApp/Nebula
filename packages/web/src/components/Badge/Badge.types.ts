import type { ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type BadgeVariant = Extract<Variant, "filled" | "outline" | "light" | "ghost" | "gradient">;

export interface BadgeProps extends StyleProps {
  /**
   * The label. A badge is a `span` with no role of its own, so this text is all a screen reader
   * gets — a status shown by colour alone does not reach one.
   */
  children?: ReactNode | undefined;
  /**
   * How the pill is filled. `"light"` is the tinted wash that sits in a table or a list without
   * competing with the row; the solid ones pull enough attention to read as a control.
   * @default "light"
   */
  variant?: BadgeVariant | undefined;
  /**
   * Puts a coloured dot before the label, taking the 600 step of `color` regardless of how pale the
   * variant is. It is the status cue that survives a `"light"` badge on a busy row.
   * @default false
   */
  dot?: boolean | undefined;
  /**
   * The scale the variant and the dot draw from. It is also the whole semantic signal of a status
   * badge, which is why the label has to repeat it in words.
   * @default "primary"
   */
  color?: ColorExtended | undefined;
  /**
   * Height, padding and type of the pill together. It does not follow the text it sits beside, so a
   * badge inside small print has to be stepped down by hand.
   * @default "md"
   */
  size?: Size | undefined;
  /** How round the pill is. @default "full" */
  radius?: "sm" | "md" | "full" | undefined;
  /**
   * An adornment before the label. It is `aria-hidden`, so it can only repeat what the label says.
   */
  leftSection?: ReactNode | undefined;
  /**
   * The same after the label, but this one is NOT `aria-hidden` — it is read out, which is what
   * makes it the place for a count or a dismiss control rather than a decorative glyph.
   */
  rightSection?: ReactNode | undefined;
  /** Stretches the pill to its container instead of hugging the label. @default false */
  fullWidth?: boolean | undefined;
  className?: string | undefined;
  /** The colour dot. Only rendered with `dot`; its colour comes from the scale, not from the stylesheet. */
  dotProps?: BoxSlotProps | undefined;
  /** Wrapper for `leftSection`. */
  leftSectionProps?: BoxSlotProps | undefined;
  /** Wrapper for `rightSection`. */
  rightSectionProps?: BoxSlotProps | undefined;
}
