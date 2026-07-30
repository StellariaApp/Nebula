"use client";

import { forwardRef, useState } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { useChipGroupContext } from "./Chip.context.js";
import * as styles from "./Chip.css.js";
import { chipBg, chipBorder, chipFg } from "./Chip.vars.css.js";
import type { ChipProps } from "./Chip.types.js";

const CHECK = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Chip = forwardRef<HTMLInputElement, ChipProps>(function Chip(props, ref) {
  const {
    children,
    size: size_prop,
    color: color_prop,
    variant: variant_prop,
    radius = "full",
    checked,
    defaultChecked = false,
    onChange,
    disabled: disabled_prop,
    value,
    icon,
    className,
    rootClassName,
    ...input_rest_and_style
  } = props;
  const {
    className: sprinkle_class,
    style: sprinkle_style,
    rest: input_rest,
  } = ExtractStyleProps(input_rest_and_style);

  const group = useChipGroupContext();
  const size = size_prop ?? group?.size ?? "md";
  const color = color_prop ?? group?.color ?? "primary";
  const variant = variant_prop ?? group?.variant ?? "filled";
  const disabled = disabled_prop ?? group?.disabled ?? false;
  const in_group = group !== null && value !== undefined;

  const [local, set_local] = useUncontrolled(checked, defaultChecked, onChange);
  const is_checked = in_group ? group.value.includes(value) : local;

  const [focus_visible, set_focus_visible] = useState(false);
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [chipBg]: is_checked ? resolved.background : "transparent",
    [chipFg]: is_checked ? resolved.foreground : ResolveAccent("text.primary"),
    [chipBorder]: is_checked ? resolved.borderColor : ResolveAccent("border.default"),
  });

  const Toggle = (): void => {
    if (in_group) group.toggle(value);
    else set_local(!is_checked);
  };

  return (
    <label
      className={cx(
        styles.root,
        styles.size[size],
        styles.radius[radius],
        sprinkle_class,
        rootClassName,
      )}
      style={{ ...css_vars, ...sprinkle_style }}
      data-disabled={disabled ? "true" : undefined}
      data-checked={is_checked ? "true" : undefined}
      data-focus-visible={focus_visible ? "true" : undefined}
    >
      <input
        {...input_rest}
        ref={ref}
        type={in_group && !group.multiple ? "radio" : "checkbox"}
        className={cx(styles.input, className)}
        checked={is_checked}
        onChange={Toggle}
        disabled={disabled}
        {...(value === undefined ? {} : { value })}
        {...(group?.name === undefined ? {} : { name: group.name })}
        onFocus={(event) => {
          set_focus_visible(event.target.matches(":focus-visible"));
        }}
        onBlur={() => {
          set_focus_visible(false);
        }}
      />
      {is_checked && icon === undefined ? (
        <span className={styles.icon} aria-hidden="true">
          {CHECK}
        </span>
      ) : null}
      {icon === undefined || icon === null ? null : (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </label>
  );
});

Chip.displayName = "Chip";
