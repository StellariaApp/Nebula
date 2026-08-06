import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

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
  slideshowInterval?: number | undefined;
  maxZoom?: number | undefined;
  labels?: Partial<LightboxLabels> | undefined;
  className?: string | undefined;
}
