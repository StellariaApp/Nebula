"use client";

import { useId, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";

import * as styles from "./SegmentedControl.css.js";
import { segCount, segIndex } from "./SegmentedControl.vars.css.js";
import type { SegmentedControlProps, SegmentedItem } from "./SegmentedControl.types.js";

function Normalize(data: SegmentedControlProps["data"]): SegmentedItem[] {
  return data.map((item) => (typeof item === "string" ? { value: item, label: item } : item));
}

export function SegmentedControl(props: SegmentedControlProps): ReactElement {
  const {
    data,
    value,
    defaultValue,
    onChange,
    size = "md",
    fullWidth = false,
    disabled = false,
    name,
    className,
  } = props;

  const items = Normalize(data);
  const auto_id = useId();
  const group_name = name ?? auto_id;

  const [selected, set_selected] = useUncontrolled(
    value,
    defaultValue ?? items[0]?.value ?? "",
    onChange,
  );

  const active_index = Math.max(
    0,
    items.findIndex((item) => item.value === selected),
  );

  const css_vars = assignInlineVars({
    [segCount]: String(items.length),
    [segIndex]: String(active_index),
  });

  return (
    <div
      role="radiogroup"
      aria-label={props["aria-label"]}
      className={cx(styles.root({ size, fullWidth }), className)}
      data-disabled={disabled ? "true" : undefined}
      style={css_vars}
    >
      <span className={styles.indicator} aria-hidden="true" />
      {items.map((item) => {
        const item_disabled = disabled || item.disabled === true;
        const is_active = item.value === selected;
        return (
          <label
            key={item.value}
            className={styles.segment}
            data-active={is_active ? "true" : undefined}
            data-disabled={item_disabled ? "true" : undefined}
          >
            <input
              type="radio"
              name={group_name}
              value={item.value}
              checked={is_active}
              disabled={item_disabled}
              onChange={() => set_selected(item.value)}
              className={styles.input}
            />
            <span className={styles.segmentLabel}>{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}

SegmentedControl.displayName = "SegmentedControl";
