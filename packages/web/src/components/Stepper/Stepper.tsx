import type { ReactElement } from "react";

import { IsSemanticScale } from "../../theme/resolve-variant.js";

import * as styles from "./Stepper.css.js";
import type { StepperProps } from "./Stepper.types.js";
import { StepperBody } from "./components/Body.js";
import { StepperFlat } from "./components/Flat.js";

export function Stepper(props: StepperProps): ReactElement {
  const { variant = "filled", color = "primary", ...rest } = props;

  if (!IsSemanticScale(color)) return <StepperFlat {...props} />;

  return <StepperBody {...rest} tone={styles.tone[`${variant}-${color}`]} />;
}

Stepper.displayName = "Stepper";
