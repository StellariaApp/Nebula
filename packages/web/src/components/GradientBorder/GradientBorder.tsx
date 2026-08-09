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
import * as variables from "./GradientBorder.vars.css.js";

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
      r = "lg",
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
      [variables.image]: ring,
      [variables.ringWidth]: LengthToCss(width),
      [variables.innerBg]: surface === "none" ? "transparent" : vars.color.surface[surface],
      [variables.fallbackBorder]: animated ? vars.color.border.default : edge_color,
      [variables.beamArc]: BeamArc(edge_color, tip_color),
      [variables.beamGlow]: WithAlpha(tip_color, 20),
      [variables.beamSlot]: `calc(${vars.motion.duration.expressive} * ${String(SLOT_BEATS)})`,
      [variables.beamCycle]: `calc(${vars.motion.duration.expressive} * ${String(SLOT_BEATS * share)})`,
    });

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        r={r}
        className={cx(styles.gradient_border(), className)}
        style={{ ...css_vars, ...style }}
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
