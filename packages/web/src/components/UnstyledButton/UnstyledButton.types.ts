import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { PressEvent } from "react-aria";

export interface UnstyledButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "disabled"> {
  disabled?: boolean | undefined;
  onPress?: ((event: PressEvent) => void) | undefined;
  children?: ReactNode | undefined;
}
