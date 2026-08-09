import type { ReactNode } from "react";

import type { SpacingValue, SpringName, Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface MainProps extends StyleProps {
  children?: ReactNode | undefined;
  header?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  background?: ReactNode | undefined;
  centered?: boolean | undefined;
  padded?: boolean | undefined;
  contentWidth?: Unit | undefined;
  spacing?: SpacingValue | undefined;
  momentum?: boolean | undefined;
  bounce?: boolean | undefined;
  smooth?: boolean | undefined;
  spring?: SpringName | undefined;
  multiplier?: number | undefined;
  skipLabel?: string | undefined;
  withSkipLink?: boolean | undefined;
  id?: string | undefined;
  className?: string | undefined;
  /** The skip link. Only rendered with `withSkipLink`. */
  skipProps?: BoxSlotProps | undefined;
  /** The background layer. Only rendered with a `background`. */
  backdropProps?: BoxSlotProps | undefined;
  /** The `<main>`. Its style composes with the `contentWidth` and `spacing` vars, it does not override them. */
  contentProps?: BoxSlotProps | undefined;
}
