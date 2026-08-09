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
import * as variables from "./Pagination.vars.css.js";
import { PaginationRange } from "./pagination-range.js";
import { ChevronLeft, ChevronsLeft } from "../../glyphs/index.js";
import { Box } from "../Box/Box.js";

const ARROW = <ChevronLeft />;

const DOUBLE_ARROW = <ChevronsLeft />;

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
    listProps,
    controlProps,
    valueProps,
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
    root: labels?.root ?? "Pagination",
    previous: labels?.previous ?? "Previous page",
    next: labels?.next ?? "Next page",
    first: labels?.first ?? "First page",
    last: labels?.last ?? "Last page",
    page: labels?.page ?? ((value: number) => `Page ${String(value)}`),
  };

  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.accent]: resolved.background,
    [variables.accentHover]: resolved.backgroundHover,
    [variables.activeFg]: resolved.foreground,
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
        {...controlProps}
        className={cx(styles.control({ size }), controlProps?.className)}
        aria-label={label}
        disabled={disabled || off}
        onClick={() => {
          Go(to);
        }}
      >
        <Box
          component="span"
          {...valueProps}
          className={cx(styles.value, valueProps?.className)}
          style={{
            ...(key === "next" || key === "last" ? { transform: "rotate(180deg)" } : {}),
            ...valueProps?.style,
          }}
        >
          {icon}
        </Box>
      </button>
    </li>
  );

  return (
    <nav aria-label={text.root} className={cx(sprinkle_class, className)} style={sprinkle_style}>
      <Box
        component="ul"
        {...listProps}
        className={cx(styles.root, listProps?.className)}
        style={{ ...css_vars, ...listProps?.style }}
      >
        {withEdges ? Control("first", text.first, DOUBLE_ARROW, 1, active === 1) : null}
        {withControls ? Control("prev", text.previous, ARROW, active - 1, active === 1) : null}

        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                {...controlProps}
                className={cx(styles.control({ size }), controlProps?.className)}
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
                <Box
                  component="span"
                  {...valueProps}
                  className={cx(styles.value, valueProps?.className)}
                >
                  {item}
                </Box>
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
      </Box>
    </nav>
  );
}

Pagination.displayName = "Pagination";
