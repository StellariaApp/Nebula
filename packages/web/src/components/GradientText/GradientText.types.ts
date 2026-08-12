import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { ColorExtended, GradientRole } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";
import type { GradientProp } from "../../theme/resolve-variant.js";

export interface GradientTextOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * The element it paints — inline, so a gradient run can sit inside a heading. Keep the text short
   * whatever tag you pick: the clip works per line box, so a paragraph gets the whole gradient over
   * again on every single line.
   * @default "span"
   */
  component?: ElementType | undefined;
  /**
   * A theme gradient role, or a literal `{ from, to }` pair. The role is resolved against the live
   * theme and follows a theme switch; a literal pair is frozen where you wrote it.
   * @default "brand"
   */
  gradient?: GradientRole | GradientProp | undefined;
  /**
   * The colour painted whenever the clip cannot be: no browser support, Windows forced colors, and
   * the underline, which would otherwise be clipped away to nothing. It is not decoration — clipped
   * text is transparent, so this is the only thing between a failed gradient and invisible text.
   * @default "text.primary"
   */
  fallbackColor?: ColorExtended | undefined;
  /**
   * Takes family, size, weight, line height and tracking from the parent instead of the component's
   * own. What you want for a gradient word inside a heading, so it does not resize the line.
   */
  inherit?: boolean | undefined;
}

export type GradientTextProps<C extends ElementType = "span"> = GradientTextOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GradientTextOwnProps | "component">;
