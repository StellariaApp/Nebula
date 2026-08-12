import type { ReactNode } from "react";

export interface FocusTrapProps {
  /**
   * Whether the trap holds focus inside the subtree. Turning it off releases focus without
   * unmounting anything, which is how a trap is suspended — a nested overlay taking over, a step
   * that hands control back to the page — while its content stays on screen.
   * @default true
   */
  active?: boolean | undefined;
  /**
   * Returns focus, on unmount, to whatever had it when the trap mounted. Overlays that open from a
   * trigger want this on; without it, focus falls back to the document and the next Tab starts over
   * from the top of the page.
   * @default false
   */
  restoreFocus?: boolean | undefined;
  /**
   * Moves focus to the first tabbable node when the trap mounts. Leave it off when something inside
   * already claims focus — a field with its own `autoFocus`, or a dialog that focuses its heading.
   * @default false
   */
  autoFocus?: boolean | undefined;
  /**
   * The trapped subtree. The trap renders no element of its own, so the children have to supply the
   * node: focus is contained by what they render, not by a wrapper this component adds.
   */
  children: ReactNode;
}
