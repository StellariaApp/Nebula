import type { ReactNode } from "react";

import type { Size, SizeValue } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type ModalSize = Size;

export type ModalSide = "start" | "end" | "top" | "bottom";

export interface ModalProps extends StyleProps {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  size?: SizeValue | undefined;
  fullScreen?: boolean | undefined;
  blurred?: boolean | undefined;
  drawer?: boolean | ModalSide | undefined;
  centered?: boolean | undefined;
  closeOnClickOutside?: boolean | undefined;
  closeOnEscape?: boolean | undefined;
  withCloseButton?: boolean | undefined;
  closeLabel?: string | undefined;
  padding?: "none" | "sm" | "md" | "lg" | undefined;
  radius?: "none" | "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
  /** Fila de cabecera: encabezado a la izquierda, boton de cierre a la derecha. */
  headerProps?: BoxSlotProps | undefined;
  /** Columna de titulo y subtitulo, dentro de la cabecera. */
  headingProps?: BoxSlotProps | undefined;
  /** El titulo. Se esparce DESPUES de las props de aria, asi que el consumidor gana. */
  titleProps?: TextSlotProps | undefined;
  /** El subtitulo, si lo hay. */
  subtitleProps?: TextSlotProps | undefined;
  /** El cuerpo. Su relleno lo gobierna `padding`; la ranura se compone con el, no lo pisa. */
  bodyProps?: BoxSlotProps | undefined;
  /** El pie, si hay `footer`. */
  footerProps?: BoxSlotProps | undefined;
  bodyClassName?: string | undefined;
  "aria-label"?: string | undefined;
}
