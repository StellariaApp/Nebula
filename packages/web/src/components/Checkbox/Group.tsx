"use client";

import { useId, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx } from "../../utils/style-props.js";
import { FieldError } from "../FieldError/FieldError.js";

import { CheckboxGroupContext, type CheckboxGroupContextValue } from "./Checkbox.context.js";
import * as styles from "./Checkbox.css.js";
import type { CheckboxGroupProps } from "./Checkbox.types.js";

export function CheckboxGroup(props: CheckboxGroupProps): ReactElement {
  const {
    label,
    description,
    error,
    value,
    defaultValue = [],
    onChange,
    size = "md",
    color = "primary",
    disabled = false,
    required = false,
    name,
    orientation = "vertical",
    errorDisplay = "tooltip",
    children,
  } = props;

  const auto_id = useId();
  const label_id = `${auto_id}-label`;
  const description_id = `${auto_id}-description`;
  const error_id = `${auto_id}-error`;

  const [group_value, set_group_value] = useUncontrolled<string[]>(value, defaultValue, onChange);

  const Toggle = (item: string): void => {
    const next = group_value.includes(item)
      ? group_value.filter((current) => current !== item)
      : [...group_value, item];
    set_group_value(next);
  };

  const use_tooltip = errorDisplay === "tooltip";
  const error_message = typeof error === "string" ? error : undefined;
  const is_invalid = error === true || error_message !== undefined;
  const described_by =
    [description ? description_id : null, !use_tooltip && error_message ? error_id : null]
      .filter((entry): entry is string => entry !== null)
      .join(" ") || undefined;

  const context: CheckboxGroupContextValue = {
    name,
    value: group_value,
    toggle: Toggle,
    size,
    color,
    disabled,
  };

  const items_node = (
    <div className={cx(orientation === "horizontal" ? styles.list_row : styles.list)}>
      <CheckboxGroupContext.Provider value={context}>{children}</CheckboxGroupContext.Provider>
    </div>
  );

  return (
    <div
      role="group"
      className={field.root}
      aria-labelledby={label === undefined || label === null ? undefined : label_id}
      aria-describedby={described_by}
      aria-invalid={is_invalid ? true : undefined}
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
      {use_tooltip ? <FieldError message={error_message}>{items_node}</FieldError> : items_node}
      {use_tooltip || error_message === undefined ? null : (
        <span id={error_id} role="alert" className={field.error}>
          {error_message}
        </span>
      )}
    </div>
  );
}

CheckboxGroup.displayName = "CheckboxGroup";
