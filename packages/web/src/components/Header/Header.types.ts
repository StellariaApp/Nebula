import type { ElementType, ReactNode } from "react";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";

export interface HeaderLabels {
  back: string;
}

export type HeaderOrder = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeaderProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  order?: HeaderOrder | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  withBack?: boolean | undefined;
  onBack?: (() => void) | undefined;
  backIcon?: ReactNode | undefined;
  labels?: Partial<HeaderLabels> | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
  /** La fila que reparte el ancho entre el grupo izquierdo, el encabezado y el derecho. `children` cuelga por debajo de ella, no dentro. */
  rowProps?: BoxSlotProps | undefined;
  /** El grupo de la izquierda. No se pinta sin `withBack` ni `leftSection`. */
  leadProps?: BoxSlotProps | undefined;
  /** La columna de titulo y subtitulo. No se pinta sin `title` ni `subtitle`. */
  headingProps?: BoxSlotProps | undefined;
  /** El grupo de la derecha. Solo se pinta con `rightSection`. */
  trailProps?: BoxSlotProps | undefined;
  /** La banda bajo la fila, que es donde cae `children`. No existe sin ellos. */
  bodyProps?: BoxSlotProps | undefined;
  /** El titulo. Su etiqueta sale de `order` (`h1`-`h6`), asi que `component` aqui la cambia sin cambiar el nivel que se anuncia. Con `component` en el propio `Header`, su `id` nombra la region y se escribe DESPUES de la ranura para que no se pueda pisar. */
  titleProps?: TextSlotProps | undefined;
  /** El subtitulo. Solo se pinta con `subtitle`. */
  subtitleProps?: TextSlotProps | undefined;
  /** El boton de volver. Solo existe con `withBack`, y se esparce DESPUES del manejador y del rotulo, asi que puede sustituir los dos; el rotulo tiene ademas su propia via en `labels.back`. */
  backProps?: ActionIconProps | undefined;
}
