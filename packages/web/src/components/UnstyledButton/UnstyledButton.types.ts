import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { PressLifecycleProps } from "../../utils/press-props.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface UnstyledButtonProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled">,
    StyleProps,
    PressLifecycleProps {
  disabled?: boolean | undefined;
  children?: ReactNode | undefined;
}
