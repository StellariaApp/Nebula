import type { ReactNode } from "react";

import type { RadiusName, Unit } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export interface ImageProps extends StyleProps {
  /**
   * The state slot. It is shared by TWO cases: the placeholder while loading and the fallback text
   * when `src` fails or is missing. The image has no slot: motion animates it as it appears, and its
   * fit, radius and size are already props.
   */
  stateProps?: BoxSlotProps | undefined;
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
  /** The veil over the image. Only rendered with `overlay`, which is where its opacity comes from. */
  overlayProps?: BoxSlotProps | undefined;
  /** The content box, above the veil. */
  contentProps?: BoxSlotProps | undefined;
  src: string;
  children?: ReactNode | undefined;
  radius?: RadiusName | Unit | undefined;
  overlay?: boolean | number | undefined;
  className?: string | undefined;
}
