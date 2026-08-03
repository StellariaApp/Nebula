import type { CSSProperties } from "react";

import { FONT_LEADING, ROLE_COLORS, sprinkles, type Sprinkles } from "../components/Box/Box.css.js";

const COLOR_PROPS = {
  color: "color",
  c: "color",
  background: "background",
  bg: "background",
  borderColor: "borderColor",
  bdc: "borderColor",
} as const satisfies Record<string, keyof CSSProperties>;

const ROLE_TONES: Record<string, string | undefined> = ROLE_COLORS;

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
const LEADING = new Set(Object.keys(FONT_LEADING));

export type DimensionProp = keyof typeof DIMENSION_PROPS;
export type UnitlessProp = keyof typeof UNITLESS_PROPS;
export type ColorProp = keyof typeof COLOR_PROPS;

type ColorLiteral = "transparent" | "currentColor" | "inherit";

type RoleOpacity = `${Exclude<NonNullable<Sprinkles["borderColor"]>, ColorLiteral>}.${number}`;

type PaletteValue = NonNullable<Sprinkles["color"]> | RoleOpacity;
type RoleValue = NonNullable<Sprinkles["borderColor"]> | RoleOpacity;

export type StyleProps = Omit<Sprinkles, ColorProp> & {
  color?: PaletteValue | undefined;
  c?: PaletteValue | undefined;
  background?: PaletteValue | undefined;
  bg?: PaletteValue | undefined;
  borderColor?: RoleValue | undefined;
  bdc?: RoleValue | undefined;
} & {
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

function ResolveOpacity(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const cut = value.lastIndexOf(".");
  if (cut <= 0 || cut === value.length - 1) return undefined;

  const percent = Number(value.slice(cut + 1));
  if (!Number.isFinite(percent)) return undefined;

  const tone = ROLE_TONES[value.slice(0, cut)];
  return tone === undefined
    ? undefined
    : `color-mix(in srgb, ${tone} ${String(percent)}%, transparent)`;
}

export function ExtractStyleProps(props: Record<string, unknown>): ExtractedStyleProps {
  const sprinkle_props: Record<string, unknown> = {};
  const own_style = props.style as CSSProperties | undefined;
  const style: CSSProperties = { ...own_style };
  const rest: Record<string, unknown> = {};
  let has_sprinkles = false;
  let has_style = own_style !== undefined;

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;
    if (key === "style") continue;

    if (key in COLOR_PROPS) {
      const mixed = ResolveOpacity(value);
      if (mixed !== undefined) {
        Object.assign(style, { [COLOR_PROPS[key as ColorProp]]: mixed });
        has_style = true;
        continue;
      }
    }

    if (SPRINKLE_KEYS.has(key as never)) {
      sprinkle_props[key] = value;
      has_sprinkles = true;
      if (key === "fz" && typeof value === "string" && LEADING.has(value)) sprinkle_props.lh ??= value;
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

export function cx(...values: (string | undefined | false)[]): string | undefined {
  const parts = values.filter((v): v is string => typeof v === "string" && v.length > 0);
  return parts.length > 0 ? parts.join(" ") : undefined;
}
