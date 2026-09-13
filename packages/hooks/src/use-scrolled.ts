import { useEffect, useState, type RefObject } from "react";

export interface UseScrolledOptions {
  enabled?: boolean | undefined;
  initial?: boolean | undefined;
  /**
   * The element whose `scrollTop` is measured instead of the window (ADR-187): the `main` of a
   * rail layout, a `Scroll` inside it. A ref is read when the effect runs; if it holds nothing yet,
   * the hook reports `initial` until the ref object itself changes.
   */
  scroller?: RefObject<HTMLElement | null> | HTMLElement | null | undefined;
}

function Target(scroller: UseScrolledOptions["scroller"]): HTMLElement | Window | null {
  if (scroller === undefined) return window;
  if (scroller === null) return null;
  return "current" in scroller ? scroller.current : scroller;
}

function Offset(target: HTMLElement | Window): number {
  return target === window ? window.scrollY : (target as HTMLElement).scrollTop;
}

/**
 * `initial` es lo que se devuelve en servidor y en el primer render del cliente; el efecto corrige
 * en cuanto monta. `enabled: false` no suscribe nada, para que un componente que ofrece la
 * funcionalidad como opción no cueste un listener de scroll cuando está apagada.
 */
export function useScrolled(threshold = 0, options: UseScrolledOptions = {}): boolean {
  const { enabled = true, initial = false, scroller } = options;
  const [scrolled, set_scrolled] = useState(initial);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      set_scrolled(initial);
      return;
    }
    const target = Target(scroller);
    if (target === null) {
      set_scrolled(initial);
      return;
    }

    let frame = 0;
    const Update = (): void => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        set_scrolled(Offset(target) > threshold);
        frame = 0;
      });
    };

    Update();
    target.addEventListener("scroll", Update, { passive: true });
    window.addEventListener("resize", Update);

    return () => {
      target.removeEventListener("scroll", Update);
      window.removeEventListener("resize", Update);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [threshold, enabled, initial, scroller]);

  return scrolled;
}
