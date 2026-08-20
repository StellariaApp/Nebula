"use client";

import type { ReactElement } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Pagination.css.js";
import type { PaginationProps } from "./Pagination.types.js";
import * as variables from "./Pagination.vars.css.js";
import { PaginationRange } from "./pagination-range.js";
import { usePaginationPill } from "./use-pagination-pill.js";
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

  const [current, set_current] = useUncontrolled(page, defaultPage, onChange);
  const active = Math.min(Math.max(1, current), Math.max(1, total));

  const items = PaginationRange(total, active, siblings, boundaries);

  const pill = usePaginationPill(active);

  const text = {
    root: labels?.root ?? "Pagination",
    previous: labels?.previous ?? "Previous page",
    next: labels?.next ?? "Next page",
    first: labels?.first ?? "First page",
    last: labels?.last ?? "Last page",
    page: labels?.page ?? ((value: number) => `Page ${String(value)}`),
  };

  const resolved = ResolveVariant(variant, color, theme);

  const refs = VariantRefs(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.accent]: refs?.background ?? resolved.background,
    [variables.accentHover]: refs?.backgroundHover ?? resolved.backgroundHover,
    [variables.activeFg]: refs?.foreground ?? resolved.foreground,
  });

  const pill_vars = assignInlineVars({
    [styles.pill_x]: `${String(pill.placement?.x ?? 0)}px`,
    [styles.pill_y]: `${String(pill.placement?.y ?? 0)}px`,
    [styles.pill_width]: `${String(pill.placement?.width ?? 0)}px`,
    [styles.pill_height]: `${String(pill.placement?.height ?? 0)}px`,
    [styles.pill_duration]: `${String(pill.duration)}ms`,
    [styles.pill_easing]: pill.easing,
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
        ref={pill.listRef}
        {...listProps}
        className={cx(styles.root, listProps?.className)}
        style={{ ...css_vars, ...listProps?.style }}
      >
        {/*
          Es un `<li>` y no un `<span>` porque los hijos de un `<ul>` solo pueden ser `<li>`. Va
          fuera de flujo, asi que no cuenta como elemento de la lista para el layout, y con
          `aria-hidden` tampoco para quien la lee.
        */}
        <li
          aria-hidden="true"
          className={styles.pill}
          data-ready={pill.placement === null ? "false" : "true"}
          style={pill_vars}
        />
        {withEdges ? Control("first", text.first, DOUBLE_ARROW, 1, active === 1) : null}
        {withControls ? Control("prev", text.previous, ARROW, active - 1, active === 1) : null}

        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                ref={pill.SetItemRef(item)}
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
