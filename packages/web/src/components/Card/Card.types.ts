import type { ReactNode } from "react";

import type { RadiusName, ShadowLevel, Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface CardProps extends Omit<StyleProps, "shadow"> {
  children: ReactNode;
  radius?: RadiusName | undefined;
  shadow?: ShadowLevel | "none" | undefined;
  padding?: "none" | "md" | "lg" | "xl" | undefined;
  withBorder?: boolean | undefined;
  interactive?: boolean | undefined;
  onPress?: (() => void) | undefined;
  href?: string | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface CardSectionProps {
  children: ReactNode;
  inset?: boolean | undefined;
  withBorder?: boolean | undefined;
  className?: string | undefined;
}

export interface CardImageProps {
  src?: string | undefined;
  alt: string;
  height?: Unit | undefined;
  className?: string | undefined;
}

export interface CardSlotProps {
  children: ReactNode;
  className?: string | undefined;
}
