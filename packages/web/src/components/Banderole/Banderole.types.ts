import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

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
  /** Wrapper for the icon, when there is one. */
  iconProps?: BoxSlotProps | undefined;
  /** Envoltorio del contenido. */
  bodyProps?: BoxSlotProps | undefined;
  /** Wrapper for the actions, when there are any. */
  actionsProps?: BoxSlotProps | undefined;
}
