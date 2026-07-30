"use client";

import type { ReactElement } from "react";

import { usePermission } from "@stellaria/nebula-hooks";
import type { PermissionKey } from "@stellaria/nebula-tokens";

import { cx } from "../../utils/style-props.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./PermissionGate.css.js";
import type { PermissionGateProps } from "./PermissionGate.types.js";

export function PermissionGate<K extends PermissionKey = PermissionKey>(
  props: PermissionGateProps<K>,
): ReactElement {
  const { permission, mode = "hide", fallback = null, deniedLabel, children, className } = props;

  const granted = usePermission<K>(permission);

  if (granted) return <>{children}</>;
  if (mode === "hide") return <>{fallback}</>;

  return (
    <>
      {deniedLabel === undefined ? null : <VisuallyHidden>{deniedLabel}</VisuallyHidden>}
      <div className={cx(styles.disabled, className)} data-permission-denied="true" inert>
        {children}
      </div>
    </>
  );
}

PermissionGate.displayName = "PermissionGate";
