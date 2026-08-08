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
  /** El grupo es un `fieldset` y esto su `legend`: sin el, las casillas quedan sin nombre comun. */
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  /** Los `value` de las casillas marcadas. Pasarlo lo vuelve controlado y `defaultValue` deja de mirarse. */
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  /** Baja a todas las casillas. Una que declare el suyo gana sobre el del grupo. */
  size?: Size | undefined;
  /** Baja a todas las casillas. Una que declare el suyo gana sobre el del grupo. */
  color?: ColorExtended | undefined;
  /** Deshabilita el grupo entero; una casilla no puede reactivarse por su cuenta. */
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  /** El `name` del formulario. Todas las casillas del grupo lo comparten. */
  name?: string | undefined;
  orientation?: Orientation | undefined;
  /** Con `text` el error va bajo el grupo y ocupa sitio; con `tooltip` flota y no descoloca la maqueta. */
  errorDisplay?: ErrorDisplay | undefined;
  /** Las casillas. El grupo gobierna su estado, asi que su `checked` y su `onChange` propios sobran. */
  children?: ReactNode | undefined;
}
