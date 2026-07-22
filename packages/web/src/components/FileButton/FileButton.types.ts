import type { ReactNode } from "react";

export type FileButtonPayload = File | File[] | null;

export interface FileButtonProps {
  onChange: (payload: FileButtonPayload) => void;
  children: (props: { onClick: () => void }) => ReactNode;
  accept?: string | undefined;
  multiple?: boolean | undefined;
  name?: string | undefined;
  capture?: boolean | "user" | "environment" | undefined;
  disabled?: boolean | undefined;
  resetRef?: ((reset: () => void) => void) | undefined;
}
