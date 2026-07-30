import type { FormEvent, ReactNode } from "react";

import type { SizeValue } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface DeleteAlert {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
}

export interface FormDeleteProps extends Omit<StyleProps, "color"> {
  children?: ReactNode | undefined;
  alert?: DeleteAlert | undefined;
  onSubmit?: ((event: FormEvent<HTMLFormElement>) => Promise<void> | void) | undefined;
  onCancel?: (() => void) | undefined;
  isPending?: boolean | undefined;
  disabled?: boolean | undefined;
  submitText?: ReactNode | undefined;
  cancelText?: ReactNode | undefined;
  error?: ReactNode | undefined;
  className?: string | undefined;
}

export interface ModalDeleteProps extends Omit<FormDeleteProps, "onCancel"> {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode | undefined;
  size?: SizeValue | undefined;
}
