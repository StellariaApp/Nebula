"use client";

import { forwardRef, useEffect, useRef } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m, useMotionValue, useReducedMotion, useSpring, type PanInfo } from "motion/react";

import { MotionOff } from "../../utils/motion.js";
import { Rubber } from "../../utils/rubber.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ResolveAccent } from "../../utils/scale.js";

import { useSwitchGroupContext } from "./Switch.context.js";
import * as styles from "./Switch.css.js";
import * as variables from "./Switch.vars.css.js";
import type { SwitchProps } from "./Switch.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const TRACK_RATIO = 1.75;

const FLICK_VELOCITY = 320;

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
    draggable = true,
    className,
    rootClassName,
    labelProps,
    indicatorProps,
    ...input_rest_and_style
  } = props;
  const {
    className: sprinkle_class,
    style: sprinkle_style,
    rest: input_rest,
  } = ExtractStyleProps(input_rest_and_style);

  const group = useSwitchGroupContext();
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();

  const size = size_prop ?? group?.size ?? "md";
  const color = color_prop ?? group?.color ?? "primary";
  const disabled = disabled_prop ?? group?.disabled ?? false;
  const in_group = group !== null && value !== undefined;

  const [local_checked, set_local_checked] = useUncontrolled(checked, defaultChecked, onChange);
  const is_checked = in_group ? group.value.includes(value) : local_checked;

  const track_h = theme.sizes.control[size] / 2;
  const track_w = track_h * TRACK_RATIO;
  const travel = track_w - track_h;

  const is_animated = !MotionOff({ theme, reduced: prefers_reduced === true });
  const can_drag = draggable && is_animated && !disabled;

  const target = useMotionValue(is_checked ? travel : 0);
  const x = useSpring(target, theme.motion.spring.snappy);

  const dragged = useRef(false);
  const origin = useRef(0);

  useEffect(() => {
    target.set(is_checked ? travel : 0);
  }, [is_checked, travel, target]);

  const css_vars = assignInlineVars({
    [variables.width]: `${String(track_w)}px`,
    [variables.height]: `${String(track_h)}px`,
    [variables.color]: ResolveAccent(color, "600"),
  });

  const SetChecked = (next: boolean): void => {
    if (next === is_checked) {
      target.set(next ? travel : 0);
      return;
    }
    if (in_group) group.toggle(value);
    else set_local_checked(next);
  };

  const HandleChange = (): void => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    SetChecked(!is_checked);
  };

  const HandlePanStart = (): void => {
    origin.current = target.get();
  };

  const HandlePan = (_event: unknown, info: PanInfo): void => {
    if (Math.abs(info.offset.x) > 2) dragged.current = true;
    target.set(Rubber(origin.current + info.offset.x, 0, travel));
  };

  const HandlePanEnd = (_event: unknown, info: PanInfo): void => {
    const landed = origin.current + info.offset.x;
    const flicked = Math.abs(info.velocity.x) > FLICK_VELOCITY;
    SetChecked(flicked ? info.velocity.x > 0 : landed > travel / 2);
  };

  return (
    <label
      className={cx(styles.root, sprinkle_class, rootClassName)}
      data-disabled={disabled ? "true" : undefined}
      style={{ ...css_vars, ...sprinkle_style }}
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
      <Box
        component="span"
        aria-hidden="true"
        draggable={false}
        {...indicatorProps}
        className={cx(styles.track, indicatorProps?.className)}
      >
        <m.span
          className={styles.thumb}
          style={{ x: is_animated ? x : target }}
          {...(can_drag
            ? { onPanStart: HandlePanStart, onPan: HandlePan, onPanEnd: HandlePanEnd }
            : {})}
        />
      </Box>
      {label === undefined || label === null ? null : (
        <Text
          inherit
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

Switch.displayName = "Switch";
