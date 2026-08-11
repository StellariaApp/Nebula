"use client";

import { useMediaQuery, useMomentumScroll, useTheme } from "@stellaria/nebula-hooks";
import { useEffect, useRef, useState } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

/** El mismo empuje que la portada da con `Main momentum`. */
const MULTIPLIER = 2.4;

const SCROLLS = new Set(["auto", "scroll", "overlay"]);

function Scrollable(node: HTMLElement): boolean {
  const style = getComputedStyle(node);
  return SCROLLS.has(style.overflowY) || SCROLLS.has(style.overflowX);
}

/**
 * Lo que casa el selector, o el primer descendiente suyo que scrollee. El carril es lo segundo: su
 * `aside` es la columna del grid y quien lleva el scroll es el contenedor de dentro, sin nombre.
 */
function Resolve(target: string): HTMLElement | null {
  const root = document.querySelector(target);
  if (!(root instanceof HTMLElement)) return null;
  if (Scrollable(root)) return root;
  for (const node of root.querySelectorAll("*")) {
    if (node instanceof HTMLElement && Scrollable(node)) return node;
  }
  return null;
}

/**
 * El scroller del chasis es el `main` del `AppShell`, no la ventana, así que el momentum se engancha
 * por id en vez de por `Main`. No pinta nada: solo suscribe la rueda a un muelle.
 */
export function Momentum({ target }: { target: string }): null {
  const scroller = useRef<HTMLElement | null>(null);
  const [found, set_found] = useState(false);
  const { theme } = useTheme();
  const reduced = useMediaQuery(REDUCED);

  useEffect(() => {
    scroller.current = Resolve(target);
    set_found(scroller.current !== null);
  }, [target]);

  useMomentumScroll(scroller, {
    enabled: found && !reduced && theme.motion.tier !== "minimal",
    multiplier: MULTIPLIER,
  });

  return null;
}
