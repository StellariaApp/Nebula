import type { ReactNode } from "react";

import type { RadiusName, ShadowLevel, Unit } from "@stellaria/nebula-tokens";

export interface CardProps {
  children: ReactNode;
  radius?: RadiusName | undefined;
  shadow?: ShadowLevel | "none" | undefined;
  padding?: "none" | "sm" | "md" | "lg" | undefined;
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
