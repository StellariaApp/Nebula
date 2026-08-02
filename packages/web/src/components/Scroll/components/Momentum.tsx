"use client";

import { useCallback, useRef, type ReactElement } from "react";

import { useMediaQuery, useMomentumScroll, useTheme } from "@stellaria/nebula-hooks";

import { MotionOff, ScrollSpring } from "../../../utils/motion.js";
import { Box } from "../../Box/Box.js";
import type { MomentumProps } from "../Scroll.types.js";

const REDUCED = "(prefers-reduced-motion: reduce)";

export function Momentum(props: MomentumProps): ReactElement {
  const { component, axis, spring, multiplier, forwardedRef, children, ...rest } = props;

  const node = useRef<HTMLElement | null>(null);
  const { theme } = useTheme();
  const reduced = useMediaQuery(REDUCED);

  useMomentumScroll(node, {
    enabled: !MotionOff({ theme, reduced }),
    axis: axis === "x" ? "x" : "y",
    spring: ScrollSpring(spring, theme),
    multiplier,
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
    <Box ref={SetRef} component={component ?? "div"} data-momentum="true" {...rest}>
      {children}
    </Box>
  );
}

Momentum.displayName = "ScrollMomentum";
