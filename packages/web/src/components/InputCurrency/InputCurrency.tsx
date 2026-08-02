"use client";

import { forwardRef, useState, type ChangeEvent } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { useLocale } from "react-aria";

import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import { FormatAmount, ParseAmount } from "./currency-format.js";
import * as styles from "./InputCurrency.css.js";
import type { InputCurrencyProps } from "./InputCurrency.types.js";

export const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(
  function InputCurrency(props, ref) {
    const {
      currency,
      label,
      description,
      placeholder,
      error,
      errorDisplay = "tooltip",
      required = false,
      disabled = false,
      size = "md",
      surface = "outline",
      field: nebula_field,
      value,
      defaultValue = Number.NaN,
      onChange,
      min,
      max,
      precision,
      locale: locale_prop,
      name,
      className,
      rootClassName,
      ...style_rest
    } = props;
    const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

    const { locale: ambient } = useLocale();
    const locale = locale_prop ?? ambient;

    const fp = useFieldProps<number>({
      field: nebula_field,
      value,
      defaultValue,
      onChange,
      error,
      disabled,
      required,
    });

    const [draft, set_draft] = useState<string | null>(null);

    const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

    const Clamp = (next: number): number => {
      let clamped = next;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      return clamped;
    };

    const HandleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      const raw = event.target.value;
      set_draft(raw);
      if (raw.trim() === "") {
        fp.onChange(Number.NaN);
        return;
      }
      const parsed = ParseAmount(raw, locale);
      if (Number.isFinite(parsed)) fp.onChange(Clamp(parsed));
    };

    const HandleBlur = (): void => {
      set_draft(null);
      if (Number.isFinite(fp.value)) fp.onChange(Clamp(fp.value));
    };

    const display =
      draft ??
      (Number.isFinite(fp.value) ? FormatAmount(fp.value, locale, currency, precision) : "");

    return (
      <FormField
        label={label}
        description={description}
        error={form_error}
        errorDisplay={errorDisplay}
        status={fp.status}
        required={required}
        className={cx(sprinkle_class, rootClassName)}
        style={sprinkle_style}
      >
        {(control) => (
          <div
            className={field.field({ size, surface })}
            data-invalid={fp.isInvalid ? "true" : undefined}
            data-disabled={fp.isDisabled ? "true" : undefined}
          >
            <input
              {...control}
              ref={ref}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              className={cx(field.input, styles.amount, className)}
              value={display}
              onChange={HandleChange}
              onFocus={() => {
                set_draft(Number.isFinite(fp.value) ? String(fp.value) : "");
              }}
              onBlur={HandleBlur}
              disabled={fp.isDisabled}
              required={required}
              {...(placeholder === undefined ? {} : { placeholder })}
              {...(name === undefined ? {} : { name })}
            />
          </div>
        )}
      </FormField>
    );
  },
);

InputCurrency.displayName = "InputCurrency";
