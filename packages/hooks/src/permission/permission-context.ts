import { createContext } from "react";

import type { PermissionKey } from "@stellaria/nebula-tokens";

export type PermissionResolver<K extends PermissionKey = PermissionKey> = (key: K) => boolean;

export interface PermissionContextValue {
  resolve: PermissionResolver<PermissionKey>;
}

export const PermissionContext = createContext<PermissionContextValue | null>(null);
PermissionContext.displayName = "NebulaPermissionContext";
