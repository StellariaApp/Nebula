import type { ReactNode } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export type StatTrend = "up" | "down" | "flat";

export interface StatProps extends Omit<StyleProps, "align"> {
  label: ReactNode;
  /** El rotulo, en la fila de cabecera junto al glifo. */
  labelProps?: TextSlotProps | undefined;
  value: ReactNode;
  /** La cifra. Su tamano sale de `size`. */
  valueProps?: TextSlotProps | undefined;
  /** La descripcion del pie. Solo se pinta con `description`. */
  descriptionProps?: TextSlotProps | undefined;
  /** El glifo de la cabecera. Solo se pinta con `icon`, y va `aria-hidden`. */
  iconProps?: BoxSlotProps | undefined;
  /** La variacion. Solo se pinta con `diff`, y lleva `data-trend`, que es de donde sale su color. La flecha y el texto para lector de pantalla van dentro y no tienen ranura. */
  diffProps?: TextSlotProps | undefined;
  /** La fila de cabecera: rotulo y glifo. */
  headProps?: BoxSlotProps | undefined;
  /** El pie: variacion y descripcion. No se pinta si faltan las dos. */
  footProps?: BoxSlotProps | undefined;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  trend?: StatTrend | undefined;
  diff?: ReactNode | undefined;
  diffLabel?: string | undefined;
  color?: ColorExtended | undefined;
  size?: Size | undefined;
  align?: "start" | "center" | "end" | undefined;
  className?: string | undefined;
}
