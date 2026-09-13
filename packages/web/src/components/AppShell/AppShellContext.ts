"use client";

import { createContext, useContext, type RefObject } from "react";

import type { AppShellActiveMode, AppShellRailCollapse } from "./AppShell.types.js";

export interface AppShellState {
  collapsed: boolean;
  navigationLabel: string;
  complementaryLabel: string;
  /** ADR-153: la raíz retira su hueco y el carril se retira él; las dos reglas van juntas o sobra una. */
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

export interface AppShellActiveState {
  mode: AppShellActiveMode;
  /** The `href` the rail decided is active, or nothing in `manual` mode. */
  best: string | undefined;
  /** A `Link` announces its `href` on mount; the callback returned takes it back on unmount. */
  Register: (href: string) => () => void;
}

const ACTIVE_FALLBACK: AppShellActiveState = {
  mode: "manual",
  best: undefined,
  Register: () => () => undefined,
};

export const AppShellActiveContext = createContext<AppShellActiveState>(ACTIVE_FALLBACK);

export function useAppShellActive(): AppShellActiveState {
  return useContext(AppShellActiveContext);
}

export interface AppShellScrollState {
  /** Whether what scrolls in the shell has moved past zero (ADR-187). */
  scrolled: boolean;
  /** The element that scrolls: the `main` by default, or the `AppShell.Scroll` that adopted the role. */
  ref: RefObject<HTMLElement | null>;
  /** `AppShell.Scroll` hands its ref over on mount; the callback returned gives the role back. */
  Adopt: (ref: RefObject<HTMLElement | null>) => () => void;
}

const SCROLL_FALLBACK: AppShellScrollState = {
  scrolled: false,
  ref: { current: null },
  Adopt: () => () => undefined,
};

export const AppShellScrollContext = createContext<AppShellScrollState>(SCROLL_FALLBACK);

export function useAppShellScroll(): AppShellScrollState {
  return useContext(AppShellScrollContext);
}
