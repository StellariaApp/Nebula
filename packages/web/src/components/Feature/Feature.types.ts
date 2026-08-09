import type { ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { AnchorSlotProps } from "../Anchor/Anchor.types.js";
import type { ThemeIconProps } from "../ThemeIcon/ThemeIcon.types.js";

export interface FeatureProps extends Omit<StyleProps, "align"> {
  title: ReactNode;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  color?: ColorExtended | undefined;
  href?: string | undefined;
  linkText?: ReactNode | undefined;
  align?: "start" | "center" | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  /** The title. The only node always rendered, because `title` is required. */
  titleProps?: TextSlotProps | undefined;
  /** The description. Only rendered with `description`. */
  descriptionProps?: TextSlotProps | undefined;
  /** The `ThemeIcon` wrapping the glyph. Only exists with `icon`, and it spreads AFTER the size, variant and colour the component sets, so it overrides them. */
  iconProps?: ThemeIconProps | undefined;
  /**
   * The footer link. Only exists with `href`, and `linkText` is its content. It spreads AFTER the
   * `href`, so it can override it.
   */
  linkProps?: AnchorSlotProps | undefined;
}
