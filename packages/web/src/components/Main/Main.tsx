"use client";

import { useCallback, useEffect, useId, useRef, type ReactElement } from "react";

import { useAnchorSpring, useMediaQuery, useMomentumPage, useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { MotionOff, ScrollSpring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss, SpaceToCss } from "../../utils/token-css.js";

import * as styles from "./Main.css.js";
import type { MainProps } from "./Main.types.js";
import { contentGap, contentMax } from "./Main.vars.css.js";

const REDUCED = "(prefers-reduced-motion: reduce)";
const BOUNCE_DISTANCE = 120;
const STUCK = new Set(["sticky", "fixed"]);

export function Main(props: MainProps): ReactElement {
  const {
    children,
    header,
    footer,
    background,
    centered = true,
    padded = false,
    contentWidth,
    spacing,
    momentum = false,
    bounce = true,
    smooth = true,
    spring = "default",
    multiplier = 2.4,
    skipLabel = "Saltar al contenido",
    withSkipLink = false,
    id,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const reduced = useMediaQuery(REDUCED);
  const content_ref = useRef<HTMLElement>(null);
  const root_ref = useRef<HTMLDivElement>(null);

  const OnBounce = useCallback((offset: number): void => {
    const node = content_ref.current;
    if (node === null) return;
    node.style.transform = offset === 0 ? "" : `translate3d(0, ${String(-offset)}px, 0)`;
  }, []);

  const animate = !MotionOff({ theme, reduced });

  useMomentumPage({
    enabled: momentum && animate,
    spring: ScrollSpring(spring, theme),
    multiplier,
    bounce: bounce ? BOUNCE_DISTANCE : 0,
    onBounce: OnBounce,
  });

  useAnchorSpring({
    enabled: smooth && animate,
    spring: ScrollSpring(spring, theme),
  });

  useEffect(() => {
    if (!smooth || !animate || typeof document === "undefined") return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, [smooth, animate]);

  useEffect(() => {
    const shell = root_ref.current;
    if (shell === null || header === undefined || typeof window === "undefined") return;
    const root = document.documentElement;
    const previous = root.style.scrollPaddingTop;

    const Bar = (): HTMLElement | null => {
      for (const child of shell.children) {
        if (!(child instanceof HTMLElement)) continue;
        if (child.tagName === "MAIN") break;
        if (STUCK.has(getComputedStyle(child).position)) return child;
      }
      return null;
    };

    const Measure = (): void => {
      const bar = Bar();
      if (bar === null) return;
      root.style.scrollPaddingTop = `${String(Math.round(bar.getBoundingClientRect().height))}px`;
    };

    Measure();
    const observer = new ResizeObserver(Measure);
    observer.observe(shell);

    return () => {
      observer.disconnect();
      root.style.scrollPaddingTop = previous;
    };
  }, [header]);

  const auto_id = useId();
  const content_id = id ?? auto_id;

  const content_vars = assignInlineVars({
    ...(contentWidth === undefined ? {} : { [contentMax]: LengthToCss(contentWidth) }),
    ...(spacing === undefined ? {} : { [contentGap]: SpaceToCss(spacing) }),
  });

  return (
    <div
      ref={root_ref}
      className={cx(styles.root, sprinkle_class, className)}
      style={sprinkle_style}
    >
      {withSkipLink ? (
        <a href={`#${content_id}`} className={styles.skip}>
          {skipLabel}
        </a>
      ) : null}

      {background === undefined ? null : (
        <div className={styles.backdrop} aria-hidden="true">
          {background}
        </div>
      )}

      {header}

      <main
        ref={content_ref}
        id={content_id}
        tabIndex={-1}
        className={styles.content}
        style={content_vars}
        data-padded={padded ? "true" : undefined}
        data-centered={centered ? "true" : undefined}
        data-railed={contentWidth === undefined ? undefined : "true"}
        data-spacing={spacing === undefined ? undefined : "true"}
      >
        {children}
      </main>

      {footer}
    </div>
  );
}

Main.displayName = "Main";
