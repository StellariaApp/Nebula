"use client";

import { useMemo, useState, type ReactElement } from "react";

import { useFieldProps, useTheme } from "@stellaria/nebula-hooks";
import { useLocale } from "react-aria";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "@stellaria/nebula-themes/web";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import * as calendar_vars from "../Calendar/Calendar.vars.css.js";
import { CalendarHeader } from "../Calendar/CalendarHeader.js";

import * as styles from "./GridPicker.css.js";
import { GridPicker, type GridPickerItem } from "./GridPicker.js";
import type { MonthPickerProps } from "./MonthPicker.types.js";

const MONTH_COLUMNS = 3;

function MonthItems(locale: string, year: number, min: string, max: string): GridPickerItem[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
  return [...new Array(12).keys()].map((index) => {
    const value = `${String(year).padStart(4, "0")}-${String(index + 1).padStart(2, "0")}`;
    return {
      value,
      label: formatter.format(new Date(Date.UTC(2020, index, 1))),
      disabled: (min !== "" && value < min) || (max !== "" && value > max),
    };
  });
}

export function MonthPicker(props: MonthPickerProps): ReactElement {
  const {
    label,
    size = "md",
    variant = "filled",
    color = "primary",
    locale: locale_prop,
    minValue = "",
    maxValue = "",
    disabled = false,
    labels,
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    className,
    cellProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { locale: ambient } = useLocale();
  const locale = locale_prop ?? ambient;

  const fp = useFieldProps<string>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    disabled,
  });

  const selected_year = fp.value === "" ? new Date().getFullYear() : Number(fp.value.slice(0, 4));
  const [year, set_year] = useState(selected_year);

  const items = useMemo(
    () => MonthItems(locale, year, minValue, maxValue),
    [locale, year, minValue, maxValue],
  );

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const day_vars = assignInlineVars({
    [calendar_vars.dayBg]: resolved.background,
    [calendar_vars.dayBgHover]: resolved.backgroundHover,
    [calendar_vars.dayFg]: resolved.foreground,
    [calendar_vars.dayBorder]: resolved.borderColor,
  });

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...day_vars, ...sprinkle_style }}
    >
      <CalendarHeader
        title={String(year)}
        size={size}
        prevButtonProps={{
          onPress: () => {
            set_year(year - 1);
          },
          isDisabled: disabled,
        }}
        nextButtonProps={{
          onPress: () => {
            set_year(year + 1);
          },
          isDisabled: disabled,
        }}
        labels={{
          previousMonth: labels?.previousYear ?? "Previous year",
          nextMonth: labels?.nextYear ?? "Next year",
        }}
      />
      <GridPicker
        items={items}
        value={fp.value}
        onSelect={fp.onChange}
        columns={MONTH_COLUMNS}
        size={size}
        label={typeof label === "string" ? label : "Select a month"}
        disabled={fp.isDisabled}
        cellProps={cellProps}
      />
    </div>
  );
}

MonthPicker.displayName = "MonthPicker";
