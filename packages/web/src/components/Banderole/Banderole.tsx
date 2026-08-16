import type { ReactElement } from "react";

import { IsSemanticScale } from "../../theme/resolve-variant.js";

import * as styles from "./Banderole.css.js";
import type { BanderoleProps } from "./Banderole.types.js";
import { BanderoleBody } from "./components/Body.js";
import { BanderoleFlat } from "./components/Flat.js";

export function Banderole(props: BanderoleProps): ReactElement {
  const { variant = "filled", color = "primary", ...rest } = props;

  if (!IsSemanticScale(color)) return <BanderoleFlat {...props} />;

  return <BanderoleBody {...rest} variant={variant} tone={styles.tone[`${variant}-${color}`]} />;
}

Banderole.displayName = "Banderole";
