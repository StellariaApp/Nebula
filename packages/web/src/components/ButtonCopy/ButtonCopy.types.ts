import type { ReactNode } from "react";

import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";

export interface ButtonCopyProps extends Omit<ActionIconProps, "children" | "onPress" | "onClick"> {
  value: string;
  timeout?: number | undefined;
  copyIcon?: ReactNode | undefined;
  copiedIcon?: ReactNode | undefined;
  copyLabel?: string | undefined;
  copiedLabel?: string | undefined;
}
