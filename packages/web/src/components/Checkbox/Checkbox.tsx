"use client";

import { forwardRef, useEffect, useRef } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import type { Size } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useObjectRef } from "react-aria";

import { cx } from "../../utils/style-props.js";
import { ScaleShade } from "../../utils/scale.js";

import { useCheckboxGroupContext } from "./Checkbox.context.js";
import * as styles from "./Checkbox.css.js";
import { checkboxColor, checkboxSize } from "./Checkbox.vars.css.js";
import type { CheckboxProps } from "./Checkbox.types.js";

const SIZE_PX: Record<Size, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 };

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  const {
    label,
    size: size_prop,
    color: color_prop,
    checked,
    defaultChecked = false,
    onChange,
    indeterminate = false,
    value,
    disabled: disabled_prop,
    error = false,
    className,
    rootClassName,
    ...input_rest
  } = props;

  const group = useCheckboxGroupContext();
  const size = size_prop ?? group?.size ?? "md";
  const color = color_prop ?? group?.color ?? "primary";
  const disabled = disabled_prop ?? group?.disabled ?? false;
  const in_group = group !== null && value !== undefined;

  const [local_checked, set_local_checked] = useUncontrolled(checked, defaultChecked, onChange);
  const is_checked = in_group ? group.value.includes(value) : local_checked;

  const local_ref = useRef<HTMLInputElement>(null);
  const merged_ref = useObjectRef(ref ?? local_ref);

  useEffect(() => {
    if (merged_ref.current !== null) merged_ref.current.indeterminate = indeterminate;
  }, [indeterminate, merged_ref, is_checked]);

  const css_vars = assignInlineVars({
    [checkboxSize]: `${String(SIZE_PX[size])}px`,
    [checkboxColor]: ScaleShade(color, "600"),
  });

  const HandleChange = (): void => {
    if (in_group) group.toggle(value);
    else set_local_checked(!is_checked);
  };

  return (
    <label
      className={cx(styles.root, rootClassName)}
      data-disabled={disabled ? "true" : undefined}
      style={css_vars}
    >
      <input
        {...input_rest}
        ref={merged_ref}
        type="checkbox"
        className={cx(styles.input, className)}
        checked={is_checked}
        onChange={HandleChange}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        {...(value === undefined ? {} : { value })}
        {...(group?.name === undefined ? {} : { name: group.name })}
      />
      <span className={styles.box} aria-hidden="true">
        <svg
          className={styles.mark}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {indeterminate ? <path d="M6 12h12" /> : <path d="M5 12l5 5L20 6" />}
        </svg>
      </span>
      {label === undefined || label === null ? null : (
        <span className={styles.labelText}>{label}</span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";
