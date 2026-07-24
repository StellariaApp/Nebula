"use client";

import { useEffect, useState, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";
import { ScaleShade } from "../../utils/scale.js";

import * as styles from "./FieldError.css.js";
import { bubbleBg, bubbleFg } from "./FieldError.vars.css.js";
import type { FieldErrorProps } from "./FieldError.types.js";

const VALIDATING_DELAY = 500;

export function FieldError(props: FieldErrorProps): ReactElement {
  const {
    children,
    field,
    error,
    message,
    status,
    color: color_prop,
    position = "top",
    validatingLabel = "Validando…",
    className,
  } = props;

  const explicit_message = typeof error === "string" ? error : undefined;
  const field_invalid = field !== undefined && field.touched && field.status === "invalid";
  const field_validating = field !== undefined && field.status === "validating";
  const resolved_message =
    message ?? explicit_message ?? (field_invalid ? field.error : undefined);
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

  const open = has_error || show_validating;

  const [sticky, set_sticky] = useState<{ text: string | undefined; validating: boolean }>({
    text: resolved_message,
    validating: show_validating,
  });

  useEffect(() => {
    if (open) set_sticky({ text: resolved_message, validating: show_validating });
  }, [open, resolved_message, show_validating]);

  const color = sticky.validating ? "info" : (color_prop ?? "error");
  const label = sticky.validating ? validatingLabel : sticky.text;
  const visible = open && label !== undefined && label !== "";

  const css_vars = assignInlineVars({
    [bubbleBg]: ScaleShade(color, "600"),
    [bubbleFg]: ScaleShade(color, "50"),
  });

  return (
    <div className={cx(styles.wrapper, className)} style={css_vars}>
      {children}
      <span
        className={styles.bubble}
        role="alert"
        data-open={visible ? "true" : undefined}
        data-position={position === "bottom" ? "bottom" : undefined}
        aria-hidden={visible ? undefined : true}
      >
        {label}
      </span>
    </div>
  );
}

FieldError.displayName = "FieldError";
