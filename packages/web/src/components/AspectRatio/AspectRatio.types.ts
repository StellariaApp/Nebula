import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface AspectRatioOwnProps extends Omit<BoxOwnProps, "component"> {
  /** The element it paints. @default "div" */
  component?: ElementType | undefined;
  /**
   * Width divided by height — `16 / 9` for video, `1` for a square. It reserves the height from the
   * width before the content loads, which is what keeps an image or an iframe from shifting the
   * page as it arrives. @default 1
   */
  ratio?: number | undefined;
}

export type AspectRatioProps<C extends ElementType = "div"> = AspectRatioOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof AspectRatioOwnProps | "component">;
