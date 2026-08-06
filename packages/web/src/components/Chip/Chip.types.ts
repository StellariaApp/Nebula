import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

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
  iconProps?: BoxSlotProps | undefined;
}

export interface ChipGroupProps extends StyleProps {
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
