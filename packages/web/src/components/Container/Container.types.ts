import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { Size, Unit } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface ContainerOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * The element it paints. `main` or `section` when the container IS the region, so the landmark
   * and the width live on one node instead of two. @default "div"
   */
  component?: ElementType | undefined;
  /**
   * Maximum width of the content. The named steps are reading measures, not breakpoints — `xs` 540,
   * `sm` 720, `md` 960, `lg` 1140, `xl` 1320 px — and any other length is taken as written.
   * @default "md"
   */
  size?: Size | Unit | undefined;
  /** Spans the full width, ignoring `size`, while keeping the horizontal padding. @default false */
  fluid?: boolean | undefined;
}

export type ContainerProps<C extends ElementType = "div"> = ContainerOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof ContainerOwnProps | "component">;
