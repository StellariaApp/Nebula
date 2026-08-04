"use client";

import { useEffect, useRef, type CSSProperties, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { WithAlpha } from "../../utils/effects.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./StarField.css.js";
import type { StarFieldProps } from "./StarField.types.js";
import {
  accentColor,
  accentGlow,
  auroraAccent,
  auroraPrimary,
  gridCell,
  gridColor,
  starColor,
  starGlow,
} from "./StarField.vars.css.js";
import { useStarField } from "./useStarField.js";

const GRID_DRIFT = 0.018;
const STARS_DRIFT = 0.045;
const REDUCED = "(prefers-reduced-motion: reduce)";

export function StarField(props: StarFieldProps): ReactElement {
  const {
    density = "md",
    seed = 1,
    grid = true,
    gridSize = 56,
    fade = true,
    twinkle = true,
    parallax = false,
    scroller,
    color = "text.primary",
    accentColor: accent = "accent.400",
    accentEvery = 5,
    aurora = false,
    fixed = false,
    zIndex,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const animated = theme.motion.tier !== "minimal";
  const stars = useStarField(density, seed, accentEvery);

  const grid_ref = useRef<HTMLSpanElement>(null);
  const stars_ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!parallax || !animated) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia(REDUCED).matches) return;

    const node = scroller?.current ?? null;
    const target: Window | HTMLElement = node ?? window;

    let frame = 0;
    const OnScroll = (): void => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        const offset = node === null ? window.scrollY : node.scrollTop;
        if (grid_ref.current !== null) {
          grid_ref.current.style.transform = `translate3d(0, ${String(offset * GRID_DRIFT)}px, 0)`;
        }
        if (stars_ref.current !== null) {
          stars_ref.current.style.transform = `translate3d(0, ${String(offset * STARS_DRIFT)}px, 0)`;
        }
        frame = 0;
      });
    };

    OnScroll();
    target.addEventListener("scroll", OnScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", OnScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [parallax, animated, scroller]);

  const base = ResolveAccent(color, "400");
  const tint = ResolveAccent(accent, "400");

  const css_vars = assignInlineVars({
    [gridColor]: WithAlpha(base, 4),
    [gridCell]: `${String(gridSize)}px`,
    [starColor]: WithAlpha(base, 70),
    [starGlow]: `0 0 8px ${WithAlpha(base, 25)}`,
    [accentColor]: tint,
    [accentGlow]: `0 0 12px ${WithAlpha(tint, 45)}`,
    [auroraPrimary]: WithAlpha(ResolveAccent("primary.500"), 24),
    [auroraAccent]: WithAlpha(ResolveAccent("accent.400"), 12),
  });

  const twinkling = twinkle && animated;

  return (
    <span
      className={cx(styles.starField, sprinkle_class, className)}
      style={{
        ...css_vars,
        ...(zIndex === undefined ? {} : { zIndex }),
        ...sprinkle_style,
      }}
      data-fixed={fixed || parallax ? "true" : undefined}
      data-twinkle={twinkling ? "true" : "false"}
      aria-hidden="true"
      {...rest}
    >
      {aurora ? (
        <span className={styles.aurora} aria-hidden="true">
          {styles.auroraBlob.map((blob, i) => (
            <span
              key={blob}
              className={blob}
              data-still={twinkling ? undefined : "true"}
              style={{ animationDelay: `${String(i * -4)}s` }}
            />
          ))}
        </span>
      ) : null}

      {grid ? (
        <span ref={grid_ref} className={cx(styles.layer, styles.grid, fade && styles.faded)} />
      ) : null}
      <span ref={stars_ref} className={cx(styles.layer, fade && styles.faded)}>
        {stars.map((item) => {
          const geometry: CSSProperties = {
            left: `${String(item.left)}%`,
            top: `${String(item.top)}%`,
            width: `${String(item.size)}px`,
            height: `${String(item.size)}px`,
            animationDelay: `calc(${vars.motion.duration.expressive} * ${String(-6 * item.phase)})`,
          };
          return (
            <i
              key={`${String(item.left)}-${String(item.top)}`}
              className={styles.star}
              style={geometry}
              data-accent={item.accent ? "true" : "false"}
              data-twinkle={twinkling ? "true" : "false"}
            />
          );
        })}
      </span>
    </span>
  );
}

StarField.displayName = "StarField";
