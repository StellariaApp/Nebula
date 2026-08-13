import type { FormEvent, ReactNode } from "react";

import type { SizeValue } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface DeleteAlert {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
}

export interface FormDeleteProps extends StyleProps {
  /**
   * What the user has to do before deleting — a confirmation field, a list of what goes with it.
   * Nothing renders in that slot without it, so a bare confirmation needs only `alert`.
   */
  children?: ReactNode | undefined;
  /**
   * The warning above the form, rendered as an error `Alert`. This is where the consequence goes:
   * the buttons only say "Delete", so if the deletion is irreversible, it has to be said here.
   */
  alert?: DeleteAlert | undefined;
  /**
   * Runs the deletion. It receives the raw form event, so preventing the default is yours to do; an
   * async handler is awaited by nothing here, which is why `isPending` is a separate prop.
   */
  onSubmit?: ((event: FormEvent<HTMLFormElement>) => Promise<void> | void) | undefined;
  /**
   * Runs on cancel. Its absence is what removes the cancel button entirely, so leaving it out gives
   * a form with no way out — deliberate only when something around it already offers one.
   */
  onCancel?: (() => void) | undefined;
  /**
   * Whether the deletion is in flight. It puts the submit button in its loading state and disables
   * cancel, so the user cannot walk away from a request that is already running.
   * @default false
   */
  isPending?: boolean | undefined;
  /**
   * Blocks submission while leaving cancel alive — the state for a confirmation that has not been
   * satisfied yet.
   * @default false
   */
  disabled?: boolean | undefined;
  /**
   * The submit button's label. Naming the object beats the verb alone: "Delete invoice" is
   * confirmable at a glance in a way "Delete" is not. English by default (ADR-120).
   * @default "Delete"
   */
  submitText?: ReactNode | undefined;
  /** The cancel button's label. English by default (ADR-120). @default "Cancel" */
  cancelText?: ReactNode | undefined;
  /**
   * What failed, shown in the footer beside the buttons. It is for the error the submission came
   * back with; the warning about what deletion means belongs in `alert`.
   */
  error?: ReactNode | undefined;
  className?: string | undefined;
}

export interface ModalDeleteProps extends Omit<FormDeleteProps, "onCancel"> {
  /** Whether the modal is open. Fully controlled: it has no state of its own. */
  opened: boolean;
  /**
   * Closes the modal, and doubles as the form's cancel — which is why `onCancel` is not part of this
   * contract. While `isPending`, neither the backdrop nor Escape will call it, so an in-flight
   * deletion cannot be dismissed out from under itself.
   */
  onClose: () => void;
  /**
   * The modal's heading. English by default (ADR-120).
   * @default "Confirm deletion"
   */
  title?: ReactNode | undefined;
  /**
   * How wide the modal is. It stays small by default: a confirmation that fills the screen reads as
   * a page rather than as a question.
   * @default "sm"
   */
  size?: SizeValue | undefined;
}
