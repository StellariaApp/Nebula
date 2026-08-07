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
  /** El enlace de salto. Solo se pinta con withSkipLink. */
  skipProps?: BoxSlotProps | undefined;
  /** Capa de fondo. Solo se pinta si hay background. */
  backdropProps?: BoxSlotProps | undefined;
  /** El <main>. Su style se compone con las vars de contentWidth y spacing, no las pisa. */
  contentProps?: BoxSlotProps | undefined;
}
