import { createContext, useContext } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

export interface SwitchGroupContextValue {
  name: string | undefined;
  value: string[];
  toggle: (value: string) => void;
  size: Size;
  color: ColorExtended;
  disabled: boolean;
}

export const SwitchGroupContext = createContext<SwitchGroupContextValue | null>(null);

export function useSwitchGroupContext(): SwitchGroupContextValue | null {
  return useContext(SwitchGroupContext);
}
