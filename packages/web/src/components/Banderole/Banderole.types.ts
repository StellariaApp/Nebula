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
  /** Envoltorio del icono, si lo hay. */
  iconProps?: BoxSlotProps | undefined;
  /** Envoltorio del contenido. */
  bodyProps?: BoxSlotProps | undefined;
  /** Envoltorio de las acciones, si las hay. */
  actionsProps?: BoxSlotProps | undefined;
}
