"use client";

import { createContext, useContext } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { ChipVariant } from "./Chip.types.js";

export interface ChipGroupContextValue {
  value: readonly string[];
  toggle: (entry: string) => void;
  multiple: boolean;
  size: Size | undefined;
  color: ColorExtended | undefined;
  variant: ChipVariant | undefined;
  disabled: boolean | undefined;
  name: string | undefined;
}

export const ChipGroupContext = createContext<ChipGroupContextValue | null>(null);

export function useChipGroupContext(): ChipGroupContextValue | null {
  return useContext(ChipGroupContext);
}
