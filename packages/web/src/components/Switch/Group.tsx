"use client";

import { useId, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx } from "../../utils/style-props.js";

import { SwitchGroupContext, type SwitchGroupContextValue } from "./Switch.context.js";
import * as styles from "./Switch.css.js";
import type { SwitchGroupProps } from "./Switch.types.js";

export function SwitchGroup(props: SwitchGroupProps): ReactElement {
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
    name,
    orientation = "vertical",
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

  const error_message = typeof error === "string" ? error : undefined;
  const is_invalid = error === true || error_message !== undefined;
  const described_by =
    [description ? description_id : null, error_message ? error_id : null]
      .filter((entry): entry is string => entry !== null)
      .join(" ") || undefined;

  const context: SwitchGroupContextValue = {
    name,
    value: group_value,
    toggle: Toggle,
    size,
    color,
    disabled,
  };

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
        </span>
      )}
      {description === undefined || description === null ? null : (
        <span id={description_id} className={field.description}>
          {description}
        </span>
      )}
      <div className={cx(orientation === "horizontal" ? styles.listRow : styles.list)}>
        <SwitchGroupContext.Provider value={context}>{children}</SwitchGroupContext.Provider>
      </div>
      {error_message === undefined ? null : (
        <span id={error_id} role="alert" className={field.error}>
          {error_message}
        </span>
      )}
    </div>
  );
}

SwitchGroup.displayName = "SwitchGroup";
