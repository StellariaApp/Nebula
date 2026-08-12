import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

export type ListType = "ordered" | "unordered";

export interface ListOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * The element it paints. Left alone it follows `type`, so set it only to keep the list styling on
   * another tag — and remember that a list that is not `ul` or `ol` stops being announced as one.
   * @default "ul"
   */
  component?: ElementType | undefined;
  /**
   * Whether the list is numbered, which is what picks `ol` over `ul`. It changes the semantics, not
   * the look: use it when the order carries meaning, not to get numbers.
   * @default "unordered"
   */
  type?: ListType | undefined;
  /**
   * Gap under each item, applied to the direct `li` children only and cleared on the last one, so a
   * nested list keeps its own rhythm instead of inheriting this one.
   * @default "xs"
   */
  spacing?: SpacingValue | undefined;
  /**
   * Restores the indent the component strips, and with it hangs the markers outside the text block
   * so wrapped lines line up under each other. Prose wants it on; a list used as layout does not.
   * @default false
   */
  withPadding?: boolean | undefined;
  /**
   * One glyph to replace the native markers across the list, laying every item out as icon beside
   * content. It reaches items by cloning the direct children, so an item that brings its own `icon`
   * keeps it and an item wrapped in another component never receives one.
   */
  icon?: ReactNode | undefined;
}

export type ListProps<C extends ElementType = "ul"> = ListOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof ListOwnProps | "component">;

export interface ListItemOwnProps extends Omit<BoxOwnProps, "component"> {
  /** Wrapper for the icon. Only rendered when the item has an `icon`. */
  iconProps?: BoxSlotProps | undefined;
  /** The element it paints. @default "li" */
  component?: ElementType | undefined;
  /**
   * This item's own glyph, which beats the one the parent `List` hands down. It is `aria-hidden`
   * and it replaces the marker, so whatever it stands for has to be in the item's text as well.
   */
  icon?: ReactNode | undefined;
}

export type ListItemProps<C extends ElementType = "li"> = ListItemOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof ListItemOwnProps | "component">;
