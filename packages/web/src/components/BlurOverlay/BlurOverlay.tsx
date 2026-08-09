"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./BlurOverlay.css.js";
import * as variables from "./BlurOverlay.vars.css.js";
import type { BlurOverlayProps } from "./BlurOverlay.types.js";

const SOLID_ALPHA = 0.94;

export function BlurOverlay(props: BlurOverlayProps): ReactElement {
  const {
    blur = "md",
    color = "surface.base",
    opacity = 0.35,
    r = 0,
    fixed = false,
    center = false,
    zIndex,
    children,
    className,
    contentProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps({ r, ...style_rest });

  const { theme } = useTheme();
  const enabled = theme.effects.glass.enabled && blur !== "none";

  const css_vars = assignInlineVars({
    [variables.tint]: ResolveAccent(color, "600"),
    [variables.alpha]: String(enabled ? opacity : Math.max(opacity, SOLID_ALPHA)),
    [variables.backdrop]: enabled ? `blur(${vars.blur[blur]})` : "none",
  });

  const has_content = children !== undefined && children !== null;

  return (
    <div
      className={cx(styles.blur_overlay, sprinkle_class, className)}
      style={{
        ...css_vars,
        ...(zIndex === undefined ? {} : { zIndex }),
        ...sprinkle_style,
      }}
      data-fixed={fixed ? "true" : undefined}
      data-center={center || has_content ? "true" : undefined}
      data-blur={enabled ? blur : "off"}
      aria-hidden={has_content ? undefined : true}
      {...rest}
    >
      <span className={styles.veil} aria-hidden="true" />
      {has_content ? (
        <Box {...contentProps} className={cx(styles.content, contentProps?.className)}>
          {children}
        </Box>
      ) : null}
    </div>
  );
}

BlurOverlay.displayName = "BlurOverlay";
