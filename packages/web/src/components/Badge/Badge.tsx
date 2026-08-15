import type { ReactElement } from "react";

import { IsSemanticScale } from "../../theme/resolve-variant.js";

import * as styles from "./Badge.css.js";
import type { BadgeProps } from "./Badge.types.js";
import { BadgeBody } from "./components/Body.js";
import { BadgeFlat } from "./components/Flat.js";

export function Badge(props: BadgeProps): ReactElement {
  const { variant = "light", color = "primary" } = props;

  if (!IsSemanticScale(color)) return <BadgeFlat {...props} />;

  return <BadgeBody {...props} tone={styles.tone[`${variant}-${color}`]} />;
}

Badge.displayName = "Badge";
