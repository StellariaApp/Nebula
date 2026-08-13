"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export const DEFER_ROOT_MARGIN = "300px 0px";

export interface UseDeferredBodyResult {
  ref: RefObject<HTMLElement | null>;
  mounted: boolean;
}

/**
 * Monta el cuerpo cuando la sección se acerca a la ventana, y no antes.
 *
 * Deliberadamente NO comparte la puerta de `useReveal`, aunque observe lo mismo. Esa se apaga con
 * `prefers-reduced-motion` y con `motion.tier: "minimal"`, que para animar es correcto —la animación
 * es la mejora— y para montar sería un fallo: quien pide menos movimiento se quedaría con la página
 * vacía. Montar no es una mejora, es la página.
 *
 * Sin `IntersectionObserver` monta de entrada, por la misma razón.
 */
export function useDeferredBody(
  enabled: boolean,
  rootMargin: string = DEFER_ROOT_MARGIN,
): UseDeferredBodyResult {
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, set_mounted] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (element === null || typeof IntersectionObserver === "undefined") {
      set_mounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) set_mounted(true);
      },
      { rootMargin },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled, rootMargin]);

  return { ref, mounted: !enabled || mounted };
}
