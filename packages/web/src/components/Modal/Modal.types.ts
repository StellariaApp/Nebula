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
  /** El cuerpo, dentro del panel que dibuja el propio modal. Sobra cuando se pasa `content`. */
  children?: ReactNode | undefined;
  /**
   * El panel entero, traido por el consumidor.
   *
   * Con esto el modal **no dibuja panel**: se queda con lo que nadie quiere reescribir —el
   * `<dialog>` nativo, el foco atrapado, el bloqueo del scroll, el velo desenfocado, la entrada y
   * la salida animadas y el cierre por fuera— y suelta su superficie, su cabecera, su cuerpo y su
   * pie. Lo que se pase ocupa ese sitio tal cual, sin envoltorio.
   *
   * Es para cuando la ventana ya tiene una forma propia en el producto —una `Card` con su anillo de
   * degradado, por ejemplo— y meterla dentro del panel del modal dejaria una superficie sobre otra.
   *
   * Manda sobre `children`, `title`, `subtitle`, `footer`, `padding` y `withCloseButton`: con panel
   * propio, esas piezas las pone quien lo trae. **Y el nombre accesible tambien**: sin `title` no
   * hay de donde sacarlo, asi que pasa a hacer falta un `aria-label`.
   */
  content?: ReactNode | undefined;
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
  /** The header row: heading on the left, close button on the right. */
  headerProps?: BoxSlotProps | undefined;
  /** Title and subtitle column, inside the header. */
  headingProps?: BoxSlotProps | undefined;
  /** The title. It spreads AFTER the aria props, so the consumer wins. */
  titleProps?: TextSlotProps | undefined;
  /** The subtitle, when there is one. */
  subtitleProps?: TextSlotProps | undefined;
  /** The body. Its padding is governed by `padding`; the slot composes with it, it does not override it. */
  bodyProps?: BoxSlotProps | undefined;
  /** The footer, when there is a `footer`. */
  footerProps?: BoxSlotProps | undefined;
  bodyClassName?: string | undefined;
  "aria-label"?: string | undefined;
}
