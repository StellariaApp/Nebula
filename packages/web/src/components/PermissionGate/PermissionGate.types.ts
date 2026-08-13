import type { ReactNode } from "react";

import type { PermissionDeniedMode, PermissionKey } from "@stellaria/nebula-tokens";

export interface PermissionGateProps<K extends PermissionKey = PermissionKey> {
  /**
   * The key this subtree is gated on. It is resolved by the app's own resolver, which is why the key
   * type is the app's and not the library's — the core never learns what the keys mean.
   */
  permission: K;
  /**
   * What denial looks like. `"hide"` removes the subtree; the other mode keeps it on screen and
   * marks it `inert`, so it is visible but unreachable by pointer and by keyboard alike. Hiding is
   * the safer default: a control the user can see but not use needs a reason they can read.
   * @default "hide"
   */
  mode?: PermissionDeniedMode | undefined;
  /**
   * What renders in place of the subtree when it is hidden. Only used by `"hide"` — the inert mode
   * shows the real children instead. Left out, denial renders nothing.
   * @default null
   */
  fallback?: ReactNode | undefined;
  /**
   * Text announced before the inert subtree, so a screen reader learns why nothing responds. Only
   * read in the inert mode, and without it the denial is silent — which is the case worth avoiding.
   */
  deniedLabel?: string | undefined;
  /** What the permission protects. */
  children?: ReactNode | undefined;
  /** Lands on the wrapper the inert mode adds. There is no wrapper when the gate lets you through. */
  className?: string | undefined;
}
