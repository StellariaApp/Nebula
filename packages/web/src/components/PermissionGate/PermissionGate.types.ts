import type { ReactNode } from "react";

import type { PermissionDeniedMode, PermissionKey } from "@stellaria/nebula-tokens";

export interface PermissionGateProps<K extends PermissionKey = PermissionKey> {
  permission: K;
  mode?: PermissionDeniedMode | undefined;
  fallback?: ReactNode | undefined;
  deniedLabel?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}
