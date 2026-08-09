import type { ReactNode } from "react";

import type { OverlayTriggerElement, PopoverPlacement } from "../Popover/Popover.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface TooltipProps extends Omit<StyleProps, "maw"> {
  /** The element that triggers it. It receives the `ref` and the `aria-describedby`, so it has to forward them. */
  trigger: OverlayTriggerElement;
  /**
   * The bubble text. It arrives through `aria-describedby`, which **describes**: it does not replace
   * the trigger name, so an icon-only button still needs its `aria-label`.
   */
  label: ReactNode;
  /** The REQUESTED placement. If it does not fit, React Aria changes it. */
  placement?: PopoverPlacement | undefined;
  /** Distance from the trigger, in px, along the `placement` axis. */
  offset?: number | undefined;
  /** Offset along the perpendicular axis, in px. */
  crossOffset?: number | undefined;
  /** Delay before opening on hover. At zero it opens on enter. @default 0 */
  delay?: number | undefined;
  /** Delay before closing on leave, which is what lets you travel from the trigger to the bubble. @default 150 */
  closeDelay?: number | undefined;
  /** Neither rendered nor announced. The trigger loses its description, so this is not the way to hide it temporarily. */
  disabled?: boolean | undefined;
  /** Passing it makes the tooltip controlled: pointer and focus stop opening it and it only emits `onOpenChange`. */
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  withArrow?: boolean | undefined;
  color?: "neutral" | "inverted" | undefined;
  /** Maximum width of the bubble. It shadows the `maw` style prop, which here would land on the trigger. */
  maw?: number | string | undefined;
  className?: string | undefined;
}
