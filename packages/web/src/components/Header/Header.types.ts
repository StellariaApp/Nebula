import type { ElementType, ReactNode } from "react";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";

export interface HeaderLabels {
  back: string;
}

export type HeaderOrder = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeaderProps extends StyleProps {
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
  rowProps?: BoxSlotProps | undefined;
  leadProps?: BoxSlotProps | undefined;
  headingProps?: BoxSlotProps | undefined;
  trailProps?: BoxSlotProps | undefined;
  bodyProps?: BoxSlotProps | undefined;
  titleProps?: TextSlotProps | undefined;
  subtitleProps?: TextSlotProps | undefined;
  backProps?: ActionIconProps | undefined;
}
