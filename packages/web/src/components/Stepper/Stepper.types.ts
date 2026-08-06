import type { ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

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
  rootClassName?: string | undefined;
}
