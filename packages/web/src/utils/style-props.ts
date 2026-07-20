/**
 * Collector web: separa las props tokenizadas (→ clases atómicas de sprinkles) de
 * las dimensionales de valor libre (→ style inline) y del resto (→ DOM).
 *
 * Es el equivalente web del `Collector` de `@stellaria/nebula-native`: mismo
 * contrato de props (`BaseProps`/`Keys*` de `@stellaria/nebula-tokens`), distinta
 * mecánica de aplicación. Lo consumen Box, Text y todo componente que acepte
 * style props (ADR-018).
 */
import type { CSSProperties } from "react";

import { sprinkles, type Sprinkles } from "../components/Layout/Box/Box.css.js";

/** Props de dimensión/posición: admiten valores libres, van a style inline. */
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

/** Props numéricas sin unidad. */
const UNITLESS_PROPS = {
  grow: "flexGrow",
  shrink: "flexShrink",
  basis: "flexBasis",
  flex: "flex",
  opacity: "opacity",
} as const satisfies Record<string, keyof CSSProperties>;

export type DimensionProp = keyof typeof DIMENSION_PROPS;
export type UnitlessProp = keyof typeof UNITLESS_PROPS;

/** Props de estilo aceptadas por Box y derivados. */
export type StyleProps = Sprinkles & {
  [K in DimensionProp]?: number | string | undefined;
} & {
  grow?: number | boolean | undefined;
  shrink?: number | boolean | undefined;
  basis?: number | string | undefined;
  flex?: number | string | undefined;
  opacity?: number | undefined;
};

const sprinkleKeys = sprinkles.properties;

function toCssLength(value: number | string): string {
  return typeof value === "number" ? `${String(value)}px` : value;
}

export interface ExtractedStyleProps {
  className: string | undefined;
  style: CSSProperties | undefined;
  rest: Record<string, unknown>;
}

/**
 * Reparte las props en (clases de sprinkles, style inline, props del DOM).
 * `basis` acepta número → px; `grow`/`shrink` aceptan boolean → 1/0.
 */
export function extractStyleProps(props: Record<string, unknown>): ExtractedStyleProps {
  const sprinkleProps: Record<string, unknown> = {};
  const style: CSSProperties = {};
  const rest: Record<string, unknown> = {};
  let hasSprinkles = false;
  let hasStyle = false;

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;

    if (sprinkleKeys.has(key as never)) {
      sprinkleProps[key] = value;
      hasSprinkles = true;
      continue;
    }

    if (key in DIMENSION_PROPS) {
      const cssKey = DIMENSION_PROPS[key as DimensionProp];
      if (typeof value === "number" || typeof value === "string") {
        Object.assign(style, { [cssKey]: toCssLength(value) });
        hasStyle = true;
      }
      continue;
    }

    if (key in UNITLESS_PROPS) {
      const cssKey = UNITLESS_PROPS[key as UnitlessProp];
      const resolved =
        typeof value === "boolean"
          ? value
            ? 1
            : 0
          : key === "basis" && typeof value === "number"
            ? toCssLength(value)
            : value;
      Object.assign(style, { [cssKey]: resolved });
      hasStyle = true;
      continue;
    }

    rest[key] = value;
  }

  return {
    className: hasSprinkles ? sprinkles(sprinkleProps) : undefined,
    style: hasStyle ? style : undefined,
    rest,
  };
}

/** Une className de sprinkles, del recipe y del consumidor. */
export function cx(...values: (string | undefined | false)[]): string | undefined {
  const parts = values.filter((v): v is string => typeof v === "string" && v.length > 0);
  return parts.length > 0 ? parts.join(" ") : undefined;
}
