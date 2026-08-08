import type { ReactNode } from "react";

import type { RadiusName, Unit } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export interface ImageProps extends StyleProps {
  /**
   * El hueco de estado. Se comparte entre DOS casos: el marcador de posicion mientras carga y el
   * texto de reserva cuando falla o falta `src`. La imagen no lleva ranura: la anima motion al
   * aparecer, y su ajuste, su radio y su tamano ya son props.
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
  /** El velo sobre la imagen. Solo se pinta con `overlay`, y de ahi sale su opacidad. */
  overlayProps?: BoxSlotProps | undefined;
  /** La caja del contenido, por encima del velo. */
  contentProps?: BoxSlotProps | undefined;
  src: string;
  children?: ReactNode | undefined;
  radius?: RadiusName | Unit | undefined;
  overlay?: boolean | number | undefined;
  className?: string | undefined;
}
