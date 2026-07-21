"use client";

import { useEffect, useState, type ReactNode } from "react";

import { createPortal } from "react-dom";

import type { PortalProps } from "./Portal.types.js";

function ResolveTarget(target: PortalProps["target"]): Element | null {
  if (target === null || target === undefined) return null;
  if (typeof target === "string") return document.querySelector(target);
  return target;
}

export function Portal(props: PortalProps): ReactNode {
  const { children, target, disabled = false } = props;
  const [mounted, set_mounted] = useState(false);

  useEffect(() => {
    set_mounted(true);
  }, []);

  if (disabled) return <>{children}</>;
  if (!mounted) return null;

  const node = ResolveTarget(target) ?? document.body;
  return createPortal(children, node);
}

Portal.displayName = "Portal";
