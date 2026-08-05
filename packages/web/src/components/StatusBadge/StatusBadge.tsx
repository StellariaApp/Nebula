"use client";

import { useContext, type ReactElement } from "react";

import { Badge } from "../Badge/Badge.js";
import { visually_hidden } from "../VisuallyHidden/VisuallyHidden.css.js";

import { StatusMapContext } from "./status-map-context.js";
import type { StatusBadgeProps, StatusDescriptor, StatusMap } from "./StatusBadge.types.js";

const UNMAPPED: Omit<StatusDescriptor, "label"> = { color: "error", variant: "outline" };

export function StatusBadge<S extends string = string>(props: StatusBadgeProps<S>): ReactElement {
  const { status, map, variant, color, dot, ...rest } = props;

  const provided = useContext(StatusMapContext);
  const source = map === undefined ? provided : (map as StatusMap);
  const descriptor = source === null ? undefined : source[status];
  const resolved: StatusDescriptor = descriptor ?? { ...UNMAPPED, label: status };

  return (
    <Badge
      {...rest}
      variant={variant ?? resolved.variant ?? "light"}
      color={color ?? resolved.color ?? "primary"}
      dot={dot ?? resolved.dot ?? false}
      {...(resolved.icon === undefined ? {} : { leftSection: resolved.icon })}
    >
      {resolved.label}
      {resolved.description === undefined ? null : (
        <span className={visually_hidden}>{resolved.description}</span>
      )}
    </Badge>
  );
}

StatusBadge.displayName = "StatusBadge";
