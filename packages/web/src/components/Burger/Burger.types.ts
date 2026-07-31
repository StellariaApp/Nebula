import type { ComponentPropsWithoutRef } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { PressLifecycleProps } from "../../utils/press-props.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface BurgerProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled" | "onChange">,
    Omit<StyleProps, "color">,
    PressLifecycleProps {
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onChange?: ((opened: boolean) => void) | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  disabled?: boolean | undefined;
  openLabel?: string | undefined;
  closeLabel?: string | undefined;
}
