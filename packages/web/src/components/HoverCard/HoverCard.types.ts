import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { OverlayTriggerElement, PopoverPlacement } from "../Popover/Popover.types.js";

export interface HoverCardProps extends StyleProps {
  /**
   * What opens the card on hover. Hover is the only trigger, so whatever goes here has to be
   * supplementary: a touch user and a keyboard user never reach it, and nothing inside the card can
   * be the only route to a task.
   */
  trigger: OverlayTriggerElement;
  /** The card's content. */
  children: ReactNode;
  /** Which side of the trigger the card prefers; it flips when there is no room. @default "bottom" */
  placement?: PopoverPlacement | undefined;
  /**
   * Gap between trigger and card, along the placement axis. Keep it small enough that the pointer
   * can cross without the card closing under it.
   * @default 8
   */
  offset?: number | undefined;
  /** Shifts the card along the other axis, for aligning it against something wider than its trigger. */
  crossOffset?: number | undefined;
  /**
   * How long the pointer has to rest before it opens, in milliseconds. It is what stops a card
   * firing on every pointer that merely crosses the trigger on its way somewhere else.
   * @default 200
   */
  openDelay?: number | undefined;
  /**
   * How long it waits before closing once the pointer leaves, in milliseconds. This is the window
   * the pointer has to travel from the trigger into the card, so shortening it can make the card
   * unreachable.
   * @default 150
   */
  closeDelay?: number | undefined;
  /** Stops it opening at all, without unmounting the trigger. @default false */
  disabled?: boolean | undefined;
  /**
   * The open state, controlled. Passing it takes the state away from the component: the delays still
   * run, but they report through `onOpenChange` instead of moving anything.
   */
  opened?: boolean | undefined;
  /** Where the state starts when nothing controls it. Ignored once `opened` is passed. @default false */
  defaultOpened?: boolean | undefined;
  /** Fires with the state being moved to, in both modes. */
  onOpenChange?: ((opened: boolean) => void) | undefined;
  /** Fixes the card's width. Left out it sizes to its content. */
  width?: number | string | undefined;
  /**
   * NOT IMPLEMENTED. The component reads no arrow prop and never draws one; setting this changes
   * nothing today. It is kept only so the contract does not break for callers already passing it.
   */
  withArrow?: boolean | undefined;
  className?: string | undefined;
}
