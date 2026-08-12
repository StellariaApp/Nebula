"use client";

import { useMemo, useState, type ReactElement } from "react";

import type { SelectOption } from "../../collections/options.js";

import { Combobox } from "./Combobox.js";
import type { CreatableSelectProps } from "./patterns.types.js";

function DefaultShouldCreate(label: string, data: readonly SelectOption[]): boolean {
  const trimmed = label.trim();
  if (trimmed === "") return false;
  return !data.some((option) => option.label.toLowerCase() === trimmed.toLowerCase());
}

export function CreatableSelect(props: CreatableSelectProps): ReactElement {
  const {
    data,
    onCreate,
    createLabel = (label) => `Create “${label}”`,
    shouldCreate = DefaultShouldCreate,
    onChange,
    onInputChange,
    ...rest
  } = props;

  const [created, set_created] = useState<SelectOption[]>([]);
  const [query, set_query] = useState("");

  const pool = useMemo(() => [...data, ...created], [data, created]);

  const options = useMemo<SelectOption[]>(() => {
    if (!shouldCreate(query, pool)) return pool;
    const trimmed = query.trim();
    const draft: SelectOption = {
      value: `__create__:${trimmed}`,
      label: trimmed,
      description: createLabel(trimmed),
    };
    return [...pool, draft];
  }, [pool, query, shouldCreate, createLabel]);

  const HandleChange = (value: string): void => {
    if (!value.startsWith("__create__:")) {
      onChange?.(value);
      return;
    }
    const label = value.slice("__create__:".length);
    const result = onCreate?.(label) ?? label;
    if (result === null) return;
    const option: SelectOption = typeof result === "string" ? { value: result, label } : result;
    set_created((current) =>
      current.some((entry) => entry.value === option.value) ? current : [...current, option],
    );
    set_query("");
    onChange?.(option.value);
  };

  return (
    <Combobox
      {...rest}
      data={options}
      allowsCustomValue={false}
      onChange={HandleChange}
      onInputChange={(next) => {
        set_query(next);
        onInputChange?.(next);
      }}
    />
  );
}

CreatableSelect.displayName = "CreatableSelect";
