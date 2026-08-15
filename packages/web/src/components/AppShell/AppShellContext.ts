"use client";

import { createContext, useContext } from "react";

import type { AppShellRailCollapse } from "./AppShell.types.js";

export interface AppShellState {
  collapsed: boolean;
  navigationLabel: string;
  complementaryLabel: string;
  /** ADR-150: la raíz retira su hueco y el carril se retira él; las dos reglas van juntas o sobra una. */
  railCollapse: AppShellRailCollapse;
}

const FALLBACK: AppShellState = {
  collapsed: false,
  navigationLabel: "Main navigation",
  complementaryLabel: "Side panel",
  railCollapse: "mini",
};

export const AppShellContext = createContext<AppShellState>(FALLBACK);

export function useAppShell(): AppShellState {
  return useContext(AppShellContext);
}
