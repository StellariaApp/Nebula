"use client";

import { forwardRef, useId, type ElementType, type ReactElement, type Ref } from "react";

import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { FieldError } from "../FieldError/FieldError.js";
import { Text } from "../Text/Text.js";

import * as styles from "./FormField.css.js";
import type {
  FormFieldControlProps,
  FormFieldOwnProps,
  FormFieldProps,
} from "./FormField.types.js";

const FormFieldComponent = forwardRef<HTMLElement, FormFieldOwnProps>(
  function FormField(props, ref) {
    const {
      component,
      label,
      description,
      error,
      errorDisplay = "tooltip",
      status,
      required = false,
      id,
      className,
      children,
      labelProps,
      descriptionProps,
      requiredProps,
      headerProps,
      bodyProps,
      errorProps,
      ...rest
    } = props;

    const auto_id = useId();
    const input_id = id ?? auto_id;
    const description_id = `${input_id}-description`;
    const error_id = `${input_id}-error`;

    const error_message = typeof error === "string" ? error : undefined;
    const is_invalid = error === true || error_message !== undefined;
    const use_tooltip = errorDisplay === "tooltip";

    const described_by =
      [
        description === undefined || description === null ? null : description_id,
        !use_tooltip && error_message ? error_id : null,
      ]
        .filter((value): value is string => value !== null)
        .join(" ") || undefined;

    const control: FormFieldControlProps = {
      id: input_id,
      "aria-describedby": described_by,
      "aria-invalid": is_invalid ? true : undefined,
      "aria-required": required ? true : undefined,
    };

    const has_header =
      (label !== undefined && label !== null) ||
      (description !== undefined && description !== null);

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.root, className)}
        {...rest}
      >
        {has_header ? (
          <Box {...headerProps} className={cx(styles.header, headerProps?.className)}>
            {label === undefined || label === null ? null : (
              <Text
                component="label"
                id={`${input_id}-label`}
                htmlFor={input_id}
                {...labelProps}
                className={cx(styles.label, labelProps?.className)}
              >
                {label}
                {required ? (
                  <Box
                    component="span"
                    aria-hidden="true"
                    {...requiredProps}
                    className={cx(styles.required, requiredProps?.className)}
                  >
                    *
                  </Box>
                ) : null}
              </Text>
            )}
            {description === undefined || description === null ? null : (
              <Text
                component="span"
                id={description_id}
                {...descriptionProps}
                className={cx(styles.description, descriptionProps?.className)}
              >
                {description}
              </Text>
            )}
          </Box>
        ) : null}
        <Box {...bodyProps} className={cx(styles.body, bodyProps?.className)}>
          {use_tooltip ? (
            <FieldError message={error_message} status={status} {...errorProps}>
              {typeof children === "function" ? children(control) : children}
            </FieldError>
          ) : (
            <>
              {typeof children === "function" ? children(control) : children}
              {error_message === undefined ? null : (
                <Text
                  component="span"
                  id={error_id}
                  role="alert"
                  className={cx(styles.error, errorProps?.className)}
                >
                  {error_message}
                </Text>
              )}
            </>
          )}
        </Box>
      </Box>
    );
  },
);

interface FormFieldComponent {
  <C extends ElementType = "div">(props: FormFieldProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const FormField = FormFieldComponent as unknown as FormFieldComponent;
FormField.displayName = "FormField";
