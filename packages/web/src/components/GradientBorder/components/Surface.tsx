"use client";

import type { CSSProperties, ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import type { RadiusName } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../../theme/contract.css.js";
import {
  ResolveGradient,
  ResolveGradientEdge,
  ResolveGradientTip,
} from "../../../theme/resolve-variant.js";
import { WithAlpha } from "../../../utils/effects.js";
import { cx } from "../../../utils/style-props.js";
import { LengthToCss } from "../../../utils/token-css.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../GradientBorder.css.js";
import type {
  GradientBorderEdge,
  GradientBorderOwnProps,
  GradientBorderTrail,
} from "../GradientBorder.types.js";
import * as variables from "../GradientBorder.vars.css.js";

const ALL_EDGES: readonly GradientBorderEdge[] = [1, 2, 3, 4];
const SLOT_BEATS = 3.25;

/**
 * La cola: piezas cortas escalonadas en el recorrido. El escalón va en fracción de vuelta y no en
 * píxeles porque en CSS la duración no se deriva de una longitud — la cola mide entonces
 * `parts * gap` de perímetro, que es proporcional al marco como lo era la estela.
 *
 * El desenfoque va en el contenedor y no en cada pieza: `filter` se aplica antes que `mask`, así que
 * funde las piezas entre sí y la máscara recorta después. Es bajo a propósito —hay animación en la
 * misma capa y `effects-guardrails` prohíbe encadenar blur alto con movimiento—.
 */
const TRAIL_DEFAULTS = {
  parts: 32,
  gap: 0.00385,
  bloom: 0.5,
} as const satisfies Required<GradientBorderTrail>;

const MIN_PARTS = 2;
const ARC_RISE = 36;
const ARC_FALL = 64;

/**
 * El radio como longitud, que los tramos necesitan para descontar las esquinas. Un valor responsive
 * no se puede resolver aquí, así que manda su peldaño `base`: el recorrido queda exacto en el ancho
 * de partida y con el desfase de siempre en los demás.
 */
function BeamRadius(r: GradientBorderOwnProps["r"]): string {
  const value = typeof r === "object" && r !== null ? r.base : r;
  if (typeof value === "number") return LengthToCss(value);
  if (typeof value === "string" && value in vars.radius) return vars.radius[value as RadiusName];
  return "0px";
}

/**
 * El mismo perfil que tenía la estela dentro de sí —`transparent 0%, from 36%, to 64%, transparent
 * 100%`— repartido **entre** las piezas de la cola. `p` es la posición en la cola medida desde el
 * final (0) hasta la cabeza (1), así que las dos puntas se apagan y el color solo manda en el cuerpo.
 */
function TrailStop(p: number): { alpha: number; ratio: number } {
  const rise = ARC_RISE / 100;
  const fall = ARC_FALL / 100;
  const alpha = p <= rise ? p / rise : p >= fall ? (1 - p) / (1 - fall) : 1;
  const ratio = Math.min(1, Math.max(0, (p - rise) / (fall - rise)));
  return { alpha: Math.round(alpha * 100) / 100, ratio };
}

function TrailTint(from: string, to: string, ratio: number): string {
  return `color-mix(in srgb, ${to} ${String(Math.round(ratio * 100))}%, ${from})`;
}

function BeamArc(from: string, to: string): string {
  return [
    "linear-gradient(90deg",
    "transparent 0%",
    `${from} ${String(ARC_RISE)}%`,
    `${to} ${String(ARC_FALL)}%`,
    "transparent 100%)",
  ].join(", ");
}

/**
 * El marco y su haz, y lo único que necesita el tema en runtime.
 *
 * Recibe el contenido como `children` para que `GradientBorder` pueda ser de servidor: lo que un
 * componente de servidor pasa como `children` a uno de cliente sigue siendo de servidor (ADR-157).
 */
export function GradientBorderSurface(props: GradientBorderOwnProps): ReactElement {
  const {
    component,
    gradient = "brand",
    width = 2,
    r = "lg",
    surface = "none",
    beam = false,
    edges = ALL_EDGES,
    sequence = "continuous",
    trail,
    className,
    style,
    children,
    ...rest
  } = props as GradientBorderOwnProps & { style?: CSSProperties };

  const { theme } = useTheme();

  const lit = ALL_EDGES.filter((edge) => edges.includes(edge));
  const animated = beam && lit.length > 0 && theme.motion.tier !== "minimal";
  const seamless = sequence === "continuous" && lit.length === ALL_EDGES.length;

  const tail = {
    parts: trail?.parts ?? TRAIL_DEFAULTS.parts,
    gap: trail?.gap ?? TRAIL_DEFAULTS.gap,
    bloom: trail?.bloom ?? TRAIL_DEFAULTS.bloom,
  };
  const parts = Math.max(MIN_PARTS, Math.round(tail.parts));
  const pieces = Array.from({ length: parts }, (_, index) => index);
  const share = (sequence === "spaced" ? ALL_EDGES.length : lit.length) as GradientBorderEdge;
  const edge_color = ResolveGradientEdge(gradient, theme);
  const tip_color = ResolveGradientTip(gradient, theme);

  const ring = animated ? vars.color.border.default : ResolveGradient(gradient, theme);

  const css_vars = assignInlineVars({
    [variables.image]: ring,
    [variables.ringWidth]: LengthToCss(width),
    [variables.innerBg]: surface === "none" ? "transparent" : vars.color.surface[surface],
    [variables.fallbackBorder]: animated ? vars.color.border.default : edge_color,
    [variables.beamRadius]: BeamRadius(r),
    [variables.beamArc]: BeamArc(edge_color, tip_color),
    [variables.beamBloom]: seamless ? LengthToCss(tail.bloom) : "0px",
    [variables.beamGlow]: WithAlpha(tip_color, 20),
    [variables.beamSlot]: `calc(${vars.motion.duration.expressive} * ${String(SLOT_BEATS)})`,
    [variables.beamCycle]: `calc(${vars.motion.duration.expressive} * ${String(SLOT_BEATS * share)})`,
  });

  return (
    <Box
      component={component ?? "div"}
      r={r}
      className={cx(styles.gradient_base, styles.gradient_border(), className)}
      style={{ ...css_vars, ...style }}
      data-surface={surface}
      data-beam={animated ? sequence : undefined}
      {...rest}
    >
      {animated ? (
        <span className={styles.beam} aria-hidden="true">
          {seamless
            ? pieces.map((part) => {
                const stop = TrailStop(1 - (part + 0.5) / parts);
                return (
                  <span
                    key={part}
                    className={styles.trail}
                    style={assignInlineVars({
                      [variables.beamCore]: TrailTint(edge_color, tip_color, stop.ratio),
                      [variables.beamFade]: String(stop.alpha),
                      [variables.beamDelay]: `calc(${variables.beamCycle} * ${String(
                        Math.round((part * tail.gap - 1) * 10000) / 10000,
                      )})`,
                    })}
                  />
                );
              })
            : lit.map((edge, index) => (
                <span
                  key={edge}
                  className={styles.arc}
                  style={assignInlineVars({
                    [variables.beamSweep]: styles.sweep[edge],
                    [variables.beamGate]: styles.gate[share],
                    [variables.beamDelay]: `calc(${variables.beamSlot} * ${String(sequence === "spaced" ? edge - 1 : index)})`,
                  })}
                />
              ))}
        </span>
      ) : null}
      {children}
    </Box>
  );
}

GradientBorderSurface.displayName = "GradientBorder.Surface";
