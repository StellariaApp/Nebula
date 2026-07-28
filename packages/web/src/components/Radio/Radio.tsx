"use client";

import { forwardRef } from "react";

import type { Size } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ScaleShade } from "../../utils/scale.js";

import { useRadioGroupContext } from "./Radio.context.js";
import * as styles from "./Radio.css.js";
import { radioColor, radioSize } from "./Radio.vars.css.js";
import type { RadioProps } from "./Radio.types.js";

const SIZE_PX: Record<Size, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 };

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  const {
    value,
    label,
    size: size_prop,
    color: color_prop,
    disabled: disabled_prop,
    className,
    rootClassName,
    ...input_rest_and_style
  } = props;
  const {
    className: sprinkle_class,
    style: sprinkle_style,
    rest: input_rest,
  } = ExtractStyleProps(input_rest_and_style);

  const group = useRadioGroupContext();
  const size = size_prop ?? group?.size ?? "md";
  const color = color_prop ?? group?.color ?? "primary";
  const disabled = disabled_prop ?? group?.disabled ?? false;

  const is_checked = group === null ? undefined : group.value === value;

  const css_vars = assignInlineVars({
    [radioSize]: `${String(SIZE_PX[size])}px`,
    [radioColor]: ScaleShade(color, "600"),
  });

  return (
    <label
      className={cx(styles.root, sprinkle_class, rootClassName)}
      data-disabled={disabled ? "true" : undefined}
      style={{ ...css_vars, ...sprinkle_style }}
    >
      <input
        {...input_rest}
        ref={ref}
        type="radio"
        className={cx(styles.input, className)}
        value={value}
        checked={is_checked}
        disabled={disabled}
        onChange={() => group?.onChange(value)}
        {...(group?.name === undefined ? {} : { name: group.name })}
      />
      <span className={styles.dot} aria-hidden="true">
        <span className={styles.inner} />
      </span>
      {label === undefined || label === null ? null : (
        <span className={styles.labelText}>{label}</span>
      )}
    </label>
  );
});

Radio.displayName = "Radio";
