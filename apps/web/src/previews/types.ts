import type { ReactNode } from "react";

export interface PreviewSample {
  label: string;
  node: ReactNode;
}

export interface PreviewGroup {
  title: string;
  items: readonly PreviewSample[];
}

export interface Preview {
  /** El componente sin nada puesto: lo que sale al escribirlo tal cual. */
  base: ReactNode;
  /** Las variantes si las tiene; si no, los props que de verdad cambian cómo se lee. */
  groups?: readonly PreviewGroup[];
  /** Una composición de producto, con su código. */
  usage?: { code: string; node: ReactNode };
}
