import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type BanderoleVariant = Extract<Variant, "filled" | "outline" | "light" | "glass">;

export interface BanderoleProps extends StyleProps {
  children: ReactNode;
  variant?: BanderoleVariant | undefined;
  color?: ColorExtended | undefined;
  icon?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  onClose?: (() => void) | undefined;
  label?: string | undefined;
  closeLabel?: string | undefined;
  sticky?: boolean | undefined;
  className?: string | undefined;
}
