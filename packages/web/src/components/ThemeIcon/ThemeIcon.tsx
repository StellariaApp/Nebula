import type { ReactElement } from "react";

import { IsSemanticScale } from "../../theme/resolve-variant.js";

import * as styles from "./ThemeIcon.css.js";
import type { ThemeIconProps } from "./ThemeIcon.types.js";
import { ThemeIconBody } from "./components/Body.js";
import { ThemeIconFlat } from "./components/Flat.js";

export function ThemeIcon(props: ThemeIconProps): ReactElement {
  const { variant = "light", color = "primary", ...rest } = props;

  if (!IsSemanticScale(color)) return <ThemeIconFlat {...props} />;

  return <ThemeIconBody {...rest} variant={variant} tone={styles.tone[`${variant}-${color}`]} />;
}

ThemeIcon.displayName = "ThemeIcon";
