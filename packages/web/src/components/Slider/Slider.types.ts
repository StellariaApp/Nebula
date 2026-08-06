import type { ReactNode } from "react";

import type { ColorExtended, NebulaField, Size, Variant } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export type SliderVariant = Extract<Variant, "light" | "outline" | "ghost">;

export interface SliderMark {
  value: number;
  label?: ReactNode | undefined;
}

interface SliderBaseProps extends StyleProps {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  variant?: SliderVariant | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  marks?: readonly SliderMark[] | undefined;
  withValue?: boolean | undefined;
  formatValue?: ((value: number) => string) | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}

export interface SliderProps extends SliderBaseProps {
  field?: NebulaField<number> | undefined;
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  onChangeEnd?: ((value: number) => void) | undefined;
}

export interface RangeSliderValue {
  start: number;
  end: number;
}

export interface RangeSliderProps extends SliderBaseProps {
  field?: NebulaField<RangeSliderValue> | undefined;
  value?: RangeSliderValue | undefined;
  defaultValue?: RangeSliderValue | undefined;
  onChange?: ((value: RangeSliderValue) => void) | undefined;
  onChangeEnd?: ((value: RangeSliderValue) => void) | undefined;
  thumbLabels?: readonly [string, string] | undefined;
}
