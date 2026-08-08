import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type ChipVariant = Extract<Variant, "filled" | "outline" | "light">;

export interface ChipProps
  extends
    Omit<
      ComponentPropsWithoutRef<"input">,
      "size" | "color" | "type" | "checked" | "defaultChecked" | "onChange" | "children"
    >,
    StyleProps {
  children?: ReactNode | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  variant?: ChipVariant | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  disabled?: boolean | undefined;
  value?: string | undefined;
  icon?: ReactNode | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
  /** Envoltorio del icono. Cae tanto sobre el icono propio como sobre la paloma de marcado. */
  iconProps?: BoxSlotProps | undefined;
}

export interface ChipGroupProps extends StyleProps {
  /** La leyenda del grupo. Solo se pinta si hay `label`; el nombre es el de `Fieldset`. */
  legendProps?: TextSlotProps | undefined;
  /** La fila de fichas. La raiz es el `fieldset`, y esto es lo que las coloca dentro. */
  groupProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  label?: ReactNode | undefined;
  multiple?: boolean | undefined;
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  variant?: ChipVariant | undefined;
  disabled?: boolean | undefined;
  name?: string | undefined;
  className?: string | undefined;
}
