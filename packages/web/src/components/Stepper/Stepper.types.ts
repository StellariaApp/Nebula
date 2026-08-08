import type { ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type StepperVariant = Extract<Variant, "filled" | "light" | "outline">;

export type StepperOrientation = "horizontal" | "vertical";

export type StepperState = "completed" | "current" | "pending" | "error";

export interface StepperStep {
  label: ReactNode;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  error?: boolean | undefined;
  disabled?: boolean | undefined;
}

export interface StepperLabels {
  completed: string;
  current: string;
  pending: string;
  error: string;
}

export interface StepperProps extends StyleProps {
  steps: readonly StepperStep[];
  active: number;
  onStepClick?: ((step: number) => void) | undefined;
  children?: ReactNode | undefined;
  variant?: StepperVariant | undefined;
  color?: ColorExtended | undefined;
  size?: Size | undefined;
  orientation?: StepperOrientation | undefined;
  allowNextStepsSelect?: boolean | undefined;
  labels?: Partial<StepperLabels> | undefined;
  className?: string | undefined;
  /** La lista de pasos. */
  listProps?: BoxSlotProps | undefined;
  /** Cada paso. Lleva `data-state`, que es de donde sale su tinte.  */
  itemProps?: BoxSlotProps | undefined;
  /**
   * El area pulsable del paso. Es un boton solo en los pasos que `onStepClick` puede activar
   * —alcanzables, no deshabilitados y distintos del actual—; en el resto es un span.
   */
  stepProps?: BoxSlotProps | undefined;
  /** La viñeta del paso. Su tamaño lo fija `size`; la ranura se compone con el. */
  bulletProps?: BoxSlotProps | undefined;
  /** Columna de rotulo y descripcion. */
  bodyProps?: BoxSlotProps | undefined;
  /** El rotulo del paso. */
  labelProps?: TextSlotProps | undefined;
  /** La descripcion, si el paso la trae. */
  descriptionProps?: TextSlotProps | undefined;
  rootClassName?: string | undefined;
}
