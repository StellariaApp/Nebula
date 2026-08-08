import type { ReactNode } from "react";

import type { OverlayTriggerElement, PopoverPlacement } from "../Popover/Popover.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface TooltipProps extends Omit<StyleProps, "maw"> {
  trigger: OverlayTriggerElement;
  label: ReactNode;
  placement?: PopoverPlacement | undefined;
  offset?: number | undefined;
  crossOffset?: number | undefined;
  /** @default 0 */
  delay?: number | undefined;
  /** @default 150 */
  closeDelay?: number | undefined;
  disabled?: boolean | undefined;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  withArrow?: boolean | undefined;
  color?: "neutral" | "inverted" | undefined;
  maw?: number | string | undefined;
  className?: string | undefined;
}
