"use client";

import { useId, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx } from "../../utils/style-props.js";

import { RadioGroupContext, type RadioGroupContextValue } from "./Radio.context.js";
import * as styles from "./Radio.css.js";
import type { RadioGroupProps } from "./Radio.types.js";

export function RadioGroup(props: RadioGroupProps): ReactElement {
  const {
    label,
    description,
    error,
    value,
    defaultValue,
    onChange,
    size = "md",
    color = "primary",
    disabled = false,
    required = false,
    name,
    orientation = "vertical",
    children,
  } = props;

  const auto_id = useId();
  const group_name = name ?? auto_id;
  const label_id = `${auto_id}-label`;
  const description_id = `${auto_id}-description`;
  const error_id = `${auto_id}-error`;

  const [group_value, set_group_value] = useUncontrolled<string>(
    value,
    defaultValue ?? "",
    onChange,
  );

  const error_message = typeof error === "string" ? error : undefined;
  const is_invalid = error === true || error_message !== undefined;
  const described_by =
    [description ? description_id : null, error_message ? error_id : null]
      .filter((entry): entry is string => entry !== null)
      .join(" ") || undefined;

  const context: RadioGroupContextValue = {
    name: group_name,
    value: group_value,
    onChange: set_group_value,
    size,
    color,
    disabled,
  };

  return (
    <div
      role="radiogroup"
      className={field.root}
      aria-labelledby={label === undefined || label === null ? undefined : label_id}
      aria-describedby={described_by}
      aria-invalid={is_invalid ? true : undefined}
      aria-required={required ? true : undefined}
    >
      {label === undefined || label === null ? null : (
        <span id={label_id} className={field.label}>
          {label}
          {required ? (
            <span className={field.required} aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
      )}
      {description === undefined || description === null ? null : (
        <span id={description_id} className={field.description}>
          {description}
        </span>
      )}
      <div className={cx(orientation === "horizontal" ? styles.listRow : styles.list)}>
        <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
      </div>
      {error_message === undefined ? null : (
        <span id={error_id} role="alert" className={field.error}>
          {error_message}
        </span>
      )}
    </div>
  );
}

RadioGroup.displayName = "RadioGroup";
