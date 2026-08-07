import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { RadiusName } from "@stellaria/nebula-tokens";

import type { LightboxImage, LightboxLabels } from "../Lightbox/Lightbox.types.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface ImageGalleryProps extends StyleProps {
  /**
   * Cada casilla. Se esparce sobre TODAS, y sirve a dos elementos: es un `button` cuando la casilla
   * abre el visor o hay `onSelect`, y un `div` cuando no lleva a ninguna parte.
   */
  tileProps?: BoxSlotProps | undefined;
  /** La miniatura de cada casilla. Su `alt` sale de la imagen y solo se pinta si no es pulsable. */
  tileImageProps?: ComponentPropsWithoutRef<"img"> | undefined;
  images: readonly LightboxImage[];
  cols?: number | undefined;
  minColWidth?: number | undefined;
  gap?: "xs" | "sm" | "md" | "lg" | undefined;
  ratio?: number | undefined;
  radius?: RadiusName | undefined;
  withLightbox?: boolean | undefined;
  withThumbnails?: boolean | undefined;
  withSlideshow?: boolean | undefined;
  onSelect?: ((index: number) => void) | undefined;
  label?: string | undefined;
  empty?: ReactNode | undefined;
  labels?: Partial<LightboxLabels> | undefined;
  className?: string | undefined;
}
