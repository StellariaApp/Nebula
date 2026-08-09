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
  /** Wrapper for the icon. It lands both on the icon itself and on the check mark. */
  iconProps?: BoxSlotProps | undefined;
}

export interface ChipGroupProps extends StyleProps {
  /** The group legend. Only rendered with a `label`; the name is the one `Fieldset` uses. */
  legendProps?: TextSlotProps | undefined;
  /** The chip row. The root is the `fieldset`, and this is what lays them out inside it. */
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
