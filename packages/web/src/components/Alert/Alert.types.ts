import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export type AlertVariant = Extract<Variant, "filled" | "outline" | "light" | "glass">;

export interface AlertProps extends StyleProps {
  children?: ReactNode | undefined;
  title?: ReactNode | undefined;
  color?: ColorExtended | undefined;
  variant?: AlertVariant | undefined;
  icon?: ReactNode | undefined;
  withCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
  closeLabel?: string | undefined;
  live?: "status" | "alert" | "off" | undefined;
  actions?: ReactNode | undefined;
  className?: string | undefined;
  /** El titulo. Su `id` es el que nombra la alerta por `aria-labelledby` y se escribe DESPUES de la ranura. Solo se pinta con `title`. */
  titleProps?: TextSlotProps | undefined;
  /** El glifo. Solo se pinta con `icon`, y va `aria-hidden`: quien informa es el texto. */
  iconProps?: BoxSlotProps | undefined;
  /** La columna que agrupa titulo, mensaje y acciones. Se pinta siempre. */
  bodyProps?: BoxSlotProps | undefined;
  /** El mensaje, que es `children`. No existe sin ellos. */
  messageProps?: BoxSlotProps | undefined;
  /** La fila de acciones. Solo con `actions`. El boton de cerrar no cae aqui ni tiene ranura: lo gobiernan `withCloseButton` y `closeLabel`. */
  actionsProps?: BoxSlotProps | undefined;
}
