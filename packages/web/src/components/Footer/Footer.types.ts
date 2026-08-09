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
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  className?: string | undefined;
}

export interface FooterLegalProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
}
