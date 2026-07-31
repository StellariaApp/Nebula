import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { OverlayTriggerElement, PopoverPlacement } from "../Popover/Popover.types.js";

export interface HoverCardProps extends StyleProps {
  trigger: OverlayTriggerElement;
  children: ReactNode;
  placement?: PopoverPlacement | undefined;
  offset?: number | undefined;
  crossOffset?: number | undefined;
  openDelay?: number | undefined;
  closeDelay?: number | undefined;
  disabled?: boolean | undefined;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  width?: number | string | undefined;
  withArrow?: boolean | undefined;
  className?: string | undefined;
}
