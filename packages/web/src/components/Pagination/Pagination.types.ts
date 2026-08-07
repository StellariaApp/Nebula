import type { ComponentPropsWithoutRef } from "react";
import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type PaginationSize = "sm" | "md" | "lg" | "xl";

export interface PaginationLabels {
  root?: string | undefined;
  previous?: string | undefined;
  next?: string | undefined;
  first?: string | undefined;
  last?: string | undefined;
  page?: ((page: number) => string) | undefined;
}

export type PaginationVariant = Extract<Variant, "filled" | "outline" | "light" | "ghost">;

export interface PaginationProps extends StyleProps {
  total: number;
  page?: number | undefined;
  defaultPage?: number | undefined;
  onChange?: ((page: number) => void) | undefined;
  siblings?: number | undefined;
  boundaries?: number | undefined;
  withControls?: boolean | undefined;
  withEdges?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: PaginationSize | undefined;
  variant?: PaginationVariant | undefined;
  color?: ColorExtended | undefined;
  labels?: PaginationLabels | undefined;
  className?: string | undefined;
  /** La lista de controles. */
  listProps?: BoxSlotProps | undefined;
  /** Cada boton: flechas y numeros. Se esparce sobre TODOS, incluido el activo. */
  controlProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** El contenido de cada boton. En las flechas de avance lleva ya un giro de 180 grados. */
  valueProps?: BoxSlotProps | undefined;
}

export type PaginationItem = number | "dots-start" | "dots-end";
