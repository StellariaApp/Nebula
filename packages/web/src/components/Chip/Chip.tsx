"use client";

import { forwardRef, useState } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { useChipGroupContext } from "./Chip.context.js";
import * as styles from "./Chip.css.js";
import * as variables from "./Chip.vars.css.js";
import type { ChipProps } from "./Chip.types.js";
import { Check } from "../../glyphs/index.js";
import { Box } from "../Box/Box.js";

const CHECK = <Check strokeWidth={3} />;

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
    iconProps,
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
  const refs = VariantRefs(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.bg]: is_checked ? (refs?.background ?? resolved.background) : "transparent",
    [variables.fg]: is_checked ? (refs?.foreground ?? resolved.foreground) : ResolveAccent("text.primary"),
    [variables.border]: is_checked ? (refs?.borderColor ?? resolved.borderColor) : ResolveAccent("border.default"),
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
        <Box
          component="span"
          aria-hidden="true"
          {...iconProps}
          className={cx(styles.icon, iconProps?.className)}
        >
          {CHECK}
        </Box>
      ) : null}
      {icon === undefined || icon === null ? null : (
        <Box
          component="span"
          aria-hidden="true"
          {...iconProps}
          className={cx(styles.icon, iconProps?.className)}
        >
          {icon}
        </Box>
      )}
      {children}
    </label>
  );
});

Chip.displayName = "Chip";
