"use client";

import type { CSSProperties, ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";
import { cx } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../Paper.css.js";
import type { PaperOwnProps } from "../Paper.types.js";
import * as variables from "../Paper.vars.css.js";

/**
 * La superficie, y lo único que necesita el tema en runtime.
 *
 * Recibe el contenido como `children` para que `Paper` pueda ser de servidor: lo que un componente
 * de servidor pasa como `children` a uno de cliente sigue siendo de servidor (ADR-157).
 */
export function PaperRoot(props: PaperOwnProps): ReactElement {
  const {
    component,
    shadow = "none",
    r = "lg",
    withBorder = false,
    variant,
    color = "primary",
    className,
    style,
    children,
    ...rest
  } = props as PaperOwnProps & { style?: CSSProperties };

  const { theme } = useTheme();
  const resolved =
    variant === undefined ? null : ResolveVariant(variant, color, theme, undefined, "subtle");
  const refs =
    variant === undefined ? undefined : VariantRefs(variant, color, theme, undefined, "subtle");

  const css_vars =
    resolved === null
      ? {}
      : assignInlineVars({
          [variables.bg]: refs?.background ?? resolved.background,
          [variables.fg]: refs?.foreground ?? resolved.foreground,
          [variables.borderColor]: refs?.borderColor ?? resolved.borderColor,
          [variables.backdropFilter]: refs?.backdropFilter ?? resolved.backdropFilter,
          [variables.glow]: refs?.glow ?? resolved.glow,
        });

  return (
    <Box
      component={component ?? "div"}
      r={r}
      className={cx(
        styles.paper({
          shadow,
          withBorder: withBorder || resolved?.borderWidth === "1px",
          glowing: resolved !== null && resolved.glow !== "none",
        }),
        className,
      )}
      style={{ ...css_vars, ...style }}
      data-variant={variant}
      {...rest}
    >
      {children}
    </Box>
  );
}

PaperRoot.displayName = "Paper.Root";
