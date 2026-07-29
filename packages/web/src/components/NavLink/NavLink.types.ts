import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type NavLinkVariant = Extract<Variant, "filled" | "light" | "ghost">;

export interface NavLinkProps extends Omit<StyleProps, "color"> {
  label: ReactNode;
  description?: ReactNode | undefined;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  variant?: NavLinkVariant | undefined;
  color?: ColorExtended | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  children?: ReactNode | undefined;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  className?: string | undefined;
}
