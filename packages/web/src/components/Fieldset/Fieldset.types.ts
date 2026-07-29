import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export type FieldsetVariant = "default" | "filled" | "unstyled";

export interface FieldsetProps
  extends Omit<ComponentPropsWithoutRef<"fieldset">, "color" | "disabled">,
    StyleProps {
  legend?: ReactNode | undefined;
  description?: ReactNode | undefined;
  variant?: FieldsetVariant | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}
