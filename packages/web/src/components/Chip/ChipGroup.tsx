"use client";

import { useCallback, useMemo, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { ChipGroupContext, type ChipGroupContextValue } from "./Chip.context.js";
import * as styles from "./Chip.css.js";
import type { ChipGroupProps } from "./Chip.types.js";

export function ChipGroup(props: ChipGroupProps): ReactElement {
  const {
    children,
    label,
    multiple = false,
    value,
    defaultValue,
    onChange,
    size,
    color,
    variant,
    disabled,
    name,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const [selected, set_selected] = useUncontrolled<string[]>(
    value === undefined ? undefined : [...value],
    defaultValue === undefined ? [] : [...defaultValue],
    onChange,
  );

  const Toggle = useCallback(
    (entry: string): void => {
      if (!multiple) {
        set_selected(selected.includes(entry) ? [] : [entry]);
        return;
      }
      set_selected(
        selected.includes(entry) ? selected.filter((v) => v !== entry) : [...selected, entry],
      );
    },
    [multiple, selected, set_selected],
  );

  const context = useMemo<ChipGroupContextValue>(
    () => ({ value: selected, toggle: Toggle, multiple, size, color, variant, disabled, name }),
    [selected, Toggle, multiple, size, color, variant, disabled, name],
  );

  return (
    <ChipGroupContext.Provider value={context}>
      <fieldset className={cx(sprinkle_class, className)} style={sprinkle_style}>
        {label === undefined || label === null ? null : (
          <legend className={styles.groupLabel}>{label}</legend>
        )}
        <div className={styles.group}>{children}</div>
      </fieldset>
    </ChipGroupContext.Provider>
  );
}

ChipGroup.displayName = "ChipGroup";
