"use client";

import { useState, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m, useReducedMotion } from "motion/react";

import { vars } from "@stellaria/nebula-themes/web";
import { LengthToCss } from "../../utils/token-css.js";
import { Tween } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Image.css.js";
import type { ImageProps } from "./Image.types.js";
import * as variables from "./Image.vars.css.js";

export function Image(props: ImageProps): ReactElement {
  const {
    src,
    alt,
    width = "100%",
    height = "auto",
    fit = "cover",
    fallback,
    placeholder,
    loading = "lazy",
    className,
    stateProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const fade_in = Tween("base", "decelerate", { theme, reduced: prefers_reduced === true });

  const [status, set_status] = useState<"idle" | "loaded" | "failed">("idle");
  const missing = src === undefined || src === "";
  const broken = missing || status === "failed";

  const css_vars = assignInlineVars({
    [variables.width]: LengthToCss(width),
    [variables.height]: LengthToCss(height),
    [variables.radius]: vars.radius.md,
  });

  return (
    <span
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-status={status}
    >
      {broken ? (
        <Box component="span" {...stateProps} className={cx(styles.state, stateProps?.className)}>
          {fallback ?? alt}
        </Box>
      ) : (
        <>
          {status === "idle" && placeholder !== undefined ? (
            <Box
              component="span"
              {...stateProps}
              className={cx(styles.state, stateProps?.className)}
            >
              {placeholder}
            </Box>
          ) : null}
          <m.img
            className={styles.img}
            src={src}
            alt={alt}
            loading={loading}
            style={{ objectFit: fit }}
            initial={{ opacity: 0 }}
            animate={{ opacity: status === "loaded" ? 1 : 0 }}
            transition={fade_in}
            onLoad={() => {
              set_status("loaded");
            }}
            onError={() => {
              set_status("failed");
            }}
          />
        </>
      )}
    </span>
  );
}

Image.displayName = "Image";
