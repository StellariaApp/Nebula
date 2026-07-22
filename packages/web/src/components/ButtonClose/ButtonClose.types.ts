import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";

export interface ButtonCloseProps extends Omit<ActionIconProps, "children"> {
  "aria-label"?: string | undefined;
}
