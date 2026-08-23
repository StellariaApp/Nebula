"use client";

import type { CSSProperties, ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import type { RadiusName } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { GradientRefsOf, ResolveGradient, ResolveGradientEdge, ResolveGradientTip, vars } from "@stellaria/nebula-themes/web";
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
import { UseBeamRun } from "../use-beam-run.js";

const ALL_EDGES: readonly GradientBorderEdge[] = [1, 2, 3, 4];

/**
 * El lado que sigue a cada uno en el recorrido. Decide qué esquinas llevan parche: las que tienen
 * encendidos sus dos lados, que son por las que la luz pasa de largo.
 */
const NEXT_EDGE = { 1: 2, 2: 3, 3: 4, 4: 1 } as const satisfies Record<
  GradientBorderEdge,
  GradientBorderEdge
>;

/**
 * Los compases de una vuelta. Son los 5.5 s de la referencia con `duration.expressive` de fábrica, y
 * no dependen de cuántos lados se enciendan: la luz siempre recorre el marco entero, así que su
 * velocidad es la misma se vea donde se vea.
 */
const TURN_BEATS = 13;

/**
 * La cola: piezas cortas escalonadas en el recorrido. El escalón va en fracción de vuelta y no en
 * píxeles porque en CSS la duración no se deriva de una longitud — la cola mide entonces
 * `parts * gap` de perímetro, que es proporcional al marco como lo era la estela.
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
 * El radio como longitud, que las franjas de la ventana necesitan para saber dónde acaba cada lado.
 * Un valor responsive no se puede resolver aquí, así que manda su peldaño `base`: la ventana queda
 * exacta en el ancho de partida y con el desfase de siempre en los demás.
 */
function BeamRadius(r: GradientBorderOwnProps["r"]): string {
  const value = typeof r === "object" && r !== null ? r.base : r;
  if (typeof value === "number") return LengthToCss(value);
  if (typeof value === "string" && value in vars.radius) return vars.radius[value as RadiusName];
  return "0px";
}

/**
 * El perfil de la luz —`transparent 0%, from 36%, to 64%, transparent 100%`— repartido **entre** las
 * piezas de la cola. `p` es la posición en la cola medida desde el final (0) hasta la cabeza (1), así
 * que las dos puntas se apagan y el color solo manda en el cuerpo.
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
    sequence,
    trail,
    className,
    style,
    children,
    ...rest
  } = props as GradientBorderOwnProps & { style?: CSSProperties };

  const { theme } = useTheme();

  const lit = ALL_EDGES.filter((edge) => edges.includes(edge));
  const animated = beam && lit.length > 0 && theme.motion.tier !== "minimal";
  const windowed = lit.length < ALL_EDGES.length;
  const window_mask = [
    ...lit.map((edge) => styles.EDGE_WINDOW[edge]),
    ...lit.filter((edge) => lit.includes(NEXT_EDGE[edge])).map((edge) => styles.CORNER_PATCH[edge]),
  ].join(", ");

  const tail = {
    parts: trail?.parts ?? TRAIL_DEFAULTS.parts,
    gap: trail?.gap ?? TRAIL_DEFAULTS.gap,
    bloom: trail?.bloom ?? TRAIL_DEFAULTS.bloom,
  };
  const parts = Math.max(MIN_PARTS, Math.round(tail.parts));
  const pieces = Array.from({ length: parts }, (_, index) => index);
  const { Track, run } = UseBeamRun(
    lit,
    tail.gap,
    parts,
    animated && windowed && sequence !== "spaced",
  );
  const grad = GradientRefsOf(gradient);
  const edge_color = grad?.edge ?? ResolveGradientEdge(gradient, theme);
  const tip_color = grad?.tip ?? ResolveGradientTip(gradient, theme);

  const ring = animated ? vars.color.border.default : (grad?.image ?? ResolveGradient(gradient, theme));

  const css_vars = assignInlineVars({
    [variables.image]: ring,
    [variables.ringWidth]: LengthToCss(width),
    [variables.innerBg]: surface === "none" ? "transparent" : vars.color.surface[surface],
    [variables.fallbackBorder]: animated ? vars.color.border.default : edge_color,
    [variables.beamRadius]: BeamRadius(r),
    [variables.beamBloom]: LengthToCss(tail.bloom),
    [variables.beamGlow]: WithAlpha(tip_color, 20),
    [variables.beamFrom]: run?.from ?? "0%",
    [variables.beamTo]: run?.to ?? "100%",
    [variables.beamCycle]: `calc(${vars.motion.duration.expressive} * ${String(
      Math.round(TURN_BEATS * (run?.beats ?? 1) * 1000) / 1000,
    )})`,
  });

  return (
    <Box
      component={component ?? "div"}
      r={r}
      className={cx(styles.gradient_base, styles.gradient_border(), className)}
      style={{ ...css_vars, ...style }}
      data-surface={surface}
      data-beam={animated ? String(lit.length) : undefined}
      {...rest}
    >
      {animated ? (
        <span className={styles.beam} ref={Track} aria-hidden="true">
          <span
            className={styles.edge_window}
            style={windowed ? assignInlineVars({ [variables.beamWindow]: window_mask }) : undefined}
          >
            {pieces.map((part) => {
              const stop = TrailStop(1 - (part + 0.5) / parts);
              return (
                <span
                  key={part}
                  className={styles.trail}
                  style={assignInlineVars({
                    [variables.beamCore]: TrailTint(edge_color, tip_color, stop.ratio),
                    [variables.beamFade]: String(stop.alpha),
                    [variables.beamDelay]: `calc(${variables.beamCycle} * ${String(
                      Math.round((part * (run?.gap ?? tail.gap) - 1) * 10000) / 10000,
                    )})`,
                  })}
                />
              );
            })}
          </span>
        </span>
      ) : null}
      {children}
    </Box>
  );
}

GradientBorderSurface.displayName = "GradientBorder.Surface";
