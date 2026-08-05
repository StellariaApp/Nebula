import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";

export interface HeaderLabels {
  back: string;
}

export type HeaderOrder = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeaderProps extends Omit<StyleProps, "color"> {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  order?: HeaderOrder | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  withBack?: boolean | undefined;
  onBack?: (() => void) | undefined;
  backIcon?: ReactNode | undefined;
  labels?: Partial<HeaderLabels> | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
  rowProps?: ComponentPropsWithoutRef<"div"> | undefined;
  leadProps?: ComponentPropsWithoutRef<"div"> | undefined;
  headingProps?: ComponentPropsWithoutRef<"div"> | undefined;
  trailProps?: ComponentPropsWithoutRef<"div"> | undefined;
  bodyProps?: ComponentPropsWithoutRef<"div"> | undefined;
  titleProps?: ComponentPropsWithoutRef<"h1"> | undefined;
  subtitleProps?: ComponentPropsWithoutRef<"p"> | undefined;
  backProps?: ActionIconProps | undefined;
}
