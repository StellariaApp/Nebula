"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ITEM_ATTR = "data-nav-item";

interface Overflow {
  Track: (node: HTMLElement | null) => void;
  visible: number;
}

/**
 * Priority+: mide el ancho real de cada enlace y devuelve cuántos caben. No se puede
 * resolver por número de enlaces porque el que desborda depende del texto y de la fuente.
 */
export function UseNavOverflow(total: number, reserve: number, enabled: boolean): Overflow {
  const root = useRef<HTMLElement | null>(null);
  const widths = useRef<number[]>([]);
  const [visible, set_visible] = useState(total);

  const Measure = useCallback(() => {
    const node = root.current;
    if (node === null) return;
    if (widths.current.length !== total) {
      const items = node.querySelectorAll<HTMLElement>(`[${ITEM_ATTR}]`);
      if (items.length !== total) return;
      const style = window.getComputedStyle(node);
      const gap = Number.parseFloat(style.columnGap) || 0;
      widths.current = Array.from(items, (item, i) => item.offsetWidth + (i === 0 ? 0 : gap));
    }
    const available = node.clientWidth - reserve;
    let used = 0;
    let fits = 0;
    for (const width of widths.current) {
      used += width;
      if (used > available) break;
      fits += 1;
    }
    set_visible(fits === total ? total : Math.max(0, fits));
  }, [total, reserve]);

  const Track = useCallback(
    (node: HTMLElement | null) => {
      root.current = node;
      widths.current = [];
      if (node !== null) Measure();
    },
    [Measure],
  );

  useEffect(() => {
    if (!enabled) {
      set_visible(total);
      return undefined;
    }
    const node = root.current;
    if (node === null || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(Measure);
    observer.observe(node);
    Measure();
    return () => {
      observer.disconnect();
    };
  }, [enabled, total, Measure]);

  return { Track, visible: enabled ? visible : total };
}

export const NAV_ITEM_ATTR = ITEM_ATTR;
