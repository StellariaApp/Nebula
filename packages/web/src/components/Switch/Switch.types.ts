import type { StyleProps } from "../../utils/style-props.js";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { Orientation, ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface SwitchProps
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
  value?: string | undefined;
  disabled?: boolean | undefined;
  draggable?: boolean | undefined;
  rootClassName?: string | undefined;
  /** Rotulo junto al interruptor. */
  labelProps?: TextSlotProps | undefined;
  /** La pista. El thumb NO se expone: lo mueve motion con un style calculado. */
  indicatorProps?: BoxSlotProps | undefined;
}

export interface SwitchGroupProps {
  /** El grupo es un `fieldset` y esto su `legend`: sin el, los interruptores quedan sin nombre comun. */
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  /** Los `value` de los interruptores encendidos. Pasarlo lo vuelve controlado y `defaultValue` deja de mirarse. */
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  /** Baja a todos los interruptores. Uno que declare el suyo gana sobre el del grupo. */
  size?: Size | undefined;
  /** Baja a todos los interruptores. Uno que declare el suyo gana sobre el del grupo. */
  color?: ColorExtended | undefined;
  /** Deshabilita el grupo entero; un interruptor no puede reactivarse por su cuenta. */
  disabled?: boolean | undefined;
  /** El `name` del formulario. Todos los interruptores del grupo lo comparten. */
  name?: string | undefined;
  orientation?: Orientation | undefined;
  /** Con `text` el error va bajo el grupo y ocupa sitio; con `tooltip` flota y no descoloca la maqueta. */
  errorDisplay?: ErrorDisplay | undefined;
  /** Los interruptores. El grupo gobierna su estado, asi que su `checked` y su `onChange` propios sobran. */
  children?: ReactNode | undefined;
}
