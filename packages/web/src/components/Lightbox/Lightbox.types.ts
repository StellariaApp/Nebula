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
  /** The empty-gallery notice. It replaces everything else when there are no images. */
  emptyProps?: TextSlotProps | undefined;
  /** The stage the image lives on. It carries the focus and the zoom gestures. */
  stageProps?: BoxSlotProps | undefined;
  /** The image. It carries `data-panning`, which is what changes its cursor while dragging. */
  imageProps?: ComponentPropsWithoutRef<"img"> | undefined;
  /** The image caption, when it has one. */
  captionProps?: TextSlotProps | undefined;
  /** The control bar. */
  barProps?: BoxSlotProps | undefined;
  /** Each group in the bar. It spreads over BOTH, the navigation one and the zoom one. */
  groupProps?: BoxSlotProps | undefined;
  /** The position counter. */
  counterProps?: TextSlotProps | undefined;
  /** The thumbnail strip. Only with `withThumbnails` and more than one image. */
  filmstripProps?: BoxSlotProps | undefined;
  /** Every thumbnail. It spreads over all of them; the current one carries `aria-current`. */
  thumbProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The image of each thumbnail. */
  thumbImageProps?: ComponentPropsWithoutRef<"img"> | undefined;
}
