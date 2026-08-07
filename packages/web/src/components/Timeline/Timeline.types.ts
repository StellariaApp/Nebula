import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type TimelineVariant = Extract<Variant, "filled" | "light" | "outline">;

export interface TimelineItem {
  title: ReactNode;
  description?: ReactNode | undefined;
  meta?: ReactNode | undefined;
  bullet?: ReactNode | undefined;
  color?: ColorExtended | undefined;
}

export interface TimelineProps extends Omit<StyleProps, "align"> {
  items: readonly TimelineItem[];
  active?: number | undefined;
  variant?: TimelineVariant | undefined;
  color?: ColorExtended | undefined;
  align?: "start" | "end" | undefined;
  bulletSize?: number | undefined;
  lineWidth?: number | undefined;
  reachedLabel?: string | undefined;
  className?: string | undefined;
  /** Cada entrada de la linea. Se esparce sobre todas. */
  itemProps?: BoxSlotProps | undefined;
  /** La viñeta. Lleva data-reached, que es lo que la tiñe al pasar el activo. */
  bulletProps?: BoxSlotProps | undefined;
  /** El tramo vertical entre viñetas. */
  lineProps?: BoxSlotProps | undefined;
  /** Columna de titulo, meta y descripcion. */
  bodyProps?: BoxSlotProps | undefined;
  /** Titulo de la entrada. */
  titleProps?: TextSlotProps | undefined;
  /** Linea de meta, si la entrada la trae. */
  metaProps?: TextSlotProps | undefined;
  /** Descripcion de la entrada, si la trae. */
  descriptionProps?: TextSlotProps | undefined;
}
