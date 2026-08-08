import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface LightboxImage {
  src: string;
  alt?: string | undefined;
  thumbnail?: string | undefined;
  caption?: ReactNode | undefined;
}

export interface LightboxLabels {
  region: string;
  close: string;
  previous: string;
  next: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  play: string;
  pause: string;
  counter: (index: number, total: number) => string;
  zoomLevel: (percent: number) => string;
}

export interface LightboxProps extends StyleProps {
  images: readonly LightboxImage[];
  opened: boolean;
  onClose: () => void;
  index?: number | undefined;
  defaultIndex?: number | undefined;
  onIndexChange?: ((index: number) => void) | undefined;
  withZoom?: boolean | undefined;
  withSlideshow?: boolean | undefined;
  withThumbnails?: boolean | undefined;
  /** @default 4000 */
  slideshowInterval?: number | undefined;
  /** @default 4 */
  maxZoom?: number | undefined;
  labels?: Partial<LightboxLabels> | undefined;
  className?: string | undefined;
  /** El aviso de galeria vacia. Sustituye a todo lo demas cuando no hay imagenes. */
  emptyProps?: TextSlotProps | undefined;
  /** El escenario donde vive la imagen. Lleva el foco y los gestos de zoom. */
  stageProps?: BoxSlotProps | undefined;
  /** La imagen. Lleva `data-panning`, que es lo que cambia su cursor al arrastrar. */
  imageProps?: ComponentPropsWithoutRef<"img"> | undefined;
  /** El pie de la imagen, si la trae. */
  captionProps?: TextSlotProps | undefined;
  /** La barra de controles. */
  barProps?: BoxSlotProps | undefined;
  /** Cada grupo de la barra. Se esparce sobre LOS DOS, el de navegacion y el de zoom. */
  groupProps?: BoxSlotProps | undefined;
  /** El contador de posicion. */
  counterProps?: TextSlotProps | undefined;
  /** La tira de miniaturas. Solo con `withThumbnails` y mas de una imagen. */
  filmstripProps?: BoxSlotProps | undefined;
  /** Cada miniatura. Se esparce sobre todas; la actual lleva `aria-current`. */
  thumbProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** La imagen de cada miniatura. */
  thumbImageProps?: ComponentPropsWithoutRef<"img"> | undefined;
}
