import type { ReactElement } from "react";

import type { Size, Variant } from "@stellaria/nebula-tokens";

import type { PreviewGroup, PreviewSample } from "./types";

export const FULL = [
  "filled",
  "light",
  "outline",
  "glass",
  "gradient",
  "ghost",
] as const satisfies readonly Variant[];

export const NO_GLASS = [
  "filled",
  "light",
  "outline",
  "gradient",
  "ghost",
] as const satisfies readonly Variant[];

export const SOLID = ["filled", "light", "outline"] as const satisfies readonly Variant[];

export const SIZES = ["xs", "sm", "md", "lg", "xl"] as const satisfies readonly Size[];

/** El listado manda: cada componente estrecha `Variant` a su manera y el tipo lo comprueba aquí. */
export function ByVariant<V extends Variant>(
  list: readonly V[],
  Render: (variant: V) => ReactElement,
): PreviewGroup {
  return { title: "variant", items: list.map((v) => ({ label: v, node: Render(v) })) };
}

export function BySize<S extends Size>(
  list: readonly S[],
  Render: (size: S) => ReactElement,
): PreviewGroup {
  return { title: "size", items: list.map((s) => ({ label: s, node: Render(s) })) };
}

export function States(...items: readonly PreviewSample[]): PreviewGroup {
  return { title: "state", items };
}

export const STAR = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9 6.4 20l1.4-6.2L3 9.5l6.4-.6z" />
  </svg>
);

export const CHECK = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);
