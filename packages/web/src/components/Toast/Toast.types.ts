import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type ToastVariant = Extract<Variant, "filled" | "light" | "glass">;

export type ToastPosition =
  "top-start" | "top" | "top-end" | "bottom-start" | "bottom" | "bottom-end";

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

/**
 * The slots of every toast. They spread over ALL the toasts the provider shows: the content of a
 * toast arrives through `nebulaToast`, not through composition, so there is no way to adjust a
 * single one from here.
 */
export interface ToastSlotProps {
  /** Every toast. It carries the `role` that decides its colour: `alert` when it is an error or a warning. */
  toastProps?: BoxSlotProps | undefined;
  /** Wrapper for the icon, when the toast has one. */
  iconProps?: BoxSlotProps | undefined;
  /** Title, message and action column. */
  bodyProps?: BoxSlotProps | undefined;
  /** The title, when there is one. */
  titleProps?: TextSlotProps | undefined;
  /** The message, when there is one. */
  messageProps?: BoxSlotProps | undefined;
  /** The action, when there is one. */
  actionProps?: BoxSlotProps | undefined;
}

export interface ToastProviderProps extends Omit<StyleProps, "position">, ToastSlotProps {
  /** The region that groups the toasts. It is a landmark, so it carries a label. */
  regionProps?: BoxSlotProps | undefined;
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
