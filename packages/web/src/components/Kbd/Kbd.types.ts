import type { ReactNode } from "react";

import type { Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface KbdProps extends StyleProps {
  /**
   * The legend on the cap. It never wraps, and it is one key per element: a chord is either a
   * single string you write out or several `Kbd` side by side — nothing here splits it for you.
   */
  children?: ReactNode | undefined;
  /**
   * The cap's own type size and height. It does not follow the text it sits in, so a `Kbd` inside
   * small print has to be stepped down by hand or it will tower over the line.
   * @default "md"
   */
  size?: Size | undefined;
  className?: string | undefined;
}
