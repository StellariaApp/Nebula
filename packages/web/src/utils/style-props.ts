import type { CSSProperties } from "react";

import { sprinkles, type Sprinkles } from "../components/Box/Box.css.js";

const DIMENSION_PROPS = {
  w: "width",
  h: "height",
  miw: "minWidth",
  maw: "maxWidth",
  mih: "minHeight",
  mah: "maxHeight",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
} as const satisfies Record<string, keyof CSSProperties>;

const UNITLESS_PROPS = {
  grow: "flexGrow",
  shrink: "flexShrink",
  basis: "flexBasis",
  flex: "flex",
  opacity: "opacity",
} as const satisfies Record<string, keyof CSSProperties>;

const SPRINKLE_KEYS = sprinkles.properties;

export type DimensionProp = keyof typeof DIMENSION_PROPS;
export type UnitlessProp = keyof typeof UNITLESS_PROPS;

export type StyleProps = Sprinkles & {
  [K in DimensionProp]?: number | string | undefined;
} & {
  grow?: number | boolean | undefined;
  shrink?: number | boolean | undefined;
  basis?: number | string | undefined;
  flex?: number | string | undefined;
  opacity?: number | undefined;
};

export interface ExtractedStyleProps {
  className: string | undefined;
  style: CSSProperties | undefined;
  rest: Record<string, unknown>;
}

function ToCssLength(value: number | string): string {
  return typeof value === "number" ? `${String(value)}px` : value;
}

export function ExtractStyleProps(props: Record<string, unknown>): ExtractedStyleProps {
  const sprinkle_props: Record<string, unknown> = {};
  const style: CSSProperties = {};
  const rest: Record<string, unknown> = {};
  let has_sprinkles = false;
  let has_style = false;

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;

    if (SPRINKLE_KEYS.has(key as never)) {
      sprinkle_props[key] = value;
      has_sprinkles = true;
      continue;
    }

    if (key in DIMENSION_PROPS) {
      const css_key = DIMENSION_PROPS[key as DimensionProp];
      if (typeof value === "number" || typeof value === "string") {
        Object.assign(style, { [css_key]: ToCssLength(value) });
        has_style = true;
      }
      continue;
    }

    if (key in UNITLESS_PROPS) {
      const css_key = UNITLESS_PROPS[key as UnitlessProp];
      const resolved =
        typeof value === "boolean"
          ? value
            ? 1
            : 0
          : key === "basis" && typeof value === "number"
            ? ToCssLength(value)
            : value;
      Object.assign(style, { [css_key]: resolved });
      has_style = true;
      continue;
    }

    rest[key] = value;
  }

  return {
    className: has_sprinkles ? sprinkles(sprinkle_props) : undefined,
    style: has_style ? style : undefined,
    rest,
  };
}

export function Cx(...values: (string | undefined | false)[]): string | undefined {
  const parts = values.filter((v): v is string => typeof v === "string" && v.length > 0);
  return parts.length > 0 ? parts.join(" ") : undefined;
}
