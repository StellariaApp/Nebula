"use client";

import { createContext, useContext } from "react";

export interface AppShellState {
  collapsed: boolean;
  navigationLabel: string;
  complementaryLabel: string;
}

const FALLBACK: AppShellState = {
  collapsed: false,
  navigationLabel: "Navegación principal",
  complementaryLabel: "Panel lateral",
};

export const AppShellContext = createContext<AppShellState>(FALLBACK);

export function useAppShell(): AppShellState {
  return useContext(AppShellContext);
}
