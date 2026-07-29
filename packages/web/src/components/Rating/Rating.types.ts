import type { ReactNode } from "react";

import type { ColorExtended, NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface RatingProps extends Omit<StyleProps, "color"> {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  count?: number | undefined;
  fractions?: number | undefined;
  field?: NebulaField<number> | undefined;
  value?: number | undefined;
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  onHoverChange?: ((value: number) => void) | undefined;
  emptySymbol?: ReactNode | undefined;
  fullSymbol?: ReactNode | undefined;
  itemLabel?: ((value: number) => string) | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}
