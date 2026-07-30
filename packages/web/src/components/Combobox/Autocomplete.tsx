"use client";

import type { ReactElement } from "react";

import { Combobox } from "./Combobox.js";
import type { AutocompleteProps } from "./patterns.types.js";

export function Autocomplete(props: AutocompleteProps): ReactElement {
  const { menuTrigger = "input", ...rest } = props;
  return <Combobox {...rest} menuTrigger={menuTrigger} allowsCustomValue />;
}

Autocomplete.displayName = "Autocomplete";
