import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface BoxOwnProps extends StyleProps {
  /**
   * The element it paints. Everything else about `Box` is style, so this is what decides its
   * semantics: without it you get a `div`, which is right for a wrapper and wrong for anything a
   * screen reader should announce. The DOM props it accepts follow from this. @default "div"
   */
  component?: ElementType | undefined;
  children?: ReactNode | undefined;
  /** Composes with the classes `Box` computes instead of replacing them. */
  className?: string | undefined;
}

export type BoxProps<C extends ElementType = "div"> = BoxOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof BoxOwnProps | "component">;

/**
 * Props of a slot the component renders with a `Box`: it accepts the system style props — `p`, `bg`,
 * `r`, responsive included — and the DOM attributes of the element. It spreads **after** whatever the
 * component computes, so the consumer wins; `className` is the exception and composes.
 */
export type BoxSlotProps = BoxOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof BoxOwnProps>;
