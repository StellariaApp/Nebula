import type { ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: string;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  disabled?: boolean | undefined;
}

export type RenderOption = (option: SelectOption, state: OptionRenderState) => ReactNode;

export interface OptionRenderState {
  isSelected: boolean;
  isFocused: boolean;
  isDisabled: boolean;
}

export function DisabledKeys(data: readonly SelectOption[]): string[] {
  return data.filter((option) => option.disabled === true).map((option) => option.value);
}

export function OptionByValue(
  data: readonly SelectOption[],
  value: string | null | undefined,
): SelectOption | undefined {
  if (value === null || value === undefined) return undefined;
  return data.find((option) => option.value === value);
}
