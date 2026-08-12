"use client";

import { useCallback, useId, useMemo, useState, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { SegmentContext, type SegmentContextValue } from "./Segment.context.js";
import * as styles from "./Segment.css.js";
import type { SegmentProps } from "./Segment.types.js";

export function Segment(props: SegmentProps): ReactElement {
  const {
    children,
    value,
    defaultValue = "",
    onChange,
    size = "md",
    variant,
    color = "primary",
    disabled = false,
    fullWidth = false,
    draggable = true,
    overflowMode = "visible",
    className,
    padded = false,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const base_id = useId();
  const [selected, set_selected] = useUncontrolled(value, defaultValue, onChange);
  const [panels, set_panels] = useState<string[]>([]);

  const RegisterPanels = useCallback((next: string[]) => {
    set_panels((prev) =>
      prev.length === next.length && prev.every((entry, index) => entry === next[index])
        ? prev
        : next,
    );
  }, []);

  const context = useMemo<SegmentContextValue>(
    () => ({
      value: selected,
      SetValue: set_selected,
      size,
      variant,
      color,
      disabled,
      fullWidth,
      draggable,
      overflowMode,
      baseId: base_id,
      hasPanels: panels.length > 0,
      RegisterPanels,
      panels,
    }),
    [
      selected,
      set_selected,
      size,
      variant,
      color,
      disabled,
      fullWidth,
      draggable,
      overflowMode,
      base_id,
      panels,
      RegisterPanels,
    ],
  );

  return (
    <SegmentContext.Provider value={context}>
      <div
        className={cx(styles.root, sprinkle_class, className)}
        style={sprinkle_style}
        data-disabled={disabled ? "true" : undefined}
        data-padded={padded ? "true" : undefined}
      >
        {children}
      </div>
    </SegmentContext.Provider>
  );
}

Segment.displayName = "Segment";
