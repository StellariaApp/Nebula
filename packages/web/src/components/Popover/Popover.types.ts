import type { ReactElement, ReactNode, Ref } from "react";

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

export interface PopoverProps {
  trigger: OverlayTriggerElement;
  children: ReactNode;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  placement?: PopoverPlacement | undefined;
  offset?: number | undefined;
  crossOffset?: number | undefined;
  shouldFlip?: boolean | undefined;
  containerPadding?: number | undefined;
  withArrow?: boolean | undefined;
  isNonModal?: boolean | undefined;
  isKeyboardDismissDisabled?: boolean | undefined;
  radius?: "sm" | "md" | "lg" | undefined;
  padding?: "none" | "sm" | "md" | "lg" | undefined;
  width?: number | string | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}
