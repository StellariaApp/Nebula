import type { StyleProps } from "../../utils/style-props.js";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { Orientation, ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { GlyphProps } from "../../glyphs/index.js";

export interface CheckboxProps
  extends
    Omit<
      ComponentPropsWithoutRef<"input">,
      "size" | "onChange" | "checked" | "defaultChecked" | "type" | "color" | "disabled"
    >,
    StyleProps {
  label?: ReactNode | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  indeterminate?: boolean | undefined;
  value?: string | undefined;
  disabled?: boolean | undefined;
  error?: boolean | undefined;
  rootClassName?: string | undefined;
  /** Rotulo junto a la casilla. */
  labelProps?: TextSlotProps | undefined;
  /** La casilla visual. El input nativo va aparte y sigue recibiendo className. */
  indicatorProps?: BoxSlotProps | undefined;
  /** La marca de dentro: paloma, o guion si indeterminate. */
  markProps?: GlyphProps | undefined;
}

export interface CheckboxGroupProps {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  name?: string | undefined;
  orientation?: Orientation | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  children?: ReactNode | undefined;
}
