import { useContext } from "react";

import type { PermissionKey } from "@stellaria/nebula-tokens";

import { PermissionContext, type PermissionResolver } from "./permission-context.js";

const DENY: PermissionResolver = () => false;

export function usePermission<K extends PermissionKey = PermissionKey>(key: K): boolean {
  const context = useContext(PermissionContext);
  if (context === null) return false;
  return context.resolve(key);
}

export function usePermissionResolver<
  K extends PermissionKey = PermissionKey,
>(): PermissionResolver<K> {
  const context = useContext(PermissionContext);
  return context === null ? DENY : context.resolve;
}

export function usePermissionGranted(key: PermissionKey | undefined): boolean {
  const context = useContext(PermissionContext);
  if (key === undefined) return true;
  if (context === null) return false;
  return context.resolve(key);
}
