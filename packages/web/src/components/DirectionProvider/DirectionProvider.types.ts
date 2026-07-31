import type { ReactNode } from "react";

export type Direction = "ltr" | "rtl";

export interface DirectionProviderProps {
  children: ReactNode;
  direction?: Direction | undefined;
  defaultDirection?: Direction | undefined;
  onDirectionChange?: ((direction: Direction) => void) | undefined;
  detectFromDocument?: boolean | undefined;
}

export interface DirectionContextValue {
  direction: Direction;
  setDirection: (direction: Direction) => void;
  toggleDirection: () => void;
}
