"use client";

import { createContext, useContext } from "react";

export interface AppShellState {
  collapsed: boolean;
  navigationLabel: string;
  complementaryLabel: string;
}

const FALLBACK: AppShellState = {
  collapsed: false,
  navigationLabel: "Main navigation",
  complementaryLabel: "Side panel",
};

export const AppShellContext = createContext<AppShellState>(FALLBACK);

export function useAppShell(): AppShellState {
  return useContext(AppShellContext);
}
