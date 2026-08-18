import type { ReactElement } from "react";

import { IsSemanticScale } from "@stellaria/nebula-themes/web";

import * as styles from "./Alert.css.js";
import type { AlertProps } from "./Alert.types.js";
import { AlertBody } from "./components/Body.js";
import { AlertFlat } from "./components/Flat.js";

export function Alert(props: AlertProps): ReactElement {
  const { variant = "light", color = "info" } = props;

  if (!IsSemanticScale(color)) return <AlertFlat {...props} />;

  return <AlertBody {...props} tone={styles.tone[`${variant}-${color}`]} />;
}

Alert.displayName = "Alert";
