"use client";

import type { ReactElement } from "react";

import { StatusMapContext } from "./status-map-context.js";
import type { StatusMapProviderProps } from "./StatusBadge.types.js";

export function StatusMapProvider<S extends string = string>(
  props: StatusMapProviderProps<S>,
): ReactElement {
  const { map, children } = props;
  return <StatusMapContext.Provider value={map}>{children}</StatusMapContext.Provider>;
}

StatusMapProvider.displayName = "StatusMapProvider";
