import type { FormEvent, ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type BanderoleSide = "start" | "end";

export interface FormProps extends Omit<StyleProps, "color"> {
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

export interface FormHeaderProps extends Omit<StyleProps, "color"> {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  children?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  className?: string | undefined;
}

export interface FormBanderoleProps extends Omit<StyleProps, "color"> {
  children: ReactNode;
  side?: BanderoleSide | undefined;
  color?: ColorExtended | undefined;
  className?: string | undefined;
}

export interface FormContentProps extends Omit<StyleProps, "color"> {
  children: ReactNode;
  columns?: 1 | 2 | undefined;
  className?: string | undefined;
}

export interface FormFooterProps extends Omit<StyleProps, "color" | "align"> {
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
