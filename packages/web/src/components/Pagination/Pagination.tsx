"use client";

import { useId, type ReactElement } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m, useReducedMotion } from "motion/react";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { Spring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Pagination.css.js";
import type { PaginationProps } from "./Pagination.types.js";
import { accent, accentHover, activeFg } from "./Pagination.vars.css.js";
import { PaginationRange } from "./pagination-range.js";

const ARROW = (
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
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const DOUBLE_ARROW = (
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
    <path d="m17 18-6-6 6-6M11 18l-6-6 6-6" />
  </svg>
);

export function Pagination(props: PaginationProps): ReactElement {
  const {
    total,
    page,
    defaultPage = 1,
    onChange,
    siblings = 1,
    boundaries = 1,
    withControls = true,
    withEdges = false,
    disabled = false,
    size = "md",
    variant = "filled",
    color = "primary",
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const transition = Spring("default", { theme, reduced: prefers_reduced === true });

  const pill_id = useId();
  const [current, set_current] = useUncontrolled(page, defaultPage, onChange);
  const active = Math.min(Math.max(1, current), Math.max(1, total));

  const items = PaginationRange(total, active, siblings, boundaries);

  const text = {
    root: labels?.root ?? "Paginación",
    previous: labels?.previous ?? "Página anterior",
    next: labels?.next ?? "Página siguiente",
    first: labels?.first ?? "Primera página",
    last: labels?.last ?? "Última página",
    page: labels?.page ?? ((value: number) => `Página ${String(value)}`),
  };

  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [accent]: resolved.background,
    [accentHover]: resolved.backgroundHover,
    [activeFg]: resolved.foreground,
  });

  const Go = (next: number): void => {
    const clamped = Math.min(Math.max(1, next), Math.max(1, total));
    if (clamped === active) return;
    set_current(clamped);
  };

  const Control = (key: string, label: string, icon: ReactElement, to: number, off: boolean) => (
    <li key={key}>
      <button
        type="button"
        className={styles.control({ size })}
        aria-label={label}
        disabled={disabled || off}
        onClick={() => {
          Go(to);
        }}
      >
        <span
          className={styles.value}
          style={key === "next" || key === "last" ? { transform: "rotate(180deg)" } : undefined}
        >
          {icon}
        </span>
      </button>
    </li>
  );

  return (
    <nav aria-label={text.root} className={cx(sprinkle_class, className)} style={sprinkle_style}>
      <ul className={styles.root} style={css_vars}>
        {withEdges ? Control("first", text.first, DOUBLE_ARROW, 1, active === 1) : null}
        {withControls ? Control("prev", text.previous, ARROW, active - 1, active === 1) : null}

        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                className={styles.control({ size })}
                data-active={item === active ? "true" : undefined}
                aria-label={text.page(item)}
                {...(item === active ? { "aria-current": "page" as const } : {})}
                disabled={disabled}
                onClick={() => {
                  Go(item);
                }}
              >
                {item === active ? (
                  <m.span
                    className={styles.pill}
                    layoutId={pill_id}
                    transition={transition}
                    aria-hidden="true"
                  />
                ) : null}
                <span className={styles.value}>{item}</span>
              </button>
            </li>
          ) : (
            <li key={item} className={styles.dots} aria-hidden="true">
              …
            </li>
          ),
        )}

        {withControls ? Control("next", text.next, ARROW, active + 1, active === total) : null}
        {withEdges ? Control("last", text.last, DOUBLE_ARROW, total, active === total) : null}
      </ul>
    </nav>
  );
}

Pagination.displayName = "Pagination";
