import type { ReactNode } from "react";

import type { SemanticScaleName } from "@stellaria/nebula-tokens";

export interface NavLinkOwnProps {
  label: ReactNode;
  description?: ReactNode | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  color?: SemanticScaleName | undefined;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  children?: ReactNode | undefined;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenedChange?: ((opened: boolean) => void) | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export type NavLinkProps = NavLinkOwnProps;
