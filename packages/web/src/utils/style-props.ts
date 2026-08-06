import type { CSSProperties } from "react";

import {
  FONT_LEADING,
  RESPONSIVE_PROPS,
  ROLE_COLORS,
  sprinkles,
  TOKEN_VALUES,
  type Sprinkles,
} from "../components/Box/Box.css.js";
import {
  BREAKPOINT_ORDER,
  OPEN_CLASS,
} from "../components/Box/Box.open.css.js";
import { OpenVarName, STYLE_PROPS, type PropSpec } from "./style-registry.js";

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

const KIND_SPRINKLE = 1;
const KIND_COLOR = 2;
const KIND_DIMENSION = 3;
const KIND_UNITLESS = 4;

type PropKind =
  | typeof KIND_SPRINKLE
  | typeof KIND_COLOR
  | typeof KIND_DIMENSION
  | typeof KIND_UNITLESS;

const PROP_KIND = new Map<string, PropKind>();
for (const key of sprinkles.properties) PROP_KIND.set(key, KIND_SPRINKLE);
for (const key of Object.keys(COLOR_PROPS)) PROP_KIND.set(key, KIND_COLOR);
for (const key of Object.keys(DIMENSION_PROPS)) PROP_KIND.set(key, KIND_DIMENSION);
for (const key of Object.keys(UNITLESS_PROPS)) PROP_KIND.set(key, KIND_UNITLESS);

const LEADING = new Set(Object.keys(FONT_LEADING));

const CLASS_CACHE = new Map<string, string>();
const CACHE_LIMIT = 4096;

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

function ResolveUnitless(key: UnitlessProp, value: unknown): unknown {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (key === "basis" && typeof value === "number") return ToCssLength(value);
  return value;
}

function CacheToken(key: string, value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `${key}:${String(text.length)}:${text};`;
}

function CollectSprinkles(props: Record<string, unknown>): Record<string, unknown> {
  const collected: Record<string, unknown> = {};

  for (const key in props) {
    const value = props[key];
    if (value === undefined) continue;

    const kind = PROP_KIND.get(key);
    if (kind === KIND_SPRINKLE) {
      collected[key] = value;
      continue;
    }
    if (kind === KIND_COLOR && ResolveOpacity(value) === undefined) collected[key] = value;
  }

  const fz = collected.fz;
  if (typeof fz === "string" && LEADING.has(fz)) collected.lh ??= fz;

  return collected;
}

function CachedClass(props: Record<string, unknown>, cache_key: string): string {
  const hit = CLASS_CACHE.get(cache_key);
  if (hit !== undefined) return hit;

  const value = sprinkles(CollectSprinkles(props));
  if (CLASS_CACHE.size < CACHE_LIMIT) CLASS_CACHE.set(cache_key, value);
  return value;
}


const BREAKPOINTS = new Set<string>(BREAKPOINT_ORDER);
const RESPONSIVE_KEYS = new Set<string>(RESPONSIVE_PROPS);

function IsResponsive(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  for (const key in value) if (!BREAKPOINTS.has(key)) return false;
  return true;
}

function TokenValue(spec: PropSpec, value: unknown): string | undefined {
  if (spec.token === undefined || typeof value !== "string") return undefined;
  const table: Record<string, string> = TOKEN_VALUES[spec.token];
  return table[value];
}

function IsKnown(spec: PropSpec, value: unknown): boolean {
  if (spec.keywords !== undefined) return spec.keywords.includes(value as string);
  return TokenValue(spec, value) !== undefined;
}

function OpenValue(spec: PropSpec, value: unknown): string | undefined {
  const token = TokenValue(spec, value);
  if (token !== undefined) return token;
  const mixed = ResolveOpacity(value);
  if (mixed !== undefined) return mixed;
  if (typeof value === "number") return spec.length === true ? `${String(value)}px` : String(value);
  if (typeof value === "string") return value;
  return undefined;
}

function NeedsOpenLane(name: string, spec: PropSpec, value: unknown): boolean {
  if (IsResponsive(value)) {
    if (!RESPONSIVE_KEYS.has(name)) return true;
    for (const level in value) if (!IsKnown(spec, value[level])) return true;
    return false;
  }
  if (!PROP_KIND.has(name)) return true;
  if (spec.keywords !== undefined) return false;
  if (spec.token === undefined) return false;
  return !IsKnown(spec, value) && ResolveOpacity(value) === undefined;
}

function CollectRest(props: Record<string, unknown>): Record<string, unknown> {
  const rest: Record<string, unknown> = {};

  for (const key in props) {
    if (key === "style") continue;
    const value = props[key];
    if (value === undefined) continue;
    if (PROP_KIND.has(key) || key in STYLE_PROPS) continue;
    rest[key] = value;
  }

  return rest;
}

export function ExtractStyleProps(props: Record<string, unknown>): ExtractedStyleProps {
  const own_style = props.style as CSSProperties | undefined;
  let style: CSSProperties | undefined;
  let cache_key = "";
  let has_sprinkles = false;
  let has_style_prop = false;
  let open_classes: string | undefined;

  for (const key in props) {
    const value = props[key];
    if (value === undefined) continue;

    const spec: PropSpec | undefined = STYLE_PROPS[key as keyof typeof STYLE_PROPS];
    const kind = PROP_KIND.get(key);
    if (kind === undefined && spec === undefined) continue;
    has_style_prop = true;

    if (spec !== undefined && NeedsOpenLane(key, spec, value)) {
      const open_class = OPEN_CLASS[key];
      if (open_class === undefined) continue;

      const levels: Record<string, unknown> = IsResponsive(value) ? value : { base: value };
      let wrote = false;
      for (const level in levels) {
        const resolved = OpenValue(spec, levels[level]);
        if (resolved === undefined) continue;
        style ??= { ...own_style };
        Object.assign(style, { [OpenVarName(key, level)]: resolved });
        wrote = true;
      }
      if (wrote) open_classes = open_classes === undefined ? open_class : `${open_classes} ${open_class}`;
      continue;
    }

    if (kind === undefined) continue;

    if (kind === KIND_COLOR) {
      const mixed = ResolveOpacity(value);
      if (mixed !== undefined) {
        style ??= { ...own_style };
        Object.assign(style, { [COLOR_PROPS[key as ColorProp]]: mixed });
        continue;
      }
    }

    if (kind === KIND_SPRINKLE || kind === KIND_COLOR) {
      has_sprinkles = true;
      cache_key += CacheToken(key, value);
      continue;
    }

    if (kind === KIND_DIMENSION) {
      if (typeof value !== "number" && typeof value !== "string") continue;
      style ??= { ...own_style };
      Object.assign(style, { [DIMENSION_PROPS[key as DimensionProp]]: ToCssLength(value) });
      continue;
    }

    style ??= { ...own_style };
    Object.assign(style, {
      [UNITLESS_PROPS[key as UnitlessProp]]: ResolveUnitless(key as UnitlessProp, value),
    });
  }

  if (!has_style_prop && own_style === undefined) {
    return { className: undefined, style: undefined, rest: props };
  }

  const sprinkle_class = has_sprinkles ? CachedClass(props, cache_key) : undefined;

  return {
    className: cx(sprinkle_class, open_classes),
    style: style ?? (own_style === undefined ? undefined : { ...own_style }),
    rest: CollectRest(props),
  };
}

export function cx(...values: (string | undefined | false)[]): string | undefined {
  const parts = values.filter((v): v is string => typeof v === "string" && v.length > 0);
  return parts.length > 0 ? parts.join(" ") : undefined;
}
