import { type ReactElement } from "react";

import type { ValidProps } from "./Valid.types.js";

export function Valid(props: ValidProps): ReactElement {
  const { valid = false, invalid = null, children } = props;
  return <>{valid ? children : invalid}</>;
}

Valid.displayName = "Valid";
