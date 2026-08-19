import { useEffect, useState } from "react";

import { breakpoints, type BreakpointName } from "@stellaria/nebula-tokens";

/**
 * `initial` es lo que se devuelve en servidor y en el primer render del cliente. React 19 avisa de
 * hidratación si el servidor y el cliente discrepan, así que el consumidor decide qué suponer:
 * asumir `false` es lo seguro para «ocultar en móvil», y `true` para «mostrar en escritorio».
 */
export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, set_matches] = useState(initial);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const list = window.matchMedia(query);
    const Update = (): void => {
      set_matches(list.matches);
    };
    Update();
    list.addEventListener("change", Update);
    return () => {
      list.removeEventListener("change", Update);
    };
  }, [query]);

  return matches;
}

/**
 * Los puntos de ruptura salen del token, no del tema (ADR-174). Es lo unico que hace que estos dos
 * hooks midan lo mismo que las `@media` de las hojas, que no pueden leer una var y por tanto no
 * pueden seguir a un tema.
 */
export function useBreakpointUp(name: BreakpointName, initial = false): boolean {
  return useMediaQuery(`(min-width: ${String(breakpoints[name])}px)`, initial);
}

export function useBreakpointDown(name: BreakpointName, initial = false): boolean {
  return useMediaQuery(`(max-width: ${String(breakpoints[name] - 1)}px)`, initial);
}
