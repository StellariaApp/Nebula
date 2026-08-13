"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const DEFER_ROOT_MARGIN = "300px 0px";

export interface UseDeferredBodyResult {
  ref: (node: HTMLElement | null) => void;
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
 * **El `ref` es una función y no un objeto, y eso no es estilo.** `Section` cambia su elemento raíz
 * de `section` a `m.section` cuando `useReveal` se arma, y cambiar el tipo de un elemento hace que
 * React desmonte y vuelva a montar todo el subárbol. Con un `RefObject` el observador se quedaba
 * mirando el hueco original —ya huérfano— y no disparaba nunca: la banda no llegaba a montarse. Con
 * ref de función, cada nodo nuevo vuelve a suscribirse.
 *
 * Sin `IntersectionObserver` monta de entrada, por la misma razón que arriba.
 */
export function useDeferredBody(
  enabled: boolean,
  rootMargin: string = DEFER_ROOT_MARGIN,
): UseDeferredBodyResult {
  const [mounted, set_mounted] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    return () => {
      observer.current?.disconnect();
      observer.current = null;
    };
  }, []);

  const Attach = useCallback(
    (node: HTMLElement | null) => {
      observer.current?.disconnect();
      observer.current = null;
      if (!enabled || node === null) return;

      if (typeof IntersectionObserver === "undefined") {
        set_mounted(true);
        return;
      }

      const watcher = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) set_mounted(true);
        },
        { rootMargin },
      );
      watcher.observe(node);
      observer.current = watcher;
    },
    [enabled, rootMargin],
  );

  return { ref: Attach, mounted: !enabled || mounted };
}
