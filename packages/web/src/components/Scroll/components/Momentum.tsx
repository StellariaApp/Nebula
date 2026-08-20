"use client";

import { useCallback, useRef, type ReactElement } from "react";

import { useMediaQuery, useMomentumScroll, useTheme } from "@stellaria/nebula-hooks";

import { MotionOff, ScrollSpring } from "../../../utils/motion.js";
import { Box } from "../../Box/Box.js";
import * as scroll_vars from "../Scroll.vars.css.js";
import type { MomentumProps } from "../Scroll.types.js";

const REDUCED = "(prefers-reduced-motion: reduce)";
/**
 * Cuanto puede llegar a ceder el borde, en pixeles.
 *
 * Exagerado a proposito: el estiron es asintotico, asi que estos 180 no se alcanzan de un tick —
 * se ganan empujando, y cuanto mas estirado esta menos suma cada muesca. Un tope que apenas cede no
 * comunica que se acabo el recorrido; uno que cede de verdad, si.
 */
const BOUNCE_DISTANCE = 280;

export function Momentum(props: MomentumProps): ReactElement {
  const { component, axis, spring, multiplier, bounce, forwardedRef, children, ...rest } = props;

  const node = useRef<HTMLElement | null>(null);
  const { theme } = useTheme();
  const reduced = useMediaQuery(REDUCED);

  const OnBounce = useCallback((offset: number): void => {
    const element = node.current;
    if (element === null) return;
    element.style.setProperty(scroll_vars.bounceOffset, `${String(-offset)}px`);
  }, []);

  useMomentumScroll(node, {
    enabled: !MotionOff({ theme, reduced }),
    axis: axis === "x" ? "x" : "y",
    spring: ScrollSpring(spring, theme),
    multiplier,
    bounce: bounce ? BOUNCE_DISTANCE : 0,
    onBounce: OnBounce,
  });

  const SetRef = useCallback(
    (element: Element | null) => {
      const html = element instanceof HTMLElement ? element : null;
      node.current = html;
      if (forwardedRef === undefined || forwardedRef === null) return;
      if (typeof forwardedRef === "function") forwardedRef(html);
      else forwardedRef.current = html;
    },
    [forwardedRef],
  );

  return (
    <Box
      ref={SetRef}
      component={component ?? "div"}
      data-momentum="true"
      data-bounce={bounce ? "true" : undefined}
      {...rest}
    >
      {children}
    </Box>
  );
}

Momentum.displayName = "ScrollMomentum";
