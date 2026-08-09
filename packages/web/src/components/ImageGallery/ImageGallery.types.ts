import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { RadiusName } from "@stellaria/nebula-tokens";

import type { LightboxImage, LightboxLabels } from "../Lightbox/Lightbox.types.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface ImageGalleryProps extends StyleProps {
  /**
   * Every tile. It spreads over ALL of them, and serves two elements: a `button` when the tile opens
   * the viewer or there is an `onSelect`, and a `div` when it leads nowhere.
   */
  tileProps?: BoxSlotProps | undefined;
  /** The thumbnail of each tile. Its `alt` comes from the image, and it is only rendered when the tile is not pressable. */
  tileImageProps?: ComponentPropsWithoutRef<"img"> | undefined;
  images: readonly LightboxImage[];
  cols?: number | undefined;
  /** @default 160 */
  minColWidth?: number | undefined;
  gap?: "xs" | "sm" | "md" | "lg" | undefined;
  /** @default 4 / 3 */
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
