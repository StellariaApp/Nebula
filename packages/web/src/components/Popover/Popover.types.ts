import type { ReactElement, ReactNode, Ref } from "react";
import type { StyleProps } from "../../utils/style-props.js";

export type OverlayTriggerElement = ReactElement<
  Record<string, unknown> & { ref?: Ref<HTMLElement> | undefined }
>;

export type PopoverPlacement =
  | "top"
  | "top start"
  | "top end"
  | "bottom"
  | "bottom start"
  | "bottom end"
  | "start"
  | "end"
  | "left"
  | "right";

export interface PopoverProps extends StyleProps {
  /** The element that opens and anchors the popover. It receives the `ref` and the aria attributes, so it has to forward them. */
  trigger: OverlayTriggerElement;
  children: ReactNode;
  /** Passing it makes the popover controlled: the component stops opening and closing on its own and only emits `onOpenChange`. */
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  /** The REQUESTED placement. If it does not fit, React Aria changes it, unless you turn `shouldFlip` off. */
  placement?: PopoverPlacement | undefined;
  /** Distance from the trigger, in px, along the `placement` axis. */
  offset?: number | undefined;
  /** Offset along the perpendicular axis, in px, to shift it off-centre from the trigger. */
  crossOffset?: number | undefined;
  /** Turning it off keeps the popover at its `placement` even off-screen: only when the position is guaranteed. */
  shouldFlip?: boolean | undefined;
  /** Minimum gap from the viewport edge before repositioning. */
  containerPadding?: number | undefined;
  withArrow?: boolean | undefined;
  /**
   * Lets interaction through to the rest of the page: no scrim, no focus trap, and no close on outside
   * press. This is what a popover accompanying a form needs, not a modal one.
   */
  isNonModal?: boolean | undefined;
  /** Turning off close-on-Escape leaves keyboard users with no way out: only with another obvious route. */
  isKeyboardDismissDisabled?: boolean | undefined;
  radius?: "sm" | "md" | "lg" | undefined;
  padding?: "none" | "sm" | "md" | "lg" | undefined;
  /** Fixed width of the popover. Without it, it fits its content. */
  width?: number | string | undefined;
  className?: string | undefined;
  /** Names the popover for screen readers. Needed when there is no heading inside doing it. */
  "aria-label"?: string | undefined;
}
