"use client";

import { forwardRef, type ChangeEvent } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton.js";

import * as styles from "./NumberInput.css.js";
import type { NumberInputProps } from "./NumberInput.types.js";

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(props, ref) {
    const {
      label,
      description,
      error,
      required = false,
      disabled = false,
      size = "md",
      field: nebula_field,
      value,
      defaultValue = Number.NaN,
      onChange,
      min,
      max,
      step = 1,
      hideControls = false,
      incrementLabel = "Incrementar",
      decrementLabel = "Disminuir",
      className,
      rootClassName,
      errorDisplay = "tooltip",
      ...input_rest
    } = props;

    const fp = useFieldProps<number>({
      field: nebula_field,
      value,
      defaultValue,
      onChange,
      error,
      disabled,
      required,
    });

    const current = fp.value;
    const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

    const Clamp = (next: number): number => {
      let clamped = next;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      return clamped;
    };

    const Step = (direction: 1 | -1): void => {
      const base = Number.isFinite(current) ? current : (min ?? 0);
      fp.onChange(Clamp(base + direction * step));
    };

    const HandleInput = (raw: string): void => {
      if (raw === "") {
        fp.onChange(Number.NaN);
        return;
      }
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) fp.onChange(Clamp(parsed));
    };

    const display = Number.isFinite(current) ? String(current) : "";
    const at_max = max !== undefined && Number.isFinite(current) && current >= max;
    const at_min = min !== undefined && Number.isFinite(current) && current <= min;

    return (
      <FormField
        label={label}
        description={description}
        error={form_error}
        errorDisplay={errorDisplay}
        status={fp.status}
        required={required}
        className={rootClassName}
      >
        {(control) => (
          <div
            className={field.field({ size })}
            data-invalid={fp.isInvalid ? "true" : undefined}
            data-disabled={fp.isDisabled ? "true" : undefined}
          >
            <input
              {...control}
              {...input_rest}
              ref={ref}
              type="number"
              inputMode="decimal"
              className={cx(field.input, styles.numberInput, className)}
              value={display}
              onChange={(event: ChangeEvent<HTMLInputElement>) => HandleInput(event.target.value)}
              disabled={fp.isDisabled}
              required={required}
              {...(min === undefined ? {} : { min })}
              {...(max === undefined ? {} : { max })}
              step={step}
            />
            {hideControls ? null : (
              <div className={styles.stepper}>
                <UnstyledButton
                  className={styles.stepperButton}
                  aria-label={incrementLabel}
                  tabIndex={-1}
                  disabled={fp.isDisabled || at_max}
                  onPress={() => Step(1)}
                >
                  ▲
                </UnstyledButton>
                <UnstyledButton
                  className={styles.stepperButton}
                  aria-label={decrementLabel}
                  tabIndex={-1}
                  disabled={fp.isDisabled || at_min}
                  onPress={() => Step(-1)}
                >
                  ▼
                </UnstyledButton>
              </div>
            )}
          </div>
        )}
      </FormField>
    );
  },
);

NumberInput.displayName = "NumberInput";
