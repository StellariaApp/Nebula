import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface BreadcrumbItem {
  key: string;
  label: ReactNode;
  href?: string | undefined;
  onSelect?: (() => void) | undefined;
  icon?: ReactNode | undefined;
  /** Router adapter: the component depends on neither Next nor any other router. */
  component?: ElementType | undefined;
}

export interface BreadcrumbsLabels {
  nav: string;
  collapsed: string;
}

export interface BreadcrumbsProps extends StyleProps {
  items: readonly BreadcrumbItem[];
  separator?: ReactNode | undefined;
  /** How many items it takes before the middle ones collapse. `0` turns collapsing off.
   * @default 5
   */
  collapseFrom?: number | undefined;
  size?: "sm" | "md" | undefined;
  labels?: Partial<BreadcrumbsLabels> | undefined;
  className?: string | undefined;
  /** The list. */
  listProps?: BoxSlotProps | undefined;
  /** Every crumb. It spreads over ALL of them, including the ellipsis one. */
  itemProps?: BoxSlotProps | undefined;
  /** The button that reveals the hidden crumbs. It only appears when the trail collapses. */
  expandProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The separator. It spreads over all of them; the last one is not rendered. */
  separatorProps?: BoxSlotProps | undefined;
  /** The current crumb, which carries `aria-current` and is not a link. */
  currentProps?: BoxSlotProps | undefined;
  /**
   * The navigable crumbs. It does not land on the current one. Their element comes from the
   * `component` of each item, or from its `href`: with `href` it is an `a`, without it a `button`.
   * It does not go through `Box`, so it does not accept style props.
   */
  linkProps?: ComponentPropsWithoutRef<"a"> | undefined;
}
