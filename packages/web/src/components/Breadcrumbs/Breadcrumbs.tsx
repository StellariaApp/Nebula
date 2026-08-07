"use client";

import { useMemo, useState, type ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Breadcrumbs.css.js";
import { BREADCRUMBS_LABELS } from "./labels.js";
import type { BreadcrumbItem, BreadcrumbsProps } from "./Breadcrumbs.types.js";
import { Box } from "../Box/Box.js";

const DEFAULT_COLLAPSE_FROM = 5;
const EDGE = 1;
const ELLIPSIS = "…";

interface Slot {
  kind: "item" | "collapsed";
  item?: BreadcrumbItem | undefined;
  hidden?: number | undefined;
}

export function CollapseItems(
  items: readonly BreadcrumbItem[],
  from: number,
  expanded: boolean,
): Slot[] {
  if (expanded || from <= 0 || items.length <= from) {
    return items.map((item) => ({ kind: "item", item }));
  }
  const head = items.slice(0, EDGE);
  const tail = items.slice(-(EDGE + 1));
  return [
    ...head.map((item): Slot => ({ kind: "item", item })),
    { kind: "collapsed", hidden: items.length - head.length - tail.length },
    ...tail.map((item): Slot => ({ kind: "item", item })),
  ];
}

export function Breadcrumbs(props: BreadcrumbsProps): ReactElement {
  const {
    items,
    separator = "/",
    collapseFrom = DEFAULT_COLLAPSE_FROM,
    size = "md",
    labels,
    className,
    listProps,
    itemProps,
    expandProps,
    separatorProps,
    currentProps,
    linkProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? BREADCRUMBS_LABELS : { ...BREADCRUMBS_LABELS, ...labels }),
    [labels],
  );

  const [expanded, set_expanded] = useState(false);
  const slots = useMemo(
    () => CollapseItems(items, collapseFrom, expanded),
    [items, collapseFrom, expanded],
  );

  const last_key = items.at(-1)?.key;

  return (
    <nav
      className={cx(styles.size[size], sprinkle_class, className)}
      style={sprinkle_style}
      aria-label={text.nav}
      {...rest}
    >
      <Box component="ol" {...listProps} className={cx(styles.list, listProps?.className)}>
        {slots.map((slot, index) => {
          const is_last = index === slots.length - 1;

          if (slot.kind === "collapsed") {
            return (
              <Box
                component="li"
                key="__collapsed"
                {...itemProps}
                className={cx(styles.item, itemProps?.className)}
              >
                <button
                  type="button"
                  className={cx(styles.expand, expandProps?.className)}
                  aria-label={text.collapsed}
                  onClick={() => {
                    set_expanded(true);
                  }}
                  {...expandProps}
                >
                  {ELLIPSIS}
                </button>
                <Box
                  component="span"
                  aria-hidden="true"
                  {...separatorProps}
                  className={cx(styles.separator, separatorProps?.className)}
                >
                  {separator}
                </Box>
              </Box>
            );
          }

          const item = slot.item;
          if (item === undefined) return null;
          const is_current = item.key === last_key;
          const Element = item.component ?? (item.href === undefined ? "button" : "a");

          return (
            <Box
              component="li"
              key={item.key}
              {...itemProps}
              className={cx(styles.item, itemProps?.className)}
            >
              {is_current ? (
                <Box
                  component="span"
                  aria-current="page"
                  {...currentProps}
                  className={cx(styles.current, currentProps?.className)}
                >
                  {item.icon}
                  {item.label}
                </Box>
              ) : (
                <Element
                  {...(item.href === undefined ? {} : { href: item.href })}
                  {...(Element === "button" ? { type: "button" } : {})}
                  {...(item.onSelect === undefined ? {} : { onClick: item.onSelect })}
                  {...linkProps}
                  className={cx(styles.link, linkProps?.className)}
                >
                  {item.icon}
                  {item.label}
                </Element>
              )}
              {is_last ? null : (
                <Box
                  component="span"
                  aria-hidden="true"
                  {...separatorProps}
                  className={cx(styles.separator, separatorProps?.className)}
                >
                  {separator}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </nav>
  );
}

Breadcrumbs.displayName = "Breadcrumbs";
