"use client";

import { useMemo, useState, type ReactElement } from "react";

import { useFieldProps, useTheme } from "@stellaria/nebula-hooks";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { dayBg, dayBorder, dayFg } from "../Calendar/Calendar.vars.css.js";
import { CalendarHeader } from "../Calendar/CalendarHeader.js";

import * as styles from "./GridPicker.css.js";
import { GridPicker, type GridPickerItem } from "./GridPicker.js";
import type { YearPickerProps } from "./MonthPicker.types.js";

const YEAR_COLUMNS = 4;
const DEFAULT_PER_PAGE = 12;

function YearItems(start: number, count: number, min: string, max: string): GridPickerItem[] {
  return [...new Array(count).keys()].map((offset) => {
    const year = start + offset;
    const value = String(year).padStart(4, "0");
    return {
      value,
      label: value,
      disabled: (min !== "" && value < min) || (max !== "" && value > max),
    };
  });
}

function PageStart(anchor: number, per_page: number): number {
  return anchor - (((anchor % per_page) + per_page) % per_page);
}

export function YearPicker(props: YearPickerProps): ReactElement {
  const {
    label,
    size = "md",
    variant = "filled",
    color = "primary",
    minValue = "",
    maxValue = "",
    disabled = false,
    labels,
    yearsPerPage = DEFAULT_PER_PAGE,
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const fp = useFieldProps<string>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    disabled,
  });

  const per_page = Math.max(1, yearsPerPage);
  const anchor = fp.value === "" ? new Date().getFullYear() : Number(fp.value);
  const [start, set_start] = useState(() => PageStart(anchor, per_page));

  const items = useMemo(
    () => YearItems(start, per_page, minValue, maxValue),
    [start, per_page, minValue, maxValue],
  );

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const day_vars = assignInlineVars({
    [dayBg]: resolved.background,
    [dayFg]: resolved.foreground,
    [dayBorder]: resolved.borderColor,
  });

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...day_vars, ...sprinkle_style }}
    >
      <CalendarHeader
        title={`${String(start)} – ${String(start + per_page - 1)}`}
        size={size}
        prevButtonProps={{
          onPress: () => {
            set_start(start - per_page);
          },
          isDisabled: disabled,
        }}
        nextButtonProps={{
          onPress: () => {
            set_start(start + per_page);
          },
          isDisabled: disabled,
        }}
        labels={{
          previousMonth: labels?.previousRange ?? "Años anteriores",
          nextMonth: labels?.nextRange ?? "Años siguientes",
        }}
      />
      <GridPicker
        items={items}
        value={fp.value}
        onSelect={fp.onChange}
        columns={YEAR_COLUMNS}
        size={size}
        label={typeof label === "string" ? label : "Selecciona un año"}
        disabled={fp.isDisabled}
      />
    </div>
  );
}

YearPicker.displayName = "YearPicker";
