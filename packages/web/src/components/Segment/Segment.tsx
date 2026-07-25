"use client";

import { useCallback, useId, useMemo, useState, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import { cx } from "../../utils/style-props.js";

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
    color = "primary",
    disabled = false,
    fullWidth = false,
    draggable = true,
    className,
  } = props;

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
      color,
      disabled,
      fullWidth,
      draggable,
      baseId: base_id,
      hasPanels: panels.length > 0,
      RegisterPanels,
      panels,
    }),
    [
      selected,
      set_selected,
      size,
      color,
      disabled,
      fullWidth,
      draggable,
      base_id,
      panels,
      RegisterPanels,
    ],
  );

  return (
    <SegmentContext.Provider value={context}>
      <div className={cx(styles.root, className)} data-disabled={disabled ? "true" : undefined}>
        {children}
      </div>
    </SegmentContext.Provider>
  );
}

Segment.displayName = "Segment";
