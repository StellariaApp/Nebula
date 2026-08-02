"use client";

import { useEffect, useState, type RefObject } from "react";

const STUCK = new Set(["sticky", "fixed"]);

export function useStickyChrome(ref: RefObject<HTMLElement | null>): number | undefined {
  const [chrome, set_chrome] = useState<number | undefined>(undefined);

  useEffect(() => {
    const node = ref.current;
    if (node === null || typeof window === "undefined") return;

    const Bar = (): HTMLElement | null => {
      let current: HTMLElement | null = node;
      while (current !== null) {
        if (STUCK.has(getComputedStyle(current).position)) return current;
        current = current.parentElement;
      }
      return null;
    };

    const Measure = (): void => {
      const bar = Bar();
      set_chrome(bar === null ? undefined : Math.round(bar.getBoundingClientRect().height));
    };

    Measure();

    const observer = new ResizeObserver(Measure);
    observer.observe(node);
    window.addEventListener("resize", Measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", Measure);
    };
  }, [ref]);

  return chrome;
}
