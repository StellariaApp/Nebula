import { type ReactElement } from "react";

import type { ConditionalProps } from "./Conditional.types.js";

export function Conditional(props: ConditionalProps): ReactElement {
  const { when = false, fallback = null, children } = props;
  return <>{when ? children : fallback}</>;
}

Conditional.displayName = "Conditional";
