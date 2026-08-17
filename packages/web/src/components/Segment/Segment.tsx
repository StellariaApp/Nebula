"use client";

import { useCallback, useId, useMemo, useState, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import { ContainsPart } from "../../utils/children.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { SegmentContent } from "./components/Content.js";
import { SegmentContext, type SegmentContextValue } from "./Segment.context.js";
import * as styles from "./Segment.css.js";
import type { SegmentLayoutProps, SegmentProps } from "./Segment.types.js";

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
    swipeable,
    fill,
    auto,
    autoWidth,
    loop,
    lazy,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const base_id = useId();
  const [selected, set_selected] = useUncontrolled(value, defaultValue, onChange);
  const [panels, set_panels] = useState<string[]>([]);

  /**
   * Si hay paneles se sabe MIRANDO LOS HIJOS, no esperando a que `Segment.Content` se registre.
   *
   * El registro va en un `useEffect` y los efectos no corren en el servidor, así que el HTML servido
   * salía con el control como `radiogroup` y sin ids mientras el contenido ya era `tabpanel` con un
   * `aria-labelledby` apuntando a nada. Se arreglaba solo al hidratar, pero hasta entonces los roles
   * eran incoherentes y el panel no tenía nombre accesible.
   */
  const has_panels = panels.length > 0 || ContainsPart(children, SegmentContent);

  const RegisterPanels = useCallback((next: string[]) => {
    set_panels((prev) =>
      prev.length === next.length && prev.every((entry, index) => entry === next[index])
        ? prev
        : next,
    );
  }, []);

  const layout = useMemo<SegmentLayoutProps>(
    () => ({ swipeable, fill, auto, autoWidth, loop, lazy }),
    [swipeable, fill, auto, autoWidth, loop, lazy],
  );

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
      hasPanels: has_panels,
      RegisterPanels,
      panels,
      layout,
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
      has_panels,
      panels,
      RegisterPanels,
      layout,
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
