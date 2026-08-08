import type { ReactNode } from "react";

import type { ColorExtended, NebulaField, Size, Variant } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { FormFieldSlotProps } from "../FormField/FormField.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type SliderVariant = Extract<Variant, "light" | "outline" | "ghost">;

export interface SliderMark {
  value: number;
  label?: ReactNode | undefined;
}

interface SliderBaseProps extends StyleProps {
  /**
   * La fila de marcas. Solo se pinta con `marks`.
   */
  marksProps?: BoxSlotProps | undefined;
  /**
   * Cada marca. Se esparce sobre TODAS. Su posicion en el eje se escribe DESPUES de la ranura,
   * porque sale de su `value`; el color y la tipografia se pueden poner aqui o heredarse de
   * `marksProps`.
   */
  markProps?: BoxSlotProps | undefined;
  /** El valor que se muestra al lado. Solo con `withValue`; se anuncia solo, porque es un `output`. */
  outputProps?: TextSlotProps | undefined;
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

export interface SliderProps extends SliderBaseProps, FormFieldSlotProps {
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

export interface RangeSliderProps extends SliderBaseProps, FormFieldSlotProps {
  field?: NebulaField<RangeSliderValue> | undefined;
  value?: RangeSliderValue | undefined;
  defaultValue?: RangeSliderValue | undefined;
  onChange?: ((value: RangeSliderValue) => void) | undefined;
  onChangeEnd?: ((value: RangeSliderValue) => void) | undefined;
  /** @default ["Mínimo", "Máximo"] */
  thumbLabels?: readonly [string, string] | undefined;
}
