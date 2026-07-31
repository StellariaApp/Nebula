import type { ReactNode } from "react";

import type { RadiusName } from "@stellaria/nebula-tokens";

import type { LightboxImage, LightboxLabels } from "../Lightbox/Lightbox.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface ImageGalleryProps extends Omit<StyleProps, "color"> {
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
