import type { ReactElement } from "react";

import { IsSemanticScale } from "@stellaria/nebula-themes/web";

import * as styles from "./Progress.css.js";
import type { ProgressProps } from "./Progress.types.js";
import { ProgressBody } from "./components/Body.js";
import { ProgressFlat } from "./components/Flat.js";

export function Progress(props: ProgressProps): ReactElement {
  const { variant, color = "primary" } = props;

  if (variant === undefined) return <ProgressBody {...props} />;
  if (!IsSemanticScale(color)) return <ProgressFlat {...props} />;

  return <ProgressBody {...props} tone={styles.tone[`${variant}-${color}`]} />;
}

Progress.displayName = "Progress";
