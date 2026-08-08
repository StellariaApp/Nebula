import type { ReactNode } from "react";

import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";

export interface ButtonCopyProps extends Omit<ActionIconProps, "children" | "onPress" | "onClick"> {
  value: string;
  timeout?: number | undefined;
  /** @default <Clipboard /> */
  copyIcon?: ReactNode | undefined;
  /** @default <Check /> */
  copiedIcon?: ReactNode | undefined;
  copyLabel?: string | undefined;
  copiedLabel?: string | undefined;
}
