"use client";

import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import {
  ResolveGradient,
  ResolveGradientEdge,
  ResolveGradientTip,
} from "../../theme/resolve-variant.js";
import { WithAlpha } from "../../utils/effects.js";
import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./GradientBorder.css.js";
import type {
  GradientBorderEdge,
  GradientBorderOwnProps,
  GradientBorderProps,
} from "./GradientBorder.types.js";
import {
  beamArc,
  beamCycle,
  beamDelay,
  beamGate,
  beamGlow,
  beamSlot,
  beamSweep,
  fallbackBorder,
  gradientImage,
  innerBg,
  ringWidth,
} from "./GradientBorder.vars.css.js";

const ALL_EDGES: readonly GradientBorderEdge[] = [1, 2, 3, 4];
const SLOT_BEATS = 3.25;
const ARC_SPAN = 90;
const ARC_RISE = 32;
const ARC_FALL = 58;

function BeamArc(from: string, to: string): string {
  return [
    `conic-gradient(from ${String(-ARC_SPAN / 2)}deg`,
    "transparent 0deg",
    `${from} ${String(ARC_RISE)}deg`,
    `${to} ${String(ARC_FALL)}deg`,
    `transparent ${String(ARC_SPAN)}deg)`,
  ].join(", ");
}

const GradientBorderComponent = forwardRef<HTMLElement, GradientBorderOwnProps>(
  function GradientBorder(props, ref) {
    const {
      component,
      gradient = "brand",
      width = 1,
      radius = "lg",
      surface = "none",
      beam = false,
      edges = ALL_EDGES,
      sequence = "continuous",
      className,
      style,
      children,
      ...rest
    } = props as GradientBorderOwnProps & { style?: CSSProperties };

    const { theme } = useTheme();

    const lit = ALL_EDGES.filter((edge) => edges.includes(edge));
    const animated = beam && lit.length > 0 && theme.motion.tier !== "minimal";
    const share = (sequence === "spaced" ? ALL_EDGES.length : lit.length) as GradientBorderEdge;
    const edge_color = ResolveGradientEdge(gradient, theme);
    const tip_color = ResolveGradientTip(gradient, theme);

    const ring = animated ? vars.color.border.default : ResolveGradient(gradient, theme);

    const css_vars = assignInlineVars({
      [gradientImage]: ring,
      [ringWidth]: LengthToCss(width),
      [innerBg]: surface === "none" ? "transparent" : vars.color.surface[surface],
      [fallbackBorder]: animated ? vars.color.border.default : edge_color,
      [beamArc]: BeamArc(edge_color, tip_color),
      [beamGlow]: WithAlpha(tip_color, 20),
      [beamSlot]: `calc(${vars.motion.duration.expressive} * ${String(SLOT_BEATS)})`,
      [beamCycle]: `calc(${vars.motion.duration.expressive} * ${String(SLOT_BEATS * share)})`,
    });

    const named_radius = typeof radius === "string" ? radius : "lg";
    const inline_radius: CSSProperties =
      typeof radius === "number" ? { borderRadius: LengthToCss(radius) } : {};

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.gradientBorder({ radius: named_radius }), className)}
        style={{ ...css_vars, ...inline_radius, ...style }}
        data-surface={surface}
        data-beam={animated ? sequence : undefined}
        {...rest}
      >
        {animated ? (
          <span className={styles.beam} aria-hidden="true">
            {lit.map((edge, index) => (
              <span
                key={edge}
                className={styles.arc}
                style={assignInlineVars({
                  [beamSweep]: styles.sweep[edge],
                  [beamGate]: styles.gate[share],
                  [beamDelay]: `calc(${beamSlot} * ${String(sequence === "spaced" ? edge - 1 : index)})`,
                })}
              />
            ))}
          </span>
        ) : null}
        {children}
      </Box>
    );
  },
);

interface GradientBorderComponent {
  <C extends ElementType = "div">(
    props: GradientBorderProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const GradientBorder = GradientBorderComponent as unknown as GradientBorderComponent;
GradientBorder.displayName = "GradientBorder";
