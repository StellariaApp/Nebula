import type { ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { ButtonCloseProps } from "../ButtonClose/ButtonClose.types.js";

export type TagVariant = Extract<Variant, "filled" | "outline" | "light" | "ghost">;

export interface TagProps extends StyleProps {
  children?: ReactNode | undefined;
  variant?: TagVariant | undefined;
  color?: ColorExtended | undefined;
  size?: Size | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  leftSection?: ReactNode | undefined;
  onRemove?: (() => void) | undefined;
  removeLabel?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  /** Envoltorio de `leftSection`. */
  sectionProps?: BoxSlotProps | undefined;
  /** El rotulo, que es el contenido de la etiqueta. */
  labelProps?: TextSlotProps | undefined;
  /** El boton de quitar. Solo se pinta si hay `onRemove`. */
  removeProps?: ButtonCloseProps | undefined;
}
