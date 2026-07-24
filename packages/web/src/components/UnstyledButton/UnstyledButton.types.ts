import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { PressLifecycleProps } from "../../utils/press-props.js";

export interface UnstyledButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "disabled">,
    PressLifecycleProps {
  disabled?: boolean | undefined;
  children?: ReactNode | undefined;
}
