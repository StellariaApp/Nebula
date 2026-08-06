"use client";

import { forwardRef, type ChangeEvent } from "react";

import { useDebouncedCallback, useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton.js";

import type { SearchInputProps } from "./SearchInput.types.js";
import { Close, Search } from "../../glyphs/index.js";

const SEARCH_ICON = <Search />;

const CLEAR_ICON = <Close />;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(props, ref) {
    const {
      label,
      description,
      error,
      required = false,
      disabled = false,
      size = "md",
      surface = "outline",
      field: nebula_field,
      value,
      defaultValue = "",
      onChange,
      onSearch,
      debounce = 300,
      clearable = true,
      clearLabel = "Limpiar",
      className,
      rootClassName,
      errorDisplay = "tooltip",
      labelProps,
      descriptionProps,
      requiredProps,
      headerProps,
      bodyProps,
      errorProps,
      ...input_rest_and_style
    } = props;
    const field_slots = {
      labelProps,
      descriptionProps,
      requiredProps,
      headerProps,
      bodyProps,
      errorProps,
    };
    const {
      className: sprinkle_class,
      style: sprinkle_style,
      rest: input_rest,
    } = ExtractStyleProps(input_rest_and_style);

    const fp = useFieldProps({
      field: nebula_field,
      value,
      defaultValue,
      onChange,
      error,
      disabled,
      required,
    });

    const debounced_search = useDebouncedCallback((next: string) => {
      onSearch?.(next);
    }, debounce);

    const HandleChange = (next: string): void => {
      fp.onChange(next);
      debounced_search(next);
    };

    const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);
    const show_clear = clearable && fp.value.length > 0 && !fp.isDisabled;

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
        {(control) => (
          <div
            className={field.field({ size, surface })}
            data-invalid={fp.isInvalid ? "true" : undefined}
            data-disabled={fp.isDisabled ? "true" : undefined}
          >
            <span className={field.section} aria-hidden="true">
              {SEARCH_ICON}
            </span>
            <input
              {...control}
              {...input_rest}
              ref={ref}
              type="search"
              className={cx(field.input, className)}
              value={fp.value}
              onChange={(event: ChangeEvent<HTMLInputElement>) => HandleChange(event.target.value)}
              disabled={fp.isDisabled}
              required={required}
            />
            {show_clear ? (
              <UnstyledButton
                className={field.section}
                aria-label={clearLabel}
                onPress={() => HandleChange("")}
              >
                {CLEAR_ICON}
              </UnstyledButton>
            ) : null}
          </div>
        )}
      </FormField>
    );
  },
);

SearchInput.displayName = "SearchInput";
