import { useCallback, useEffect, useMemo, useState, type RefObject, type UIEvent } from "react";

export interface WindowedList {
  start: number;
  end: number;
  padStart: number;
  padEnd: number;
  OnScroll: (event: UIEvent<HTMLElement>) => void;
}

export interface WindowedListInput {
  count: number;
  rowHeight: number;
  viewportHeight: number;
  overscan: number;
  focusedIndex: number;
  enabled: boolean;
  scrollRef: RefObject<HTMLElement | null>;
}

const NONE: Omit<WindowedList, "OnScroll"> = { start: 0, end: 0, padStart: 0, padEnd: 0 };

/**
 * Ventana sobre una lista de filas de altura uniforme. Sustituye a `@tanstack/react-virtual` en el
 * entry principal (ADR-061): la lista de un `Combobox` es de una columna y altura fija, así que la
 * ventana es aritmética sobre `scrollTop` y no necesita un motor de medición.
 */
export function useWindowedList(input: WindowedListInput): WindowedList {
  const { count, rowHeight, viewportHeight, overscan, focusedIndex, enabled, scrollRef } = input;
  const [scroll_top, set_scroll_top] = useState(0);

  const OnScroll = useCallback((event: UIEvent<HTMLElement>): void => {
    set_scroll_top(event.currentTarget.scrollTop);
  }, []);

  /** El foco de React Aria se mueve por teclado sin scrollear: la ventana lo persigue. */
  useEffect(() => {
    if (!enabled || focusedIndex < 0) return;
    const node = scrollRef.current;
    if (node === null) return;
    const top = focusedIndex * rowHeight;
    const bottom = top + rowHeight;
    if (top < node.scrollTop) node.scrollTop = top;
    else if (bottom > node.scrollTop + node.clientHeight) {
      node.scrollTop = bottom - node.clientHeight;
    }
  }, [enabled, focusedIndex, rowHeight, scrollRef]);

  return useMemo(() => {
    if (!enabled || count === 0) return { ...NONE, end: count, OnScroll };

    const visible = Math.ceil(viewportHeight / rowHeight);
    const raw_start = Math.floor(scroll_top / rowHeight) - overscan;
    const start = Math.max(0, Math.min(raw_start, Math.max(0, count - visible - overscan)));
    const raw_end = start + visible + overscan * 2;
    const end = Math.min(count, Math.max(raw_end, focusedIndex + 1));
    const safe_start = Math.min(start, focusedIndex < 0 ? start : focusedIndex);

    return {
      start: safe_start,
      end,
      padStart: safe_start * rowHeight,
      padEnd: Math.max(0, (count - end) * rowHeight),
      OnScroll,
    };
  }, [enabled, count, rowHeight, viewportHeight, overscan, scroll_top, focusedIndex, OnScroll]);
}
