"use client";

import type { ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import { SliderBase } from "./SliderBase.js";
import type { SliderProps } from "./Slider.types.js";

export function Slider(props: SliderProps): ReactElement {
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
    field: nebula_field,
    value,
    defaultValue = 0,
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

  const fp = useFieldProps<number>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    error,
    disabled,
    required,
  });

  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

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
          outputProps={outputProps}
          values={[fp.value]}
          onChange={(next) => {
            fp.onChange(next[0] ?? min);
          }}
          {...(onChangeEnd === undefined
            ? {}
            : {
                onChangeEnd: (next: number[]) => {
                  onChangeEnd(next[0] ?? min);
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
          ariaLabelledBy={label === undefined ? undefined : `${id}-label`}
          ariaLabel={label === undefined ? "Valor" : undefined}
          name={name}
          className={className}
        />
      )}
    </FormField>
  );
}

Slider.displayName = "Slider";
