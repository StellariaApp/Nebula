"use client";

import type { ReactElement } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";

import { vars } from "../../theme/contract.css.js";
import { ScaleShade } from "../../utils/scale.js";
import { cx } from "../../utils/style-props.js";

import * as styles from "./Pagination.css.js";
import type { PaginationProps } from "./Pagination.types.js";
import { bg, fg } from "./Pagination.vars.css.js";

const DOTS = "dots";

const CHEVRON_LEFT = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15 6-6 6 6 6" />
  </svg>
);

const CHEVRON_RIGHT = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
);

function Range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => start + index);
}

function PaginationRange(
  page: number,
  total: number,
  siblings: number,
  boundaries: number,
): (number | typeof DOTS)[] {
  const total_page_numbers = siblings * 2 + 3 + boundaries * 2;

  if (total_page_numbers >= total) return Range(1, total);

  const left_sibling = Math.max(page - siblings, boundaries + 1);
  const right_sibling = Math.min(page + siblings, total - boundaries);

  const show_left_dots = left_sibling > boundaries + 2;
  const show_right_dots = right_sibling < total - boundaries - 1;

  if (!show_left_dots && show_right_dots) {
    const left_range = Range(1, boundaries + siblings * 2 + 2);
    return [...left_range, DOTS, ...Range(total - boundaries + 1, total)];
  }

  if (show_left_dots && !show_right_dots) {
    const right_range = Range(total - boundaries - siblings * 2 - 1, total);
    return [...Range(1, boundaries), DOTS, ...right_range];
  }

  return [
    ...Range(1, boundaries),
    DOTS,
    ...Range(left_sibling, right_sibling),
    DOTS,
    ...Range(total - boundaries + 1, total),
  ];
}

export function Pagination(props: PaginationProps): ReactElement {
  const {
    total,
    value,
    defaultValue = 1,
    onChange,
    siblings = 1,
    boundaries = 1,
    size = "md",
    disabled = false,
    withControls = true,
    color = "primary",
    className,
    "aria-label": aria_label = "Paginación",
  } = props;

  const total_pages = Math.max(1, Math.trunc(total));
  const [page, set_page] = useUncontrolled(value, defaultValue, onChange);
  const current = Math.min(Math.max(page, 1), total_pages);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const is_off = prefers_reduced === true || theme.motion.tier === "minimal";
  const spring = theme.motion.spring.default;

  const range = PaginationRange(current, total_pages, siblings, boundaries);

  const Go = (next: number): void => {
    const clamped = Math.min(Math.max(next, 1), total_pages);
    if (clamped !== current) set_page(clamped);
  };

  const motion_props =
    is_off || disabled
      ? {}
      : {
          whileTap: { scale: 0.94 },
          transition: {
            type: "spring" as const,
            stiffness: spring.stiffness,
            damping: spring.damping,
            mass: spring.mass,
          },
        };

  return (
    <LazyMotion features={domAnimation} strict>
      <nav aria-label={aria_label} className={cx(styles.root, className)}>
        <ul className={styles.list}>
          {withControls ? (
            <li>
              <m.button
                type="button"
                className={styles.control({ size })}
                disabled={disabled || current <= 1}
                aria-label="Página anterior"
                onClick={() => {
                  Go(current - 1);
                }}
                {...motion_props}
              >
                {CHEVRON_LEFT}
              </m.button>
            </li>
          ) : null}
          {range.map((entry, index) => {
            if (entry === DOTS) {
              return (
                <li key={`dots-${String(index)}`} className={styles.dots} aria-hidden="true">
                  &hellip;
                </li>
              );
            }

            const is_current = entry === current;
            const css_vars = assignInlineVars({
              [bg]: is_current ? ScaleShade(color, "600") : "transparent",
              [fg]: is_current ? vars.color.text.onPrimary : vars.color.text.primary,
            });

            return (
              <li key={entry}>
                <m.button
                  type="button"
                  className={styles.item({ size })}
                  style={css_vars}
                  disabled={disabled}
                  data-active={is_current ? "true" : undefined}
                  aria-current={is_current ? "page" : undefined}
                  onClick={() => {
                    Go(entry);
                  }}
                  {...motion_props}
                >
                  {entry}
                </m.button>
              </li>
            );
          })}
          {withControls ? (
            <li>
              <m.button
                type="button"
                className={styles.control({ size })}
                disabled={disabled || current >= total_pages}
                aria-label="Página siguiente"
                onClick={() => {
                  Go(current + 1);
                }}
                {...motion_props}
              >
                {CHEVRON_RIGHT}
              </m.button>
            </li>
          ) : null}
        </ul>
      </nav>
    </LazyMotion>
  );
}

Pagination.displayName = "Pagination";
