"use client";

import { useCallback, useRef, type KeyboardEvent, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as variables from "./Panel.vars.css.js";
import * as styles from "./Panel.css.js";
import type { PanelLabels, PanelProps } from "./Panel.types.js";

const DEFAULT_LABELS: PanelLabels = { separator: "Redimensionar paneles" };

function Clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function Panel(props: PanelProps): ReactElement {
  const {
    master,
    detail,
    size,
    defaultSize = 320,
    onSizeChange,
    min = 160,
    max = 640,
    step = 16,
    orientation = "horizontal",
    resizable = true,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };
  const [current, set_current] = useUncontrolled(size, defaultSize, onSizeChange);
  const root_ref = useRef<HTMLDivElement>(null);
  const is_horizontal = orientation === "horizontal";

  const Commit = useCallback(
    (next: number) => {
      set_current(Clamp(Math.round(next), min, max));
    },
    [set_current, min, max],
  );

  const OnKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!resizable) return;
    const decrease = is_horizontal ? "ArrowLeft" : "ArrowUp";
    const increase = is_horizontal ? "ArrowRight" : "ArrowDown";

    if (event.key === decrease) {
      event.preventDefault();
      Commit(current - step);
      return;
    }
    if (event.key === increase) {
      event.preventDefault();
      Commit(current + step);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      Commit(min);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      Commit(max);
    }
  };

  const OnPointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!resizable) return;
    event.preventDefault();
    const node = event.currentTarget;
    node.setPointerCapture(event.pointerId);

    const Move = (moved: PointerEvent): void => {
      const box = root_ref.current?.getBoundingClientRect();
      if (box === undefined) return;
      Commit(is_horizontal ? moved.clientX - box.left : moved.clientY - box.top);
    };

    const Up = (): void => {
      node.removeEventListener("pointermove", Move);
      node.removeEventListener("pointerup", Up);
    };

    node.addEventListener("pointermove", Move);
    node.addEventListener("pointerup", Up);
  };

  return (
    <div
      ref={root_ref}
      className={cx(styles.panel, sprinkle_class, className)}
      style={{
        ...assignInlineVars({ [variables.masterSize]: `${String(current)}px` }),
        ...sprinkle_style,
      }}
      data-orientation={orientation}
    >
      <div className={styles.pane}>{master}</div>

      <div
        role="separator"
        tabIndex={resizable ? 0 : -1}
        aria-label={text.separator}
        aria-orientation={is_horizontal ? "vertical" : "horizontal"}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        className={styles.separator}
        data-orientation={orientation}
        data-resizable={resizable ? undefined : "false"}
        onKeyDown={OnKeyDown}
        onPointerDown={OnPointerDown}
      />

      <div className={styles.pane}>{detail}</div>
    </div>
  );
}

Panel.displayName = "Panel";
