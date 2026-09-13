import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

/** One piece of the viewer: an image, and only an image (ADR-196). */
export interface ViewerImage {
  src: string;
  alt: string;
  /** The small one for the strip. Falls back to `src`. */
  thumbnail?: string | undefined;
}

export interface ViewerLabels {
  region: string;
  close: string;
  previous: string;
  next: string;
  download: string;
  counter: (position: number, total: number) => string;
}

export interface ViewerProps extends StyleProps {
  images: readonly ViewerImage[];
  /** Controlled: whoever opens the viewer knows the piece and arms `actions` for it. */
  index: number;
  onIndexChange: (index: number) => void;
  opened: boolean;
  onClose: () => void;
  /** A line beside the counter: whose the piece is, what state it is in. */
  caption?: ReactNode | undefined;
  /** Actions on the piece in view, in the top bar beside the close button. */
  actions?: ReactNode | undefined;
  /** A real `<a download>` for the piece in view. Nothing else in the catalogue saves a file. */
  withDownload?: boolean | undefined;
  labels?: Partial<ViewerLabels> | undefined;
  className?: string | undefined;
  /** The stage the pieces slide on. It carries the pointer gestures. */
  stageProps?: BoxSlotProps | undefined;
  /** Every piece image. */
  imageProps?: ComponentPropsWithoutRef<"img"> | undefined;
  /** The top bar. */
  barProps?: BoxSlotProps | undefined;
  /** The counter pill. */
  counterProps?: TextSlotProps | undefined;
  /** The thumbnail strip. Only with more than one image. */
  stripProps?: BoxSlotProps | undefined;
  /** Every thumbnail button; the current one carries `aria-current`. */
  thumbProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The image of each thumbnail. */
  thumbImageProps?: ComponentPropsWithoutRef<"img"> | undefined;
}
