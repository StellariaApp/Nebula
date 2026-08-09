"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";

import { useDebounce } from "@stellaria/nebula-hooks";

import type { SelectOption } from "../../collections/options.js";

import { Combobox } from "./Combobox.js";
import type { AsyncSelectProps } from "./patterns.types.js";

const NO_OPTIONS: readonly SelectOption[] = [];

export function AsyncSelect(props: AsyncSelectProps): ReactElement {
  const {
    load,
    debounce = 300,
    minQueryLength = 1,
    loadingLabel = "Searching…",
    errorLabel = "Could not load",
    initialData = NO_OPTIONS,
    emptyLabel = "No results",
    ...rest
  } = props;

  const [query, set_query] = useState("");
  const [data, set_data] = useState<readonly SelectOption[]>(initialData);
  const [state, set_state] = useState<"idle" | "loading" | "error">("idle");

  const debounced = useDebounce(query, debounce);
  const request_ref = useRef(0);
  const load_ref = useRef(load);
  const initial_ref = useRef(initialData);
  load_ref.current = load;
  initial_ref.current = initialData;

  useEffect(() => {
    if (debounced.trim().length < minQueryLength) {
      set_data(initial_ref.current);
      set_state("idle");
      return;
    }

    const ticket = request_ref.current + 1;
    request_ref.current = ticket;
    set_state("loading");

    load_ref
      .current(debounced)
      .then((result) => {
        if (request_ref.current !== ticket) return;
        set_data(result);
        set_state("idle");
      })
      .catch(() => {
        if (request_ref.current !== ticket) return;
        set_data(NO_OPTIONS);
        set_state("error");
      });
  }, [debounced, minQueryLength]);

  return (
    <Combobox
      {...rest}
      data={data}
      onInputChange={set_query}
      emptyLabel={state === "loading" ? loadingLabel : state === "error" ? errorLabel : emptyLabel}
    />
  );
}

AsyncSelect.displayName = "AsyncSelect";
