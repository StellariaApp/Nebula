"use client";

import { createContext, useContext } from "react";

import type { HeroOrder, HeroSize } from "./Hero.types.js";

export interface HeroContextValue {
  titleId: string;
  order: HeroOrder;
  size: HeroSize;
}

export const HeroContext = createContext<HeroContextValue | null>(null);

export function useHero(): HeroContextValue {
  const context = useContext(HeroContext);
  if (context === null) throw new Error("Hero.* debe usarse dentro de <Hero>.");
  return context;
}
