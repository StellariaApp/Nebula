"use client";

import { useEffect, useRef, type ReactElement } from "react";

import { Scroll } from "../../Scroll/Scroll.js";

import type { AppShellScrollProps } from "../AppShell.types.js";
import { useAppShellScroll } from "../AppShellContext.js";

export function AppShellScroll(props: AppShellScrollProps): ReactElement {
  const { momentum = true, bounce = true, smooth = true, children, ...rest } = props;
  const ref = useRef<HTMLElement | null>(null);
  const { Adopt } = useAppShellScroll();

  useEffect(() => Adopt(ref), [Adopt]);

  return (
    <Scroll ref={ref} momentum={momentum} bounce={bounce} smooth={smooth} {...rest}>
      {children}
    </Scroll>
  );
}
