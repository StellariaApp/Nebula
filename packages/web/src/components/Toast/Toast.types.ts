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
 * Las ranuras de cada notificacion. Se esparcen sobre TODAS las que muestre el proveedor: el
 * contenido de una notificacion llega por `nebulaToast`, no por composicion, asi que no hay forma
 * de ajustar una sola desde aqui.
 */
export interface ToastSlotProps {
  /** Cada notificacion. Lleva el `role` que decide su color: alert si es error o aviso. */
  toastProps?: BoxSlotProps | undefined;
  /** Envoltorio del icono, si la notificacion lo trae. */
  iconProps?: BoxSlotProps | undefined;
  /** Columna de titulo, mensaje y accion. */
  bodyProps?: BoxSlotProps | undefined;
  /** El titulo, si lo hay. */
  titleProps?: TextSlotProps | undefined;
  /** El mensaje, si lo hay. */
  messageProps?: BoxSlotProps | undefined;
  /** La accion, si la hay. */
  actionProps?: BoxSlotProps | undefined;
}

export interface ToastProviderProps extends Omit<StyleProps, "position">, ToastSlotProps {
  /** La region que agrupa las notificaciones. Es un landmark, asi que lleva rotulo. */
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
