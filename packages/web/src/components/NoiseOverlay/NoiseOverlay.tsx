"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { grain, noiseOpacity } from "../../styles/noise.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./NoiseOverlay.css.js";
import type { NoiseOverlayProps } from "./NoiseOverlay.types.js";

export function NoiseOverlay(props: NoiseOverlayProps): ReactElement {
  const { opacity, radius = "none", fixed = false, zIndex, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const enabled = theme.effects.glass.enabled;
  const resolved = enabled ? (opacity ?? theme.effects.glass.noiseOpacity) : 0;

  const css_vars = assignInlineVars({ [noiseOpacity]: String(resolved) });

  return (
    <span
      className={cx(grain, styles.radius[radius], fixed && styles.fixed, sprinkle_class, className)}
      style={{
        ...css_vars,
        ...(zIndex === undefined ? {} : { zIndex }),
        ...sprinkle_style,
      }}
      data-noise={resolved > 0 ? "on" : "off"}
      aria-hidden="true"
      {...rest}
    />
  );
}

NoiseOverlay.displayName = "NoiseOverlay";
