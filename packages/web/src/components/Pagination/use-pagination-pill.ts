"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useTheme } from "@stellaria/nebula-hooks";

import { SpringToEasing } from "../../utils/spring-easing.js";

/**
 * La pildora del activo, medida en vez de animada con la animacion de layout de motion.
 *
 * La animacion de layout compartido de motion era la unica cosa del catalogo que necesitaba
 * su juego de funciones, y `LazyMotion` no carga a la carta: para servirla, el provider tenia que
 * pedir el juego maximo en TODA pagina. Medido: son 34,32 kB brotli contra 22,30 — o sea que este
 * componente costaba **12 kB en cada ruta del sitio**, usara paginacion o no.
 *
 * Lo que hace ahora es lo que hace `Segment` con su indicador: se mide el boton activo y la
 * pildora se coloca con `transform`. La fisica no se pierde — el muelle del tema se muestrea a
 * `linear()` — y el desplazamiento lo lleva el compositor.
 */
interface Placement {
  x: number;
  y: number;
  width: number;
  height: number;
}

function Same(a: Placement | null, b: Placement | null): boolean {
  if (a === null || b === null) return a === b;
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

export interface PaginationPill {
  /** Se ata a la lista, que es contra quien se miden los desplazamientos. */
  listRef: (node: HTMLElement | null) => void;
  /** Se ata a cada boton de pagina. */
  SetItemRef: (page: number) => (node: HTMLButtonElement | null) => void;
  placement: Placement | null;
  duration: number;
  easing: string;
}

export function usePaginationPill(active: number): PaginationPill {
  const { theme } = useTheme();
  const list = useRef<HTMLElement | null>(null);
  const items = useRef(new Map<number, HTMLElement>());
  const [placement, set_placement] = useState<Placement | null>(null);

  const Measure = useCallback(() => {
    const node = items.current.get(active);
    /*
     * `offsetLeft` y `offsetTop` van contra el antecesor posicionado, que es la propia lista: los
     * `<li>` son estaticos. Sale un numero ya relativo y no hace falta restar dos rects, que es lo
     * que se descuadra cuando la lista tiene scroll.
     */
    const next =
      node === undefined || list.current === null
        ? null
        : {
            x: node.offsetLeft,
            y: node.offsetTop,
            width: node.offsetWidth,
            height: node.offsetHeight,
          };

    set_placement((current) => (Same(current, next) ? current : next));
  }, [active]);

  /*
   * Sin lista de dependencias a proposito: la pildora tiene que seguir al activo tambien cuando lo
   * que cambia es el numero de paginas o el ancho de un boton. `Same` corta el ciclo, asi que medir
   * en cada render no provoca un render mas.
   */
  useLayoutEffect(Measure);

  const SetItemRef = useCallback(
    (page: number) => (node: HTMLButtonElement | null) => {
      if (node === null) items.current.delete(page);
      else items.current.set(page, node);
    },
    [],
  );

  const list_ref = useCallback((node: HTMLElement | null) => {
    list.current = node;
  }, []);

  const timing = useMemo(() => SpringToEasing(theme.motion.spring.default), [theme]);

  return { listRef: list_ref, SetItemRef, placement, duration: timing.duration, easing: timing.easing };
}
