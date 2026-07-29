import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type ToastVariant = Extract<Variant, "filled" | "light" | "glass">;

export type ToastPosition =
  | "top-start"
  | "top"
  | "top-end"
  | "bottom-start"
  | "bottom"
  | "bottom-end";

export interface ToastOptions {
  id?: string | undefined;
  title?: ReactNode | undefined;
  message?: ReactNode | undefined;
  variant?: ToastVariant | undefined;
  color?: ColorExtended | undefined;
  icon?: ReactNode | undefined;
  duration?: number | undefined;
  dismissible?: boolean | undefined;
  action?: ReactNode | undefined;
}

export interface ToastRecord extends ToastOptions {
  id: string;
  color: ColorExtended;
  duration: number;
  dismissible: boolean;
}

export interface ToastProviderProps extends Omit<StyleProps, "position"> {
  children?: ReactNode | undefined;
  position?: ToastPosition | undefined;
  max?: number | undefined;
  duration?: number | undefined;
  closeLabel?: string | undefined;
  regionLabel?: string | undefined;
}

export interface ToastApi {
  show: (options: ToastOptions) => string;
  success: (message: ReactNode, options?: ToastOptions) => string;
  error: (message: ReactNode, options?: ToastOptions) => string;
  warning: (message: ReactNode, options?: ToastOptions) => string;
  info: (message: ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}
