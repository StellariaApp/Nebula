import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Cutout.css.js";
import type { CutoutProps } from "./Cutout.types.js";
import * as variables from "./Cutout.vars.css.js";

export function Cutout(props: CutoutProps): ReactElement {
  const {
    background,
    figure,
    figureAlt = "",
    figureSize,
    figurePosition,
    children,
    className,
    backgroundProps,
    figureProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const placement = {
    ...(figureSize === undefined
      ? {}
      : { [variables.figureWidth]: `${String(figureSize * 100)}%` }),
    ...(figurePosition?.top === undefined
      ? {}
      : { [variables.top]: LengthToCss(figurePosition.top) }),
    ...(figurePosition?.bottom === undefined
      ? {}
      : { [variables.bottom]: LengthToCss(figurePosition.bottom) }),
    ...(figurePosition?.left === undefined
      ? {}
      : { [variables.left]: LengthToCss(figurePosition.left) }),
    ...(figurePosition?.right === undefined
      ? {}
      : { [variables.right]: LengthToCss(figurePosition.right) }),
    ...(figurePosition?.translate?.x === undefined
      ? {}
      : { [variables.translateX]: LengthToCss(figurePosition.translate.x) }),
    ...(figurePosition?.translate?.y === undefined
      ? {}
      : { [variables.translateY]: LengthToCss(figurePosition.translate.y) }),
    ...(figurePosition?.rotate?.x === undefined
      ? {}
      : { [variables.rotateX]: figurePosition.rotate.x }),
    ...(figurePosition?.rotate?.y === undefined
      ? {}
      : { [variables.rotateY]: figurePosition.rotate.y }),
    ...(figurePosition?.rotate?.z === undefined
      ? {}
      : { [variables.rotateZ]: figurePosition.rotate.z }),
  };
  const figure_vars = assignInlineVars(placement);

  return (
    <div className={cx(styles.cutout, sprinkle_class, className)} style={sprinkle_style}>
      {background === undefined || background === null ? null : (
        <Box {...backgroundProps} className={cx(styles.background, backgroundProps?.className)}>
          {background}
        </Box>
      )}
      {figure === undefined ? null : (
        <img
          alt={figureAlt}
          src={figure}
          {...figureProps}
          className={cx(styles.figure, figureProps?.className)}
          style={{ ...figure_vars, ...figureProps?.style }}
        />
      )}
      {children === undefined || children === null ? null : (
        <div className={styles.content}>{children}</div>
      )}
    </div>
  );
}

Cutout.displayName = "Cutout";
