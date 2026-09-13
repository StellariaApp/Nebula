import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

export interface CutoutFigurePosition {
  top?: number | string | undefined;
  bottom?: number | string | undefined;
  left?: number | string | undefined;
  right?: number | string | undefined;
  /** Moves the figure after it is placed. Numbers are px; strings pass through (`"4%"`). */
  translate?: { x?: number | string | undefined; y?: number | string | undefined } | undefined;
  /** Rotates the figure, in CSS angles (`"-6deg"`). */
  rotate?: { x?: string | undefined; y?: string | undefined; z?: string | undefined } | undefined;
}

export interface CutoutProps extends StyleProps {
  /**
   * What fills the box, as a node: a `next/image` with `fill`, the catalogue `Image`, a plain
   * `<img>`. The box gives it the frame — `position: relative; overflow: hidden` and the corners of
   * `r` — and a plain `<img>` inside it is made to cover. It is a slot so the component depends on
   * no framework and no CDN.
   */
  background?: ReactNode | undefined;
  /** The cut-out figure, laid over the background as an absolutely positioned `<img>`. */
  figure?: string | undefined;
  /** Its alt. Empty by default: the figure is decoration over a background that already says it. */
  figureAlt?: string | undefined;
  /** The figure's width as a fraction of the box. @default 1 */
  figureSize?: number | undefined;
  /** Where the figure sits. Bottom-right by default: `{ bottom: 0, right: 0 }`. */
  figurePosition?: CutoutFigurePosition | undefined;
  /** Anything else over the figure: a caption, a badge. */
  children?: ReactNode | undefined;
  className?: string | undefined;
  /** The wrapper of the background slot. */
  backgroundProps?: BoxSlotProps | undefined;
  /** The figure `<img>`. */
  figureProps?: Omit<ComponentPropsWithoutRef<"img">, "src" | "alt"> | undefined;
}
