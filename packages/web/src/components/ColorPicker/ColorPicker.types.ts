import type { ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

export type ColorFormat = "hex" | "hexa" | "rgb" | "rgba" | "hsl" | "hsla";

export interface ColorPickerProps extends Omit<StyleProps, "color"> {
  label?: ReactNode | undefined;
  size?: Size | undefined;
  format?: ColorFormat | undefined;
  withAlpha?: boolean | undefined;
  swatches?: readonly string[] | undefined;
  disabled?: boolean | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  labels?: ColorPickerLabels | undefined;
  className?: string | undefined;
}

export interface ColorPickerLabels {
  area?: string | undefined;
  hue?: string | undefined;
  alpha?: string | undefined;
  swatches?: string | undefined;
  swatch?: ((value: string) => string) | undefined;
}

export interface ColorInputProps extends Omit<StyleProps, "color"> {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  format?: ColorFormat | undefined;
  withAlpha?: boolean | undefined;
  withPicker?: boolean | undefined;
  swatches?: readonly string[] | undefined;
  placement?: PopoverPlacement | undefined;
  placeholder?: string | undefined;
  openLabel?: string | undefined;
  labels?: ColorPickerLabels | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}
