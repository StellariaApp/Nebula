import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { AnchorProps } from "../Anchor/Anchor.types.js";
import type { ThemeIconProps } from "../ThemeIcon/ThemeIcon.types.js";

export interface FeatureProps extends Omit<StyleProps, "color" | "align"> {
  title: ReactNode;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  color?: ColorExtended | undefined;
  href?: string | undefined;
  linkText?: ReactNode | undefined;
  align?: "start" | "center" | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  titleProps?: ComponentPropsWithoutRef<"p"> | undefined;
  descriptionProps?: ComponentPropsWithoutRef<"p"> | undefined;
  iconProps?: ThemeIconProps | undefined;
  linkProps?: AnchorProps | undefined;
}
