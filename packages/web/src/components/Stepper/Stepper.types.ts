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
  /** The list of steps. */
  listProps?: BoxSlotProps | undefined;
  /** Every step. It carries `data-state`, which is where its tint comes from.  */
  itemProps?: BoxSlotProps | undefined;
  /**
   * The pressable area of the step. It is a button only on the steps `onStepClick` can activate —
   * reachable, not disabled and not the current one; on the rest it is a span.
   */
  stepProps?: BoxSlotProps | undefined;
  /** The step bullet. Its size comes from `size`; the slot composes with it. */
  bulletProps?: BoxSlotProps | undefined;
  /** Label and description column. */
  bodyProps?: BoxSlotProps | undefined;
  /** The step label. */
  labelProps?: TextSlotProps | undefined;
  /** The description, when the step has one. */
  descriptionProps?: TextSlotProps | undefined;
  rootClassName?: string | undefined;
}
