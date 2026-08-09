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
  /** The list of controls. */
  listProps?: BoxSlotProps | undefined;
  /** Every button: arrows and numbers. It spreads over ALL of them, the active one included. */
  controlProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The content of each button. On the forward arrows it already carries a 180-degree rotation. */
  valueProps?: BoxSlotProps | undefined;
}

export type PaginationItem = number | "dots-start" | "dots-end";
