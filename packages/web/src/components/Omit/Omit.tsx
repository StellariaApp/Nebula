import { type ReactElement } from "react";

import type { OmitProps } from "./Omit.types.js";

export function Omit(props: OmitProps): ReactElement | null {
  const { omit = false, children } = props;
  if (omit) return null;
  return <>{children}</>;
}

Omit.displayName = "Omit";
