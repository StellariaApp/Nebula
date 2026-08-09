import type { ReactNode } from "react";

import type { ColorExtended, NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

export interface RatingProps extends StyleProps, FormFieldSlotProps {
  /**
   * The partial fill of a half symbol. Only rendered when the value falls between two symbols, with
   * or without `fractions`. Its width is written AFTER the slot, because it is the fraction it
   * represents.
   */
  partialProps?: BoxSlotProps | undefined;
  /** The row of symbols. It is a `radiogroup`, or an `img` with `readOnly`. */
  groupProps?: BoxSlotProps | undefined;
  /**
   * Every symbol. It spreads over ALL of them, and serves two elements: a `button` when it can be
   * rated and a `span` with `readOnly`.
   */
  itemProps?: BoxSlotProps | undefined;
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
