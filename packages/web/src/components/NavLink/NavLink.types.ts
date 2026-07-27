import type { ReactNode } from "react";

import type { SemanticScaleName } from "@stellaria/nebula-tokens";

export interface NavLinkProps {
  label: ReactNode;
  description?: ReactNode | undefined;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  color?: SemanticScaleName | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  children?: ReactNode | undefined;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  className?: string | undefined;
}
