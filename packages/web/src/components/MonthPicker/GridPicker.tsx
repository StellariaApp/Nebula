"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";

import type { Size } from "@stellaria/nebula-tokens";

import { cx } from "../../utils/style-props.js";

import * as styles from "./GridPicker.css.js";

export interface GridPickerItem {
  value: string;
  label: string;
  disabled?: boolean | undefined;
}

export interface GridPickerProps {
  items: readonly GridPickerItem[];
  value: string;
  onSelect: (value: string) => void;
  columns: number;
  size: Size;
  label: string;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

export function GridPicker(props: GridPickerProps): ReactElement {
  const { items, value, onSelect, columns, size, label, disabled = false, className } = props;

  const selected_index = items.findIndex((item) => item.value === value);
  const [active, set_active] = useState(selected_index === -1 ? 0 : selected_index);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const should_focus = useRef(false);

  useEffect(() => {
    if (selected_index !== -1) set_active(selected_index);
  }, [selected_index]);

  useEffect(() => {
    if (!should_focus.current) return;
    should_focus.current = false;
    refs.current[active]?.focus();
  }, [active]);

  const Move = (next: number): void => {
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    should_focus.current = true;
    set_active(clamped);
  };

  const HandleKey = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const handled: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      ArrowDown: active + columns,
      ArrowUp: active - columns,
      Home: 0,
      End: items.length - 1,
    };
    const next = handled[event.key];
    if (next !== undefined) {
      event.preventDefault();
      Move(next);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const item = items[active];
      if (item !== undefined && item.disabled !== true) onSelect(item.value);
    }
  };

  return (
    <div
      role="listbox"
      aria-label={label}
      aria-disabled={disabled ? true : undefined}
      className={cx(styles.grid, className)}
      style={{ gridTemplateColumns: `repeat(${String(columns)}, minmax(0, 1fr))` }}
      onKeyDown={HandleKey}
    >
      {items.map((item, index) => {
        const is_selected = item.value === value;
        const is_disabled = disabled || item.disabled === true;
        return (
          <div
            key={item.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="option"
            aria-selected={is_selected}
            aria-disabled={is_disabled ? true : undefined}
            tabIndex={index === active ? 0 : -1}
            className={cx(styles.cell, styles.cellSize[size])}
            data-selected={is_selected ? "true" : undefined}
            data-disabled={is_disabled ? "true" : undefined}
            onClick={() => {
              if (is_disabled) return;
              should_focus.current = false;
              set_active(index);
              onSelect(item.value);
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

GridPicker.displayName = "GridPicker";
