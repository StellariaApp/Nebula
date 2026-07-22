"use client";

import { forwardRef } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import type { Size } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";
import { ScaleShade } from "../../utils/scale.js";

import { useSwitchGroupContext } from "./Switch.context.js";
import * as styles from "./Switch.css.js";
import { switchColor, switchH, switchW } from "./Switch.vars.css.js";
import type { SwitchProps } from "./Switch.types.js";

const SIZE: Record<Size, { w: number; h: number }> = {
  xs: { w: 28, h: 16 },
  sm: { w: 32, h: 18 },
  md: { w: 38, h: 22 },
  lg: { w: 46, h: 26 },
  xl: { w: 52, h: 30 },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(props, ref) {
  const {
    label,
    size: size_prop,
    color: color_prop,
    checked,
    defaultChecked = false,
    onChange,
    value,
    disabled: disabled_prop,
    className,
    rootClassName,
    ...input_rest
  } = props;

  const group = useSwitchGroupContext();
  const size = size_prop ?? group?.size ?? "md";
  const color = color_prop ?? group?.color ?? "primary";
  const disabled = disabled_prop ?? group?.disabled ?? false;
  const in_group = group !== null && value !== undefined;

  const [local_checked, set_local_checked] = useUncontrolled(checked, defaultChecked, onChange);
  const is_checked = in_group ? group.value.includes(value) : local_checked;

  const dims = SIZE[size];
  const css_vars = assignInlineVars({
    [switchW]: `${String(dims.w)}px`,
    [switchH]: `${String(dims.h)}px`,
    [switchColor]: ScaleShade(color, "600"),
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
        ref={ref}
        type="checkbox"
        role="switch"
        className={cx(styles.input, className)}
        checked={is_checked}
        aria-checked={is_checked}
        onChange={HandleChange}
        disabled={disabled}
        {...(value === undefined ? {} : { value })}
        {...(group?.name === undefined ? {} : { name: group.name })}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label === undefined || label === null ? null : (
        <span className={styles.labelText}>{label}</span>
      )}
    </label>
  );
});

Switch.displayName = "Switch";
