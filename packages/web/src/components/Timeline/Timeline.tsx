import type { ReactElement } from "react";

import { IsSemanticScale } from "@stellaria/nebula-themes/web";

import * as styles from "./Timeline.css.js";
import type { TimelineProps } from "./Timeline.types.js";
import { TimelineBody } from "./components/Body.js";
import { TimelineFlat } from "./components/Flat.js";

export function Timeline(props: TimelineProps): ReactElement {
  const { variant = "filled", color = "primary", ...rest } = props;

  if (!IsSemanticScale(color)) return <TimelineFlat {...props} />;

  return <TimelineBody {...rest} tone={styles.tone[`${variant}-${color}`]} />;
}

Timeline.displayName = "Timeline";
