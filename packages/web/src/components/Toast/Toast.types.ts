import type { ReactNode } from "react";

import type { SemanticScaleName } from "@stellaria/nebula-tokens";

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
  color?: SemanticScaleName | undefined;
  icon?: ReactNode | undefined;
  duration?: number | undefined;
  dismissible?: boolean | undefined;
  action?: ReactNode | undefined;
}

export interface ToastRecord extends ToastOptions {
  id: string;
  color: SemanticScaleName;
  duration: number;
  dismissible: boolean;
}

export interface ToastProviderProps {
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
