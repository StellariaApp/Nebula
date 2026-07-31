"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Portal } from "../Portal/Portal.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import { accent, bar, thickness, track } from "./NProgress.css.js";
import type { NProgressProps } from "./NProgress.types.js";

const TICK = 400;
const CEILING = 90;

export function NProgress(props: NProgressProps): ReactElement | null {
  const {
    loading = false,
    value,
    color = "primary",
    height = 3,
    zIndex = 400,
    label = "Cargando la página",
    withinPortal = true,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const is_controlled = value !== undefined;
  const [auto, set_auto] = useState(0);
  const timer_ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (is_controlled) return;
    if (!loading) {
      set_auto(0);
      return;
    }
    set_auto(12);
    timer_ref.current = setInterval(() => {
      set_auto((current) => (current >= CEILING ? current : current + (CEILING - current) / 8));
    }, TICK);
    return () => {
      if (timer_ref.current !== null) clearInterval(timer_ref.current);
    };
  }, [loading, is_controlled]);

  const progress = is_controlled ? value : auto;
  if (!loading && !is_controlled) return null;

  const node = (
    <div
      className={cx(track, sprinkle_class, className)}
      style={{
        ...assignInlineVars({
          [accent]: ResolveAccent(color, "500"),
          [thickness]: `${String(height)}px`,
        }),
        zIndex,
        ...sprinkle_style,
      }}
    >
      <div
        className={bar}
        style={{ transform: `scaleX(${String(Math.max(0, Math.min(100, progress)) / 100)})` }}
      />
      <VisuallyHidden
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {label}
      </VisuallyHidden>
    </div>
  );

  return withinPortal ? <Portal>{node}</Portal> : node;
}

NProgress.displayName = "NProgress";
