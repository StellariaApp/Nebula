import type { ReactNode } from "react";

import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";

export interface ButtonCopyProps extends Omit<ActionIconProps, "children" | "onPress" | "onClick"> {
  /**
   * What goes to the clipboard, read at press time. It needs a secure context — over plain HTTP the
   * clipboard API is not there, the copy fails and the button never reaches its copied state.
   */
  value: string;
  /**
   * How long the copied state lasts, in milliseconds. Pressing again restarts it rather than
   * stacking, so a run of presses still leaves exactly one window open.
   * @default 1500
   */
  timeout?: number | undefined;
  /**
   * The glyph at rest.
   * @default <Clipboard />
   */
  copyIcon?: ReactNode | undefined;
  /**
   * The glyph while the copied state lasts. The button also swaps to the success scale for that
   * window, so a glyph with a colour baked in will fight the confirmation instead of carrying it.
   * @default <Check />
   */
  copiedIcon?: ReactNode | undefined;
  /**
   * The button's accessible name at rest. There is no visible text, so this is the only name it
   * has. It is English by default (ADR-120); translate it at the call site.
   * @default "Copy"
   */
  copyLabel?: string | undefined;
  /**
   * The name it takes while copied. Swapping it is what announces the copy to a screen reader —
   * nothing else about the change is spoken.
   * @default "Copied"
   */
  copiedLabel?: string | undefined;
}
