import type { ReactNode } from "react";

import type { SpacingValue, Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface MainProps extends Omit<StyleProps, "color" | "background"> {
  children?: ReactNode | undefined;
  header?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  background?: ReactNode | undefined;
  centered?: boolean | undefined;
  padded?: boolean | undefined;
  contentWidth?: Unit | undefined;
  spacing?: SpacingValue | undefined;
  skipLabel?: string | undefined;
  withSkipLink?: boolean | undefined;
  id?: string | undefined;
  className?: string | undefined;
}
