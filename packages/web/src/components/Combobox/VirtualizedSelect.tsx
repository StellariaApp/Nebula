"use client";

import type { ReactElement } from "react";

import { Combobox } from "./Combobox.js";
import type { VirtualizedSelectProps } from "./patterns.types.js";

const DEFAULT_THRESHOLD = 50;

export function VirtualizedSelect(props: VirtualizedSelectProps): ReactElement {
  const { virtualizeFrom = DEFAULT_THRESHOLD, ...rest } = props;
  return <Combobox {...rest} allowsCustomValue={false} virtualizeFrom={virtualizeFrom} />;
}

VirtualizedSelect.displayName = "VirtualizedSelect";
