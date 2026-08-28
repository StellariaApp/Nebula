"use client";

import { useCallback, useRef, useState } from "react";

type Watcher = (visible: boolean) => void;

const WATCHERS = new WeakMap<Element, Watcher>();
const POOL = new Map<string, IntersectionObserver>();

function Pool(margin: string): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  const found = POOL.get(margin);
  if (found !== undefined) return found;
  const made = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) WATCHERS.get(entry.target)?.(entry.isIntersecting);
    },
    { rootMargin: margin },
  );
  POOL.set(margin, made);
  return made;
}

export function Watch(element: Element, margin: string, notify: Watcher): () => void {
  const observer = Pool(margin);
  if (observer === null) return () => undefined;
  WATCHERS.set(element, notify);
  observer.observe(element);
  return () => {
    observer.unobserve(element);
    WATCHERS.delete(element);
  };
}

export interface OnScreen {
  Track: (element: HTMLElement | null) => void;
  onscreen: boolean;
}

export function useOnScreen(enabled: boolean, margin = "0px"): OnScreen {
  const drop = useRef<(() => void) | null>(null);
  const [onscreen, set_onscreen] = useState(true);

  const Track = useCallback(
    (element: HTMLElement | null) => {
      drop.current?.();
      drop.current = null;
      if (!enabled || element === null) {
        set_onscreen(true);
        return;
      }
      drop.current = Watch(element, margin, set_onscreen);
    },
    [enabled, margin],
  );

  return { Track, onscreen };
}
