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
  /** El grupo es un `fieldset` y esto su `legend`: sin el, las opciones quedan sin nombre comun. */
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  /** El `value` de la opcion elegida. Pasarlo lo vuelve controlado y `defaultValue` deja de mirarse. */
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** Baja a todas las opciones. Una que declare el suyo gana sobre el del grupo. */
  size?: Size | undefined;
  /** Baja a todas las opciones. Una que declare el suyo gana sobre el del grupo. */
  color?: ColorExtended | undefined;
  /** Deshabilita el grupo entero; una opcion no puede reactivarse por su cuenta. */
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  /** El `name` del formulario. Es lo que hace que las opciones sean excluyentes entre si. */
  name?: string | undefined;
  orientation?: Orientation | undefined;
  /** Con `text` el error va bajo el grupo y ocupa sitio; con `tooltip` flota y no descoloca la maqueta. */
  errorDisplay?: ErrorDisplay | undefined;
  /** Las opciones. El grupo gobierna su estado, asi que su `checked` y su `onChange` propios sobran. */
  children?: ReactNode | undefined;
}
