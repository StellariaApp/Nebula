"use client";

import { useSyncExternalStore } from "react";

const EMPTY = "";
const ROOT = "/";
const HASH = "#";

interface NavigationLike {
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

function Navigation(): NavigationLike | undefined {
  return (window as unknown as { navigation?: NavigationLike }).navigation;
}

function Subscribe(notify: () => void): () => void {
  const navigation = Navigation();
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
  navigation?.addEventListener("currententrychange", notify);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener("hashchange", notify);
    navigation?.removeEventListener("currententrychange", notify);
  };
}

function GetPathname(): string {
  return window.location.pathname;
}

function GetServerPathname(): string {
  return EMPTY;
}

export function usePathname(): string {
  return useSyncExternalStore(Subscribe, GetPathname, GetServerPathname);
}

export function NormalizePath(href: string): string {
  const path = href.split("?")[0]?.split(HASH)[0] ?? EMPTY;
  return path.length > 1 && path.endsWith(ROOT) ? path.slice(0, -1) : path;
}

export function BestPathMatch(hrefs: readonly string[], pathname: string): string | undefined {
  if (pathname === EMPTY) return undefined;

  const current = NormalizePath(pathname);
  let best: string | undefined;
  let length = -1;

  for (const href of hrefs) {
    const path = NormalizePath(href);
    if (path === EMPTY || !path.startsWith(ROOT)) continue;

    const hit = path === current || (path !== ROOT && current.startsWith(`${path}/`));
    if (hit && path.length > length) {
      best = href;
      length = path.length;
    }
  }

  return best;
}
