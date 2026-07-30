"use client";

import type { ReactElement } from "react";

import { Combobox } from "./Combobox.js";
import type { SearchableSelectProps } from "./patterns.types.js";

export function SearchableSelect(props: SearchableSelectProps): ReactElement {
  return <Combobox {...props} allowsCustomValue={false} />;
}

SearchableSelect.displayName = "SearchableSelect";
