"use client";

import type { ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Segment } from "../Segment/index.js";

import * as styles from "./GridList.css.js";
import * as variables from "./GridList.vars.css.js";
import type { GridListMode, GridListProps } from "./GridList.types.js";

const DEFAULT_MODE_LABELS: Record<GridListMode, string> = {
  list: "List",
  grid: "Grid",
  carousel: "Carousel",
};

const ALL_MODES: readonly GridListMode[] = ["list", "grid", "carousel"];

export function GridList<T>(props: GridListProps<T>): ReactElement {
  const {
    items,
    getKey,
    renderItem,
    mode,
    defaultMode = "grid",
    onModeChange,
    modes = ALL_MODES,
    cols,
    minColWidth = 220,
    gap = "md",
    empty,
    label,
    modeLabels,
    switcherLabel = "View mode",
    withSwitcher = true,
    className,
    toolbarProps,
    itemProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const [current, set_current] = useUncontrolled<GridListMode>(mode, defaultMode, onModeChange);
  const text = { ...DEFAULT_MODE_LABELS, ...modeLabels };

  const css_vars = assignInlineVars({
    [variables.minCol]: `${String(minColWidth)}px`,
    [variables.cols]: cols === undefined ? "auto-fill" : String(cols),
  });

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
    >
      {withSwitcher && modes.length > 1 ? (
        <Box {...toolbarProps} className={cx(styles.toolbar, toolbarProps?.className)}>
          <Segment
            size="sm"
            value={current}
            onChange={(next) => {
              set_current(next as GridListMode);
            }}
          >
            <Segment.Control
              aria-label={switcherLabel}
              data={modes.map((entry) => ({ value: entry, label: text[entry] }))}
            />
          </Segment>
        </Box>
      ) : null}
      {items.length === 0 && empty !== undefined ? (
        empty
      ) : (
        <ul
          className={cx(styles.container, styles.mode[current], styles.gap[gap])}
          data-mode={current}
          {...(label === undefined ? {} : { "aria-label": label })}
        >
          {items.map((item, index) => (
            <Box
              key={getKey(item, index)}
              component="li"
              {...itemProps}
              className={cx(styles.item, itemProps?.className)}
            >
              {renderItem(item, current, index)}
            </Box>
          ))}
        </ul>
      )}
    </div>
  );
}

GridList.displayName = "GridList";
