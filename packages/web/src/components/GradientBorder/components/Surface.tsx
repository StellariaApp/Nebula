"use client";

import { useCallback, type CSSProperties, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import type { RadiusName } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { GradientRefsOf, ResolveGradient, ResolveGradientEdge, ResolveGradientTip, vars } from "@stellaria/nebula-themes/web";
import { cx } from "../../../utils/style-props.js";
import { LengthToCss } from "../../../utils/token-css.js";
import { useOnScreen } from "../../../utils/visibility.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../GradientBorder.css.js";
import type {
  GradientBorderEdge,
  GradientBorderOwnProps,
  GradientBorderTrail,
} from "../GradientBorder.types.js";
import * as variables from "../GradientBorder.vars.css.js";
import { UseSweepRun } from "../use-sweep-run.js";

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

const TRAIL_DEFAULTS = {
  parts: 32,
  gap: 0.00385,
  bloom: 0.5,
} as const satisfies Required<GradientBorderTrail>;

const MIN_PARTS = 2;
const FULL_TURN = 360;
const ARC_RISE = 0.45;
const TIP_FADE = 0.6;

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

function Wedges(count: number, head: number, edge: string, tip: string): string {
  const stops = [
    "transparent 0deg",
    `transparent ${String(Math.round((FULL_TURN - head) * 100) / 100)}deg`,
    `${edge} ${String(Math.round((FULL_TURN - head * ARC_RISE) * 100) / 100)}deg`,
    `${tip} ${String(FULL_TURN - TIP_FADE)}deg`,
    "transparent 360deg",
  ].join(", ");

  return Array.from(
    { length: count },
    (_, index) =>
      `conic-gradient(from ${String(Math.round(((index * FULL_TURN) / count) * 100) / 100)}deg, ${stops})`,
  ).join(", ");
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
  const head = Math.min(FULL_TURN, Math.max(1, parts * tail.gap * FULL_TURN));

  const { Track, plan } = UseSweepRun(lit, head, sequence !== "spaced", animated);
  const { Track: WatchScreen, onscreen } = useOnScreen(animated);
  const Attach = useCallback(
    (element: HTMLElement | null) => {
      Track(element);
      WatchScreen(element);
    },
    [Track, WatchScreen],
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
    [variables.beamCycle]: `calc(${vars.motion.duration.expressive} * ${String(TURN_BEATS)})`,
    [variables.beamEasing]: plan?.easing ?? "linear",
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
        <span
          className={styles.beam}
          ref={Attach}
          data-onscreen={onscreen ? undefined : "false"}
          aria-hidden="true"
        >
          <span
            className={styles.edge_window}
            style={windowed ? assignInlineVars({ [variables.beamWindow]: window_mask }) : undefined}
          >
            <span
              className={styles.sweep}
              style={{ backgroundImage: Wedges(plan?.wedges ?? 1, head, edge_color, tip_color) }}
            />
          </span>
        </span>
      ) : null}
      {children}
    </Box>
  );
}

GradientBorderSurface.displayName = "GradientBorder.Surface";
