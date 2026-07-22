import { createContext, useContext } from "react";

import type { SemanticScaleName, Size } from "@stellaria/nebula-tokens";

export interface RadioGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
  size: Size;
  color: SemanticScaleName;
  disabled: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext(): RadioGroupContextValue | null {
  return useContext(RadioGroupContext);
}
