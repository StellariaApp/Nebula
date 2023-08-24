import CSS from "csstype";
import { ButtonHTMLAttributes, ReactNode } from "react";

export type CSSC<T, C> = CSS.Properties &
  ButtonHTMLAttributes<T> &
  C & {
    css?: string;
    children?: ReactNode;
  };
