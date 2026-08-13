import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { SpacingValue, Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface FooterProps extends StyleProps {
  /** The column grid. Not rendered when there are no columns. */
  columnsProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  contentWidth?: Unit | undefined;
  spacing?: SpacingValue | undefined;
  sticky?: boolean | undefined;
  glass?: boolean | undefined;
  withBorder?: boolean | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface FooterBrandProps extends StyleProps {
  /**
   * The brand link that wraps the logo. Only rendered with `logo`. Its element comes from
   * `component`, or from `href`: with `href` it is an `a`, without it a `span`. Neither goes
   * through `Box`, so it does not accept style props.
   */
  linkProps?: ComponentPropsWithoutRef<"a"> | undefined;
  /** The description under the brand, when there is one. */
  descriptionProps?: TextSlotProps | undefined;
  children?: ReactNode | undefined;
  logo?: ReactNode | undefined;
  description?: ReactNode | undefined;
  href?: string | undefined;
  component?: ElementType | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface FooterGroupProps extends StyleProps {
  /** The group title, when there is one. */
  titleProps?: TextSlotProps | undefined;
  /**
   * The link list. It appears as soon as one child is a `Footer.Group.Link`, and then wraps them
   * all; with none, they render loose.
   */
  listProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  title?: ReactNode | undefined;
  className?: string | undefined;
}

export interface FooterLinkProps extends StyleProps {
  /** The link text. */
  children?: ReactNode | undefined;
  /**
   * The element it paints, and where a router link plugs in. Left alone it follows `href`, so this
   * is only needed for a framework's own link component.
   * @default "a" with an `href`, "button" without one
   */
  component?: ElementType | undefined;
  /**
   * Where it goes. Its presence is what decides the element: with it the item is an anchor, without
   * it a button — which is why a link that only runs a handler still gets the right semantics.
   */
  href?: string | undefined;
  /** Runs on click. It does not replace `href`: with both, the navigation still happens. */
  onPress?: (() => void) | undefined;
  /** Lands on the link itself, not on the list item that wraps it. */
  className?: string | undefined;
}

export interface FooterLegalProps extends StyleProps {
  /** The fine print — copyright, company details, the line that has to be there. */
  children?: ReactNode | undefined;
  className?: string | undefined;
}
