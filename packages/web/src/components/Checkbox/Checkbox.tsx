"use client";

import { forwardRef, useEffect, useRef } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useObjectRef } from "react-aria";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ResolveAccent } from "../../utils/scale.js";

import { useCheckboxGroupContext } from "./Checkbox.context.js";
import * as styles from "./Checkbox.css.js";
import * as variables from "./Checkbox.vars.css.js";
import type { CheckboxProps } from "./Checkbox.types.js";
import { Check, Minus } from "../../glyphs/index.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

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
    labelProps,
    indicatorProps,
    markProps,
    ...input_rest_and_style
  } = props;
  const {
    className: sprinkle_class,
    style: sprinkle_style,
    rest: input_rest,
  } = ExtractStyleProps(input_rest_and_style);

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

  const css_vars = assignInlineVars({ [variables.color]: ResolveAccent(color, "600") });

  const HandleChange = (): void => {
    if (in_group) group.toggle(value);
    else set_local_checked(!is_checked);
  };

  return (
    <label
      className={cx(styles.root, styles.size[size], sprinkle_class, rootClassName)}
      data-disabled={disabled ? "true" : undefined}
      style={{ ...css_vars, ...sprinkle_style }}
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
      <Box
        component="span"
        aria-hidden="true"
        {...indicatorProps}
        className={cx(styles.box, indicatorProps?.className)}
      >
        {indeterminate ? (
          <Minus strokeWidth={3} {...markProps} className={cx(styles.mark, markProps?.className)} />
        ) : (
          <Check strokeWidth={3} {...markProps} className={cx(styles.mark, markProps?.className)} />
        )}
      </Box>
      {label === undefined || label === null ? null : (
        <Text
          component="span"
          {...labelProps}
          className={cx(styles.label_text, labelProps?.className)}
        >
          {label}
        </Text>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";
