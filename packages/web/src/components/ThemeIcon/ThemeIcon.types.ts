import type { ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type ThemeIconVariant = Extract<
  Variant,
  "filled" | "outline" | "light" | "ghost" | "gradient"
>;

export interface ThemeIconProps extends StyleProps {
  /**
   * The glyph. It is centred and takes `currentColor` from the variant, so an icon drawn with
   * `fill="currentColor"` follows the palette without being told; one with a baked-in colour will
   * not, and stops answering to the theme.
   */
  children?: ReactNode | undefined;
  /**
   * How the tile is filled. `"light"` is the tinted wash meant to sit in body copy without shouting;
   * `"filled"` and `"gradient"` are loud enough to read as a control, so avoid them where the icon
   * is not one.
   * @default "light"
   */
  variant?: ThemeIconVariant | undefined;
  /**
   * The scale the variant draws from. Background, foreground and border are picked together for the
   * pair to stay legible, which is why the variant, not this, decides how strong it looks.
   * @default "primary"
   */
  color?: ColorExtended | undefined;
  /**
   * The tile's fixed square, in both axes at once, and the glyph's font size with it. The tile never
   * shrinks in a flex row, so it is the text beside it that gives way when space runs out.
   * @default "md"
   */
  size?: Size | undefined;
  /**
   * How round the tile is. `"full"` makes it a circle — the usual pick for an avatar-like badge.
   * @default "md"
   */
  radius?: "sm" | "md" | "full" | undefined;
  /**
   * Names the icon for assistive tech, turning it into an `img` role. Without it the tile is
   * `aria-hidden`, which is the right answer next to a visible label and the wrong one when the
   * icon is the only thing carrying the meaning.
   */
  label?: string | undefined;
  className?: string | undefined;
}
