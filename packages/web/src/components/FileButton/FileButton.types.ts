import type { ReactNode } from "react";

export type FileButtonPayload = File | File[] | null;

export interface FileButtonProps {
  /**
   * Receives the picked files: one `File` on its own, or an array with `multiple`. It also fires
   * with `null` — or an empty array — when the dialog is dismissed, so guard before reading.
   */
  onChange: (payload: FileButtonPayload) => void;
  /**
   * A render function, not nodes: it is handed the opener and has to wire it to whatever it renders.
   * The real `input` stays hidden, which is what lets the trigger be any control you like while the
   * picker keeps working.
   */
  children: (props: { onClick: () => void }) => ReactNode;
  /**
   * Which file types the dialog offers, in the `accept` syntax. It is a filter on the dialog and not
   * a guarantee — a determined user can still hand you anything, so validate what arrives.
   */
  accept?: string | undefined;
  /**
   * Whether more than one file can be picked. It also changes the shape of what `onChange` gets: an
   * array here, a single file without it.
   * @default false
   */
  multiple?: boolean | undefined;
  /** Name of the underlying input, for a plain form submission. */
  name?: string | undefined;
  /**
   * Asks a mobile device to capture from a camera instead of browsing. Ignored on desktop, so it
   * cannot be relied on as the only route to a file.
   */
  capture?: boolean | "user" | "environment" | undefined;
  /** Blocks the picker from opening. @default false */
  disabled?: boolean | undefined;
  /**
   * NOT IMPLEMENTED. The component never calls this, so no reset function is ever handed back. The
   * input does clear its own value after every pick, which is what makes re-picking the same file
   * fire `onChange` again.
   */
  resetRef?: ((reset: () => void) => void) | undefined;
}
