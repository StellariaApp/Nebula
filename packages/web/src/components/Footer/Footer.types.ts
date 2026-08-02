import type { ElementType, ReactNode } from "react";

import type { SpacingValue, Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface FooterProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  contentWidth?: Unit | undefined;
  spacing?: SpacingValue | undefined;
  sticky?: boolean | undefined;
  withBorder?: boolean | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface FooterBrandProps extends StyleProps {
  children?: ReactNode | undefined;
  logo?: ReactNode | undefined;
  description?: ReactNode | undefined;
  href?: string | undefined;
  component?: ElementType | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface FooterGroupProps extends StyleProps {
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
