import { useEffect, useState } from "react";

export interface UseScrolledOptions {
  enabled?: boolean | undefined;
  initial?: boolean | undefined;
}

/**
 * `initial` es lo que se devuelve en servidor y en el primer render del cliente; el efecto corrige
 * en cuanto monta. `enabled: false` no suscribe nada, para que un componente que ofrece la
 * funcionalidad como opción no cueste un listener de scroll cuando está apagada.
 */
export function useScrolled(threshold = 0, options: UseScrolledOptions = {}): boolean {
  const { enabled = true, initial = false } = options;
  const [scrolled, set_scrolled] = useState(initial);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      set_scrolled(initial);
      return;
    }

    let frame = 0;
    const Update = (): void => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        set_scrolled(window.scrollY > threshold);
        frame = 0;
      });
    };

    Update();
    window.addEventListener("scroll", Update, { passive: true });
    window.addEventListener("resize", Update);

    return () => {
      window.removeEventListener("scroll", Update);
      window.removeEventListener("resize", Update);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [threshold, enabled, initial]);

  return scrolled;
}
