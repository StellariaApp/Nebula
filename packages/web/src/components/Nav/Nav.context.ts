"use client";

import { createContext, useContext } from "react";

import type { NavResolvedMode } from "./Nav.types.js";

export interface NavLinksContextValue {
  activeHref: string | undefined;
  mode: NavResolvedMode;
  SetItemRef: (key: string) => (node: HTMLElement | null) => void;
}

export const NavLinksContext = createContext<NavLinksContextValue | null>(null);

export function useNavLinks(): NavLinksContextValue | null {
  return useContext(NavLinksContext);
}
