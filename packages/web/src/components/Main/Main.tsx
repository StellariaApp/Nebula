"use client";

import { useId, type ReactElement } from "react";

import { useMediaQuery, useMomentumPage, useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { MotionOff, ScrollSpring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss, SpaceToCss } from "../../utils/token-css.js";

import * as styles from "./Main.css.js";
import type { MainProps } from "./Main.types.js";
import { contentGap, contentMax } from "./Main.vars.css.js";

const REDUCED = "(prefers-reduced-motion: reduce)";

export function Main(props: MainProps): ReactElement {
  const {
    children,
    header,
    footer,
    background,
    centered = false,
    padded = false,
    contentWidth,
    spacing,
    momentum = false,
    spring = "default",
    multiplier = 1.5,
    skipLabel = "Saltar al contenido",
    withSkipLink = false,
    id,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const reduced = useMediaQuery(REDUCED);

  useMomentumPage({
    enabled: momentum && !MotionOff({ theme, reduced }),
    spring: ScrollSpring(spring, theme),
    multiplier,
  });

  const auto_id = useId();
  const content_id = id ?? auto_id;

  const content_vars = assignInlineVars({
    ...(contentWidth === undefined ? {} : { [contentMax]: LengthToCss(contentWidth) }),
    ...(spacing === undefined ? {} : { [contentGap]: SpaceToCss(spacing) }),
  });

  return (
    <div className={cx(styles.root, sprinkle_class, className)} style={sprinkle_style}>
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
