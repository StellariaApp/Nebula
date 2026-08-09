"use client";

import { createContext, useContext } from "react";

import type { SectionOrder } from "./Section.types.js";

export interface SectionContextValue {
  titleId: string;
  order: SectionOrder;
}

export const SectionContext = createContext<SectionContextValue | null>(null);

export function useSection(): SectionContextValue {
  const context = useContext(SectionContext);
  if (context === null) throw new Error("Section.* must be used inside <Section>.");
  return context;
}
