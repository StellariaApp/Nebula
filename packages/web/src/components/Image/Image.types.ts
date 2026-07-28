import type { ReactNode } from "react";

import type { RadiusName, Unit } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export interface ImageProps extends Omit<StyleProps, "color"> {
  src?: string | undefined;
  alt: string;
  width?: Unit | undefined;
  height?: Unit | undefined;
  fit?: ImageFit | undefined;
  radius?: RadiusName | Unit | undefined;
  fallback?: ReactNode | undefined;
  placeholder?: ReactNode | undefined;
  loading?: "eager" | "lazy" | undefined;
  className?: string | undefined;
}

export interface BackgroundImageProps {
  src: string;
  children?: ReactNode | undefined;
  radius?: RadiusName | Unit | undefined;
  overlay?: boolean | number | undefined;
  className?: string | undefined;
}
