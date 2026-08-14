"use client";

import {
  Children,
  isValidElement,
  useRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m } from "motion/react";

import { ResolveVariant } from "../../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import { useSegment } from "../Segment.context.js";
import * as styles from "../Segment.css.js";
import type {
  SegmentControlItemProps,
  SegmentControlProps,
  SegmentItemData,
} from "../Segment.types.js";
import * as variables from "../Segment.vars.css.js";
import { useSegmentIndicator } from "../use-segment-indicator.js";

export function SegmentControlItem(_props: SegmentControlItemProps): null {
  return null;
}

SegmentControlItem.displayName = "SegmentControlItem";

function FromChildren(children: ReactNode): SegmentItemData[] {
  return Children.toArray(children)
    .filter((child): child is ReactElement<SegmentControlItemProps> => isValidElement(child))
    .map((child) => ({
      value: child.props.value,
      label: child.props.children,
      disabled: child.props.disabled,
    }));
}

export function SegmentControl(props: SegmentControlProps): ReactElement {
  const { data, children, className, tabProps, "aria-label": aria_label, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const segment = useSegment();

  const items =
    data === undefined
      ? FromChildren(children)
      : data.map((entry) => (typeof entry === "string" ? { value: entry, label: entry } : entry));
  const active_index = Math.max(
    0,
    items.findIndex((item) => item.value === segment.value),
  );

  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const Enabled = (index: number): boolean => {
    const item = items[index];
    return item !== undefined && item.disabled !== true && !segment.disabled;
  };

  const Select = (index: number): void => {
    const item = items[index];
    if (item === undefined || !Enabled(index)) return;
    segment.SetValue(item.value);
  };

  const indicator = useSegmentIndicator({
    activeIndex: active_index,
    count: items.length,
    draggable: segment.draggable,
    disabled: segment.disabled,
    overflowMode: segment.overflowMode,
    onSelect: Select,
    isEnabled: Enabled,
  });

  const Step = (from: number, direction: 1 | -1): number => {
    const total = items.length;
    for (let step = 1; step <= total; step += 1) {
      const next = (from + direction * step + total * total) % total;
      if (Enabled(next)) return next;
    }
    return from;
  };

  const HandleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = active_index;
    if (event.key === "ArrowRight") next = Step(active_index, 1);
    if (event.key === "ArrowLeft") next = Step(active_index, -1);
    if (event.key === "Home") next = Enabled(0) ? 0 : Step(0, 1);
    if (event.key === "End")
      next = Enabled(items.length - 1) ? items.length - 1 : Step(items.length - 1, -1);
    Select(next);
    tabs.current[next]?.focus();
  };

  const { theme } = useTheme();
  const resolved = ResolveVariant(segment.variant ?? "light", segment.color, theme);

  const css_vars = assignInlineVars({
    [variables.indicatorColor]: resolved.background,
    [variables.indicatorFg]: resolved.foreground,
  });

  const wrapped = segment.overflowMode === "wrap";

  return (
    <div
      ref={indicator.containerRef}
      role={segment.hasPanels ? "tablist" : "radiogroup"}
      aria-label={aria_label}
      aria-orientation={segment.hasPanels ? "horizontal" : undefined}
      className={cx(
        styles.control({
          size: segment.size,
          fullWidth: segment.fullWidth,
          overflowMode: segment.overflowMode,
        }),
        sprinkle_class,
        className,
      )}
      data-disabled={segment.disabled ? "true" : undefined}
      style={{ ...css_vars, ...sprinkle_style }}
      onKeyDown={HandleKeyDown}
    >
      <m.span
        aria-hidden="true"
        className={styles.indicator({ size: segment.size, flow: wrapped ? "wrap" : "row" })}
        style={{
          x: indicator.x,
          width: indicator.width,
          opacity: indicator.ready ? 1 : 0,
          ...(wrapped ? { y: indicator.y, height: indicator.height } : {}),
        }}
        {...indicator.panHandlers}
      />
      {items.map((item, index) => {
        const active = item.value === segment.value;
        const item_disabled = segment.disabled || item.disabled === true;
        return (
          <button
            key={item.value}
            ref={(node) => {
              tabs.current[index] = node;
              indicator.SetItemRef(index)(node);
            }}
            type="button"
            disabled={item_disabled}
            {...tabProps}
            role={segment.hasPanels ? "tab" : "radio"}
            aria-selected={segment.hasPanels ? active : undefined}
            aria-checked={segment.hasPanels ? undefined : active}
            aria-controls={segment.hasPanels ? `${segment.baseId}-panel-${item.value}` : undefined}
            id={segment.hasPanels ? `${segment.baseId}-tab-${item.value}` : undefined}
            tabIndex={active ? 0 : -1}
            className={cx(
              styles.tab({
                size: segment.size,
                fullWidth: segment.fullWidth,
                overflowMode: segment.overflowMode,
              }),
              !indicator.ready && active ? styles.tab_active : undefined,
              tabProps?.className,
            )}
            data-active={active ? "true" : undefined}
            data-disabled={item_disabled ? "true" : undefined}
            onClick={() => {
              if (indicator.ConsumeDrag()) return;
              Select(index);
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentControl.displayName = "SegmentControl";
