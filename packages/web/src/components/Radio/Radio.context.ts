import { createContext, useContext } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

export interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
  size: Size;
  color: ColorExtended;
  disabled: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext(): RadioGroupContextValue | null {
  return useContext(RadioGroupContext);
}
