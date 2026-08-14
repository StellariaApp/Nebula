"use client";

import { createContext, useContext } from "react";

import type { HeroOrder, HeroSize } from "./Hero.types.js";

export interface HeroContextValue {
  titleId: string;
  order: HeroOrder | undefined;
  size: HeroSize;
}

export const HeroContext = createContext<HeroContextValue | null>(null);

export function useHero(): HeroContextValue {
  const context = useContext(HeroContext);
  if (context === null) throw new Error("Hero.* must be used inside <Hero>.");
  return context;
}
