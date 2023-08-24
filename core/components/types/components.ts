import { ButtonHTMLAttributes, ReactNode } from "react";

export type CSSC<T, C> = ButtonHTMLAttributes<T> &
  C & {
    css?: string;
    children?: ReactNode;
  };
