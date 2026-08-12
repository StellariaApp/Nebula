import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Image.css.js";
import type { BackgroundImageProps } from "./Image.types.js";
import * as variables from "./Image.vars.css.js";

const DEFAULT_OVERLAP = 45;

export function BackgroundImage(props: BackgroundImageProps): ReactElement {
  const {
    src,
    children,
    overlay = false,
    className,
    overlayProps,
    contentProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const percent = overlay === false ? 0 : overlay === true ? DEFAULT_OVERLAP : overlay;

  const css_vars = assignInlineVars({
    [variables.radius]: vars.radius.md,
    [variables.overlayAlpha]: `${String(percent)}%`,
  });

  return (
    <div
      className={cx(styles.background, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style, backgroundImage: `url(${src})` }}
      {...rest}
    >
      {percent > 0 ? (
        <Box
          component="span"
          aria-hidden="true"
          {...overlayProps}
          className={cx(styles.overlay, overlayProps?.className)}
        />
      ) : null}
      <Box {...contentProps} className={cx(styles.background_content, contentProps?.className)}>
        {children}
      </Box>
    </div>
  );
}

BackgroundImage.displayName = "BackgroundImage";
