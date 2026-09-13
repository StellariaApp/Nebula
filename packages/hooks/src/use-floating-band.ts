import { useEffect, useState } from "react";

export interface FloatingBandResult {
  /** Where the visible area starts: the bottom edge of the lowest `data-floating="header"`. */
  ceiling: number;
  /** Where it ends: the top edge of the highest bar that is not a header (`footer`, `dock`…). */
  floor: number;
}

export interface CenterOnOptions {
  behavior?: ScrollBehavior | undefined;
}

const ATTRIBUTE = "data-floating";
const HEADER = "header";
const SCROLLS = new Set(["auto", "scroll", "overlay"]);

function Scrolls(element: HTMLElement): boolean {
  const overflow = getComputedStyle(element).overflowY;
  return SCROLLS.has(overflow) && element.scrollHeight > element.clientHeight;
}

/** The nearest ancestor that actually scrolls, or the document when none does. */
export function Scrollable(element: HTMLElement): HTMLElement {
  let current = element.parentElement;
  while (current !== null) {
    if (Scrolls(current)) return current;
    current = current.parentElement;
  }
  return (document.scrollingElement ?? document.documentElement) as HTMLElement;
}

/**
 * Measures every `[data-floating]` in the document: the `header` ones push the ceiling down, the
 * rest pull the floor up. Bars with no height — a dock folded away by a media query — do not count.
 */
export function FloatingBand(height: number): FloatingBandResult {
  let ceiling = 0;
  let floor = height;

  for (const floating of document.querySelectorAll(`[${ATTRIBUTE}]`)) {
    const frame = floating.getBoundingClientRect();
    if (frame.height === 0) continue;
    if (floating.getAttribute(ATTRIBUTE) === HEADER) ceiling = Math.max(ceiling, frame.bottom);
    else floor = Math.min(floor, frame.top);
  }

  return { ceiling, floor };
}

/** Scrolls the element's own scroller so the element sits centred BETWEEN the floating bars. */
export function CenterOn(element: HTMLElement, options: CenterOnOptions = {}): void {
  const { behavior = "smooth" } = options;
  const box = Scrollable(element);
  const plate = element.getBoundingClientRect();
  const bottom =
    box === (document.scrollingElement ?? document.documentElement)
      ? window.innerHeight
      : box.getBoundingClientRect().bottom;
  const { ceiling, floor } = FloatingBand(bottom);
  const target = box.scrollTop + plate.top + plate.height / 2 - (ceiling + floor) / 2;
  box.scrollTo({ behavior, top: target });
}

/** The band, kept current on scroll and resize. Server and first client render report the window. */
export function useFloatingBand(): FloatingBandResult {
  const [band, set_band] = useState<FloatingBandResult>({ ceiling: 0, floor: 0 });

  useEffect(() => {
    let frame = 0;
    const Update = (): void => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        set_band(FloatingBand(window.innerHeight));
        frame = 0;
      });
    };

    Update();
    window.addEventListener("scroll", Update, { passive: true, capture: true });
    window.addEventListener("resize", Update);

    return () => {
      window.removeEventListener("scroll", Update, { capture: true });
      window.removeEventListener("resize", Update);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return band;
}
