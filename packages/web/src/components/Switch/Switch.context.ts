import { createContext, useContext } from "react";

import type { SemanticScaleName, Size } from "@stellaria/nebula-tokens";

export interface SwitchGroupContextValue {
  name: string | undefined;
  value: string[];
  toggle: (value: string) => void;
  size: Size;
  color: SemanticScaleName;
  disabled: boolean;
}

export const SwitchGroupContext = createContext<SwitchGroupContextValue | null>(null);

export function useSwitchGroupContext(): SwitchGroupContextValue | null {
  return useContext(SwitchGroupContext);
}
