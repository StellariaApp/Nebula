"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { useScrollSpy } from "@stellaria/nebula-hooks";

import type { NavActiveMode, NavResolvedMode } from "./Nav.types.js";

export interface NavItem {
  href: string;
  active?: boolean | undefined;
}

export interface NavActiveOptions {
  mode: NavActiveMode;
  active: string | undefined;
  offset: number | undefined;
  chrome: number | undefined;
}

export interface NavActiveResult {
  href: string | undefined;
  mode: NavResolvedMode;
}

const EMPTY = "";
const ROOT = "/";
const HASH = "#";

function Subscribe(notify: () => void): () => void {
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener("hashchange", notify);
  };
}

function GetPathname(): string {
  return window.location.pathname;
}

function GetServerPathname(): string {
  return EMPTY;
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

export function ResolveMode(
  mode: NavActiveMode,
  active: string | undefined,
  hrefs: readonly string[],
): NavResolvedMode {
  if (active !== undefined) return "manual";
  if (mode !== "auto") return mode;
  return hrefs.length > 0 && hrefs.every((href) => href.startsWith(HASH)) ? "hash" : "pathname";
}

function useAnchorPin(enabled: boolean, reached: string | undefined): string | undefined {
  const [pin, set_pin] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const OnHash = (): void => {
      set_pin(window.location.hash === "" ? undefined : window.location.hash);
    };
    const Release = (): void => {
      set_pin(undefined);
    };

    window.addEventListener("hashchange", OnHash);
    window.addEventListener("wheel", Release, { passive: true });
    window.addEventListener("touchstart", Release, { passive: true });
    window.addEventListener("keydown", Release);

    return () => {
      window.removeEventListener("hashchange", OnHash);
      window.removeEventListener("wheel", Release);
      window.removeEventListener("touchstart", Release);
      window.removeEventListener("keydown", Release);
    };
  }, [enabled]);

  useEffect(() => {
    if (pin !== undefined && reached === pin) set_pin(undefined);
  }, [pin, reached]);

  return pin;
}

export function useNavActive(
  items: readonly NavItem[],
  options: NavActiveOptions,
): NavActiveResult {
  const { mode, active, offset, chrome } = options;

  const hrefs = items.map((item) => item.href);
  const resolved = ResolveMode(mode, active, hrefs);
  const is_hash = resolved === "hash";

  const ids = is_hash
    ? hrefs.filter((href) => href.startsWith(HASH)).map((href) => href.slice(1))
    : [];

  const spy = useScrollSpy(ids, {
    enabled: is_hash,
    ...(offset === undefined ? {} : { offset }),
    ...(chrome === undefined ? {} : { chrome }),
  });

  const pathname = useSyncExternalStore(Subscribe, GetPathname, GetServerPathname);
  const claimed = items.find((item) => item.active === true)?.href;

  const spied = spy === undefined ? undefined : `${HASH}${spy}`;
  const pin = useAnchorPin(is_hash, spied);
  const pinned = pin !== undefined && hrefs.includes(pin) ? pin : undefined;

  const computed =
    resolved === "manual" ? active : is_hash ? (pinned ?? spied) : BestPathMatch(hrefs, pathname);

  return { href: claimed ?? computed, mode: resolved };
}
