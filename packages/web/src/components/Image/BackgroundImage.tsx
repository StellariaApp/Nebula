import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";

import { ResolveRadius } from "./Image.js";
import * as styles from "./Image.css.js";
import type { BackgroundImageProps } from "./Image.types.js";
import * as variables from "./Image.vars.css.js";

const DEFAULT_OVERLAP = 45;

export function BackgroundImage(props: BackgroundImageProps): ReactElement {
  const { src, children, radius, overlay = false, className } = props;

  const percent = overlay === false ? 0 : overlay === true ? DEFAULT_OVERLAP : overlay;

  const css_vars = assignInlineVars({
    [variables.radius]: ResolveRadius(radius),
    [variables.overlayAlpha]: `${String(percent)}%`,
  });

  return (
    <div
      className={cx(styles.background, className)}
      style={{ ...css_vars, backgroundImage: `url(${src})` }}
    >
      {percent > 0 ? <span className={styles.overlay} aria-hidden="true" /> : null}
      <div className={styles.background_content}>{children}</div>
    </div>
  );
}

BackgroundImage.displayName = "BackgroundImage";
