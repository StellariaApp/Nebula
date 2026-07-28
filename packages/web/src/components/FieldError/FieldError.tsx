"use client";

import { useEffect, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ScaleShade } from "../../utils/scale.js";
import { Transition } from "../Transition/Transition.js";

import * as styles from "./FieldError.css.js";
import { bubbleBg, bubbleFg, gap } from "./FieldError.vars.css.js";
import type { FieldErrorPosition, FieldErrorProps } from "./FieldError.types.js";

const VALIDATING_DELAY = 500;

const POSITION_CLASS: Record<FieldErrorPosition, string | undefined> = {
  top: cx(styles.bubble, styles.top, styles.center),
  "top-left": cx(styles.bubble, styles.top, styles.start),
  "top-right": cx(styles.bubble, styles.top, styles.end),
  bottom: cx(styles.bubble, styles.bottom, styles.center),
  "bottom-left": cx(styles.bubble, styles.bottom, styles.start),
  "bottom-right": cx(styles.bubble, styles.bottom, styles.end),
};

export function FieldError(props: FieldErrorProps): ReactElement {
  const {
    children,
    field,
    error,
    message,
    status,
    color: color_prop,
    position = "top-right",
    offset = 12,
    validatingLabel = "Validando…",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const explicit_message = typeof error === "string" ? error : undefined;
  const field_invalid = field !== undefined && field.touched && field.status === "invalid";
  const field_validating = field !== undefined && field.status === "validating";
  const resolved_message = message ?? explicit_message ?? (field_invalid ? field.error : undefined);
  const validating = status === "validating" || field_validating;
  const has_error = error === true || resolved_message !== undefined || field_invalid;

  const [show_validating, set_show_validating] = useState(false);

  useEffect(() => {
    if (!validating) {
      set_show_validating(false);
      return;
    }
    const timer = setTimeout(() => {
      set_show_validating(true);
    }, VALIDATING_DELAY);
    return () => {
      clearTimeout(timer);
    };
  }, [validating]);

  const validating_now = show_validating && !has_error;
  const open = has_error || validating_now;
  const color = validating_now ? "info" : (color_prop ?? "error");
  const label = validating_now ? validatingLabel : resolved_message;
  const visible = open && label !== undefined && label !== "";

  const css_vars = assignInlineVars({
    [bubbleBg]: ScaleShade(color, "600"),
    [bubbleFg]: ScaleShade(color, "50"),
    [gap]: `${String(offset)}px`,
  });

  return (
    <div
      className={cx(styles.wrapper, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
    >
      {children}
      <Transition mounted={visible} transition="scale" className={POSITION_CLASS[position]}>
        <span role="alert">{label}</span>
      </Transition>
    </div>
  );
}

FieldError.displayName = "FieldError";
