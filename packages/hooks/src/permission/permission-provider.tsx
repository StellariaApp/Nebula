"use client";

import { useMemo, type ReactElement, type ReactNode } from "react";

import type { PermissionKey } from "@stellaria/nebula-tokens";

import {
  PermissionContext,
  type PermissionContextValue,
  type PermissionResolver,
} from "./permission-context.js";

export interface PermissionProviderProps<K extends PermissionKey = PermissionKey> {
  resolver: PermissionResolver<K>;
  children: ReactNode;
}

export function PermissionProvider<K extends PermissionKey = PermissionKey>(
  props: PermissionProviderProps<K>,
): ReactElement {
  const { resolver, children } = props;

  const value = useMemo<PermissionContextValue>(
    () => ({ resolve: resolver as PermissionResolver<PermissionKey> }),
    [resolver],
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

PermissionProvider.displayName = "PermissionProvider";
