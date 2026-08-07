import type { StyleProps } from "../../utils/style-props.js";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { Orientation, ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface RadioProps
  extends
    Omit<
      ComponentPropsWithoutRef<"input">,
      "size" | "onChange" | "checked" | "defaultChecked" | "type" | "color" | "disabled"
    >,
    StyleProps {
  value: string;
  label?: ReactNode | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  disabled?: boolean | undefined;
  rootClassName?: string | undefined;
  /** Rotulo junto al radio. */
  labelProps?: TextSlotProps | undefined;
  /** El circulo visual. El input nativo va aparte. */
  indicatorProps?: BoxSlotProps | undefined;
  /** El punto interior, que aparece al marcar. */
  markProps?: BoxSlotProps | undefined;
}

export interface RadioGroupProps {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  name?: string | undefined;
  orientation?: Orientation | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  children?: ReactNode | undefined;
}
