"use client";

import type { ReactElement } from "react";

import { useLocale } from "react-aria";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import {
  FormatAbsolute,
  FormatRelative,
  IsDateOnly,
  PRESETS,
  ToDate,
  ToIso,
} from "./date-display-format.js";
import type { DateDisplayProps } from "./DateDisplay.types.js";

const DEFAULT_THRESHOLD = 604_800_000;

export function DateDisplay(props: DateDisplayProps): ReactElement {
  const {
    value,
    mode = "absolute",
    preset,
    locale: locale_prop,
    timeZone,
    options,
    relativeThreshold = DEFAULT_THRESHOLD,
    withTitle = true,
    now,
    fallback = "—",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { locale: ambient } = useLocale();
  const locale = locale_prop ?? ambient;

  const parsed = ToDate(value);
  if (parsed === null) {
    return (
      <span className={cx(sprinkle_class, className)} style={sprinkle_style}>
        {fallback}
      </span>
    );
  }

  const date_only = IsDateOnly(value);
  const resolved_preset = preset ?? (date_only ? "date" : "datetime");
  const absolute_options: Intl.DateTimeFormatOptions = {
    ...PRESETS[resolved_preset],
    ...(timeZone === undefined ? {} : { timeZone }),
    ...options,
  };
  const absolute = FormatAbsolute(parsed, locale, absolute_options);

  const reference = now === undefined ? new Date() : new Date(now);
  const within_threshold = Math.abs(parsed.getTime() - reference.getTime()) < relativeThreshold;
  const is_relative = mode === "relative" || (mode === "auto" && within_threshold);
  const text = is_relative ? FormatRelative(parsed, locale, reference) : absolute;

  return (
    <time
      className={cx(sprinkle_class, className)}
      style={sprinkle_style}
      dateTime={ToIso(parsed, date_only)}
      data-mode={is_relative ? "relative" : "absolute"}
      {...(withTitle && is_relative ? { title: absolute } : {})}
    >
      {text}
    </time>
  );
}

DateDisplay.displayName = "DateDisplay";
