"use client";

import { forwardRef } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ResolveAccent } from "../../utils/scale.js";

import { useRadioGroupContext } from "./Radio.context.js";
import * as styles from "./Radio.css.js";
import { radioColor } from "./Radio.vars.css.js";
import type { RadioProps } from "./Radio.types.js";

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

  const css_vars = assignInlineVars({ [radioColor]: ResolveAccent(color, "600") });

  return (
    <label
      className={cx(styles.root, styles.size[size], sprinkle_class, rootClassName)}
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
