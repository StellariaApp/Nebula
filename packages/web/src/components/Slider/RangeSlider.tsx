"use client";

import type { ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import { SliderBase } from "./SliderBase.js";
import type { RangeSliderProps, RangeSliderValue } from "./Slider.types.js";

const DEFAULT_THUMB_LABELS = ["Minimum", "Maximum"] as const;

export function RangeSlider(props: RangeSliderProps): ReactElement {
  const {
    label,
    description,
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    size = "md",
    color = "primary",
    variant,
    min = 0,
    max = 100,
    step = 1,
    marks,
    withValue = true,
    formatValue,
    thumbLabels = DEFAULT_THUMB_LABELS,
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    onChangeEnd,
    name,
    className,
    rootClassName,
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
    marksProps,
    markProps,
    outputProps,
    ...style_rest
  } = props;
  const field_slots = {
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
  };
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const fp = useFieldProps<RangeSliderValue>({
    field: nebula_field,
    value,
    defaultValue: defaultValue ?? { start: min, end: max },
    onChange,
    error,
    disabled,
    required,
  });

  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  const ToRange = (next: number[]): RangeSliderValue => ({
    start: next[0] ?? min,
    end: next[1] ?? max,
  });

  return (
    <FormField
      {...field_slots}
      label={label}
      description={description}
      error={form_error}
      errorDisplay={errorDisplay}
      status={fp.status}
      required={required}
      className={cx(sprinkle_class, rootClassName)}
      style={sprinkle_style}
    >
      {({ id }) => (
        <SliderBase
          marksProps={marksProps}
          markProps={markProps}
          outputProps={outputProps}
          values={[fp.value.start, fp.value.end]}
          onChange={(next) => {
            fp.onChange(ToRange(next));
          }}
          {...(onChangeEnd === undefined
            ? {}
            : {
                onChangeEnd: (next: number[]) => {
                  onChangeEnd(ToRange(next));
                },
              })}
          min={min}
          max={max}
          step={step}
          size={size}
          color={color}
          variant={variant}
          disabled={fp.isDisabled}
          marks={marks}
          withValue={withValue}
          formatValue={formatValue}
          thumbLabels={thumbLabels}
          ariaLabelledBy={label === undefined ? undefined : `${id}-label`}
          ariaLabel={label === undefined ? "Range" : undefined}
          name={name}
          className={className}
        />
      )}
    </FormField>
  );
}

RangeSlider.displayName = "RangeSlider";
