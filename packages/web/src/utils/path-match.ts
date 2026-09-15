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

/**
 * `currententrychange` fires synchronously inside `history.pushState`, and a router may call
 * that from a `useInsertionEffect` — Next's app router does. Notifying the store right there
 * schedules a React update during an insertion effect, which React forbids. A microtask
 * lets the commit finish first; the snapshot is read afterwards, so nothing is lost.
 */
function Subscribe(notify: () => void): () => void {
  const navigation = Navigation();
  const later = () => queueMicrotask(notify);
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
  navigation?.addEventListener("currententrychange", later);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener("hashchange", notify);
    navigation?.removeEventListener("currententrychange", later);
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
