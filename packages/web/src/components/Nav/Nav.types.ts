import type { ElementType, ReactNode } from "react";

import type { ColorExtended, Unit, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type NavSize = "sm" | "md" | "lg";

export type NavActiveMode = "auto" | "hash" | "pathname" | "manual";

export type NavResolvedMode = Exclude<NavActiveMode, "auto">;

export type NavLinksAlign = "start" | "center" | "end";

export interface NavLabels {
  links: string;
}

export interface NavProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  size?: NavSize | undefined;
  withBorder?: boolean | undefined;
  contentWidth?: Unit | undefined;
  floating?: boolean | undefined;
  sticky?: boolean | undefined;
  scrolled?: boolean | undefined;
  scrollThreshold?: number | undefined;
  floatingWidth?: Unit | undefined;
  floatingGap?: Unit | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavLogoProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  href?: string | undefined;
  height?: Unit | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavLinksProps extends Omit<StyleProps, "color" | "align"> {
  children?: ReactNode | undefined;
  active?: string | undefined;
  activeMode?: NavActiveMode | undefined;
  align?: NavLinksAlign | undefined;
  spyOffset?: number | undefined;
  variant?: Variant | undefined;
  color?: ColorExtended | undefined;
  withIndicator?: boolean | undefined;
  labels?: Partial<NavLabels> | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavLinkItemProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  href?: string | undefined;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  onPress?: (() => void) | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavSlotProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export interface NavDividerProps extends StyleProps {
  className?: string | undefined;
}
