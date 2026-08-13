import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { PressLifecycleProps } from "../../utils/press-props.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface UnstyledButtonProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled">,
    StyleProps,
    PressLifecycleProps {
  /**
   * Blocks the press and stops the hover and focus state being reported. It is a real `button`, so
   * this also removes it from the tab order — for something that must stay reachable while inert,
   * mark it `aria-disabled` and guard the handler instead.
   * @default false
   */
  disabled?: boolean | undefined;
  /**
   * The whole of the button. The component strips the browser's appearance but keeps the keyboard,
   * focus ring and press semantics, so the children carry the entire look — including the visible
   * focus state, which is the one thing that must not be stripped with it.
   */
  children?: ReactNode | undefined;
}
