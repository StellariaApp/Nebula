"use client";

import { useEffect, type ElementType, type ReactElement } from "react";

import { useScrolled, useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m, useReducedMotion, useSpring } from "motion/react";

import { vars } from "../../theme/contract.css.js";
import { SpringOptions } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";

import * as styles from "./Nav.css.js";
import type { NavProps } from "./Nav.types.js";
import * as variables from "./Nav.vars.css.js";

const DEFAULT_THRESHOLD = 24;
const DEFAULT_WIDTH = 1180;
const DEFAULT_GAP = 12;

const TAGS = m as unknown as Record<string, ElementType>;

export function Nav(props: NavProps): ReactElement {
  const {
    children,
    component,
    size = "md",
    withBorder = false,
    contentWidth = DEFAULT_WIDTH,
    floating = false,
    sticky = false,
    scrolled,
    scrollThreshold = DEFAULT_THRESHOLD,
    floatingWidth = DEFAULT_WIDTH,
    floatingGap = DEFAULT_GAP,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const is_animated = prefers_reduced !== true && theme.motion.tier !== "minimal";
  const glass_on = theme.effects.glass.enabled;

  const tracks_scroll = floating || sticky;
  const auto_scrolled = useScrolled(scrollThreshold, {
    enabled: tracks_scroll && scrolled === undefined,
  });
  const is_condensed = tracks_scroll && (scrolled ?? auto_scrolled);

  const content_vars = assignInlineVars({ [variables.contentMax]: LengthToCss(contentWidth) });

  const progress = useSpring(is_condensed ? 1 : 0, SpringOptions("snappy", theme));

  const tag = component ?? "div";
  const springs_geometry = floating && is_animated && typeof tag === "string";

  useEffect(() => {
    const next = is_condensed ? 1 : 0;
    if (springs_geometry) progress.set(next);
    else progress.jump(next);
  }, [is_condensed, springs_geometry, progress]);

  const surface_vars = tracks_scroll
    ? assignInlineVars({
        ...(floating
          ? {
              [variables.floatingMax]: LengthToCss(floatingWidth),
              [variables.floatingGap]: LengthToCss(floatingGap),
            }
          : {}),
        [variables.surfaceBg]: glass_on ? vars.glass.default.background : vars.color.surface.raised,
        [variables.surfaceBorder]: glass_on
          ? vars.glass.default.border
          : `1px solid ${vars.color.border.subtle}`,
        [variables.surfaceBackdrop]: glass_on ? vars.glass.default.backdropFilter : "none",
      })
    : {};

  const Root = springs_geometry ? (TAGS[tag] ?? tag) : tag;
  const progress_var = floating
    ? { [styles.PROGRESS]: springs_geometry ? progress : is_condensed ? 1 : 0 }
    : {};

  return (
    <Root
      className={cx(
        styles.root({ size, withBorder: floating ? false : withBorder }),
        floating ? styles.floating : undefined,
        sticky && !floating ? styles.sticky : undefined,
        sprinkle_class,
        className,
      )}
      style={{ ...surface_vars, ...content_vars, ...progress_var, ...sprinkle_style }}
      data-floating={floating ? "true" : undefined}
      data-sticky={sticky && !floating ? "true" : undefined}
      data-scrolled={tracks_scroll ? (is_condensed ? "true" : "false") : undefined}
      data-animated={tracks_scroll ? (is_animated ? "true" : "false") : undefined}
      {...(component === undefined || aria_label === undefined ? {} : { "aria-label": aria_label })}
      {...rest}
    >
      <div className={styles.inner}>{children}</div>
    </Root>
  );
}

Nav.displayName = "Nav";
