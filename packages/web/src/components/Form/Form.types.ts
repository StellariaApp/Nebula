import type { FormEvent, ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TitleSlotProps } from "../Title/Title.types.js";

export type BanderoleSide = "start" | "end";

export interface FormProps extends StyleProps {
  /** The `fieldset` that groups the fields. It is what disables them while `isPending`. */
  fieldsetProps?: BoxSlotProps | undefined;
  children: ReactNode;
  onSubmit?: ((event: FormEvent<HTMLFormElement>) => Promise<void> | void) | undefined;
  isPending?: boolean | undefined;
  disabled?: boolean | undefined;
  color?: ColorExtended | undefined;
  noValidate?: boolean | undefined;
  id?: string | undefined;
  name?: string | undefined;
  className?: string | undefined;
}

export interface FormHeaderProps extends StyleProps {
  /** The header title, description and content column. */
  headerTextProps?: BoxSlotProps | undefined;
  /** The title, which is a `Title` of order 3. `component` changes its tag without touching the level. */
  titleProps?: TitleSlotProps | undefined;
  /** The header actions, when there are any. */
  actionsProps?: BoxSlotProps | undefined;
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  children?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  className?: string | undefined;
}

export interface FormBanderoleProps extends StyleProps {
  children: ReactNode;
  side?: BanderoleSide | undefined;
  color?: ColorExtended | undefined;
  className?: string | undefined;
}

export interface FormContentProps extends StyleProps {
  children: ReactNode;
  columns?: 1 | 2 | undefined;
  className?: string | undefined;
}

export interface FormFooterProps extends Omit<StyleProps, "align"> {
  /** The form error notice. It carries `role="alert"` and the id the field points at. */
  errorProps?: BoxSlotProps | undefined;
  /** The button row. Its alignment comes from `align`; the slot composes with it. */
  actionsProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  error?: ReactNode | undefined;
  submitText?: ReactNode | undefined;
  cancelText?: ReactNode | undefined;
  onCancel?: (() => void) | undefined;
  hideSubmit?: boolean | undefined;
  align?: "start" | "end" | "between" | undefined;
  className?: string | undefined;
}

export interface FormContextValue {
  isPending: boolean;
  disabled: boolean;
  color: ColorExtended;
  errorId: string;
}
