"use client";

import { useEffect, useState } from "react";

import { useScrollSpy } from "@stellaria/nebula-hooks";

import { BestPathMatch, usePathname } from "../../utils/path-match.js";

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
  pathname?: string | undefined;
  enabled?: boolean | undefined;
}

export interface NavActiveResult {
  href: string | undefined;
  mode: NavResolvedMode;
}

const HASH = "#";

export { BestPathMatch, NormalizePath } from "../../utils/path-match.js";

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
  const { mode, active, offset, chrome, pathname: given, enabled = true } = options;

  const hrefs = items.map((item) => item.href);
  const resolved = ResolveMode(mode, active, hrefs);
  const is_hash = resolved === "hash";
  const spying = is_hash && enabled;

  const ids = is_hash
    ? hrefs.filter((href) => href.startsWith(HASH)).map((href) => href.slice(1))
    : [];

  const spy = useScrollSpy(ids, {
    enabled: spying,
    ...(offset === undefined ? {} : { offset }),
    ...(chrome === undefined ? {} : { chrome }),
  });

  const seen = usePathname();
  const pathname = given ?? seen;
  const claimed = items.find((item) => item.active === true)?.href;

  const spied = spy === undefined ? undefined : `${HASH}${spy}`;
  const pin = useAnchorPin(spying, spied);
  const pinned = pin !== undefined && hrefs.includes(pin) ? pin : undefined;

  const computed =
    resolved === "manual" ? active : is_hash ? (pinned ?? spied) : BestPathMatch(hrefs, pathname);

  return { href: claimed ?? computed, mode: resolved };
}
