"use client";

import { lazy, Suspense, type ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Skeleton } from "../Skeleton/Skeleton.js";
import { MultiSelect } from "../MultiSelect/MultiSelect.js";
import { Radio } from "../Radio/Radio.js";
import { RadioGroup } from "../Radio/Group.js";
import { Select } from "../Select/Select.js";
import { TextInput } from "../TextInput/TextInput.js";

import { JoinRange, RangeParts } from "./filter-state.js";
import * as styles from "./Filters.css.js";
import { DEFAULT_FILTER_LABELS } from "./filter-labels.js";
import type { FilterProps } from "./Filters.types.js";

const LazyDatePicker = lazy(async () => {
  const loaded = await import("../DatePicker/DatePicker.js");
  return { default: loaded.DatePicker };
});

const LazyDateRangePicker = lazy(async () => {
  const loaded = await import("../DateRangePicker/DateRangePicker.js");
  return { default: loaded.DateRangePicker };
});

export function Filter(props: FilterProps): ReactElement {
  const { filter, accessors, size = "sm", labels, className, rangeProps, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);
  const text = { ...DEFAULT_FILTER_LABELS, ...labels };

  const options = (filter.options ?? []).map((option) => ({
    value: option.value,
    label: option.label,
    ...(option.disabled === undefined ? {} : { disabled: option.disabled }),
  }));

  const shared = {
    size,
    label: filter.label,
    ...(filter.disabled === undefined ? {} : { disabled: filter.disabled }),
    ...(filter.placeholder === undefined ? {} : { placeholder: filter.placeholder }),
  };

  const Set = (value: string | readonly string[]): void => {
    if (value === "" || (Array.isArray(value) && value.length === 0)) {
      accessors.onDelete(filter.key);
      return;
    }
    accessors.onSet(filter.key, value);
  };

  const body = ((): ReactElement => {
    switch (filter.type) {
      case "multiselect":
        return (
          <MultiSelect
            {...shared}
            data={options}
            value={accessors.values(filter.key) ?? []}
            onChange={Set}
          />
        );
      case "radio":
        return (
          <RadioGroup
            label={filter.label}
            size={size}
            {...(filter.disabled === undefined ? {} : { disabled: filter.disabled })}
            value={accessors.value(filter.key) ?? ""}
            onChange={Set}
          >
            {options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </RadioGroup>
        );
      case "range": {
        const [from, to] = RangeParts(accessors.value(filter.key));
        return (
          <Box {...rangeProps} className={cx(styles.range, rangeProps?.className)}>
            <TextInput
              size={size}
              label={filter.label}
              type="number"
              placeholder={text.from}
              aria-label={text.from}
              {...(filter.min === undefined ? {} : { min: filter.min })}
              {...(filter.max === undefined ? {} : { max: filter.max })}
              value={from}
              onChange={(next) => {
                Set(JoinRange(next, to));
              }}
            />
            <TextInput
              size={size}
              type="number"
              placeholder={text.to}
              aria-label={text.to}
              {...(filter.min === undefined ? {} : { min: filter.min })}
              {...(filter.max === undefined ? {} : { max: filter.max })}
              value={to}
              onChange={(next) => {
                Set(JoinRange(from, next));
              }}
            />
          </Box>
        );
      }
      case "date":
        return (
          <Suspense fallback={<Skeleton height={36} />}>
            <LazyDatePicker
              size={size}
              label={filter.label}
              {...(filter.disabled === undefined ? {} : { disabled: filter.disabled })}
              value={accessors.value(filter.key) ?? ""}
              onChange={Set}
            />
          </Suspense>
        );
      case "daterange": {
        const [start, end] = RangeParts(accessors.value(filter.key));
        return (
          <Suspense fallback={<Skeleton height={36} />}>
            <LazyDateRangePicker
              size={size}
              label={filter.label}
              {...(filter.disabled === undefined ? {} : { disabled: filter.disabled })}
              value={{ start, end }}
              onChange={(next) => {
                Set(JoinRange(next.start, next.end));
              }}
            />
          </Suspense>
        );
      }
      case "text":
        return <TextInput {...shared} value={accessors.value(filter.key) ?? ""} onChange={Set} />;
      case "select":
      default:
        return (
          <Select
            {...shared}
            data={options}
            value={accessors.value(filter.key) ?? ""}
            onChange={Set}
          />
        );
    }
  })();

  return (
    <div
      className={cx(styles.item, sprinkle_class, className)}
      style={sprinkle_style}
      data-filter={filter.key}
      {...rest}
    >
      {body}
    </div>
  );
}

Filter.displayName = "Filter";
