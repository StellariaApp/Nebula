"use client";

import { createContext, useContext } from "react";

import type { SemanticScaleName, Size } from "@stellaria/nebula-tokens";

import type { SegmentVariant } from "./Segment.types.js";

export interface SegmentContextValue {
  value: string;
  SetValue: (next: string) => void;
  size: Size;
  variant: SegmentVariant | undefined;
  color: SemanticScaleName;
  disabled: boolean;
  fullWidth: boolean;
  draggable: boolean;
  baseId: string;
  hasPanels: boolean;
  RegisterPanels: (values: string[]) => void;
  panels: string[];
}

export const SegmentContext = createContext<SegmentContextValue | null>(null);

export function useSegment(): SegmentContextValue {
  const context = useContext(SegmentContext);
  if (context === null) throw new Error("Segment.* debe usarse dentro de <Segment>.");
  return context;
}
