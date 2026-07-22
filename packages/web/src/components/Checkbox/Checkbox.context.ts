import { createContext, useContext } from "react";

import type { SemanticScaleName, Size } from "@stellaria/nebula-tokens";

export interface CheckboxGroupContextValue {
  name: string | undefined;
  value: string[];
  toggle: (value: string) => void;
  size: Size;
  color: SemanticScaleName;
  disabled: boolean;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext(): CheckboxGroupContextValue | null {
  return useContext(CheckboxGroupContext);
}
