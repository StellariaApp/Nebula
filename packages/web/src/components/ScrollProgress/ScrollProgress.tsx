"use client";

import { useCallback, useEffect, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { LengthToCss } from "../../utils/token-css.js";

import * as styles from "./ScrollProgress.css.js";
import * as scroll_progress_vars from "./ScrollProgress.vars.css.js";
import type { ScrollProgressProps } from "./ScrollProgress.types.js";

const DEFAULT_HEIGHT = 3;
const PERCENT = 100;

function Ratio(scrolled: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, scrolled / total));
}

export function ScrollProgress(props: ScrollProgressProps): ReactElement {
  const {
    target,
    position = "top",
    height = DEFAULT_HEIGHT,
    color = "primary",
    radius = "none",
    withTrack = false,
    onProgress,
    label = "Progreso de lectura",
    className,
    barProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const [value, set_value] = useState(0);

  const Measure = useCallback((): void => {
    const node = target?.current ?? null;
    const next =
      node === null
        ? Ratio(window.scrollY, document.documentElement.scrollHeight - window.innerHeight)
        : Ratio(node.scrollTop, node.scrollHeight - node.clientHeight);
    set_value(next);
    onProgress?.(next);
  }, [target, onProgress]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = target?.current ?? null;
    const source: HTMLElement | Window = node ?? window;
    let frame = 0;
    const OnScroll = (): void => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        Measure();
        frame = 0;
      });
    };
    Measure();
    source.addEventListener("scroll", OnScroll, { passive: true });
    window.addEventListener("resize", OnScroll, { passive: true });
    return () => {
      source.removeEventListener("scroll", OnScroll);
      window.removeEventListener("resize", OnScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [target, Measure]);

  const percent = Math.round(value * PERCENT);

  const css_vars = assignInlineVars({
    [scroll_progress_vars.barColor]: ResolveAccent(color, "600"),
    [scroll_progress_vars.barHeight]: LengthToCss(height),
    [scroll_progress_vars.progress]: `${String(percent)}%`,
  });

  return (
    <div
      className={cx(styles.root, styles.radius[radius], sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-position={position}
      data-track={withTrack ? "true" : undefined}
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={PERCENT}
      {...rest}
    >
      <Box {...barProps} className={cx(styles.bar, styles.radius[radius], barProps?.className)} />
    </div>
  );
}

ScrollProgress.displayName = "ScrollProgress";
