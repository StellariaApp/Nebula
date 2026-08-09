import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { AnchorSlotProps } from "../Anchor/Anchor.types.js";

export interface SpoilerProps extends StyleProps {
  /**
   * The clipped block. Its `max-height` is written AFTER the slot while it is closed, because that is
   * what does the clipping; everything else can be adjusted.
   */
  contentProps?: BoxSlotProps | undefined;
  /** The link that opens and closes. Only rendered when the content overflows `maxHeight`. */
  toggleProps?: AnchorSlotProps | undefined;
  children: ReactNode;
  maxHeight?: number | undefined;
  showLabel?: ReactNode | undefined;
  hideLabel?: ReactNode | undefined;
  expanded?: boolean | undefined;
  defaultExpanded?: boolean | undefined;
  onExpandedChange?: ((expanded: boolean) => void) | undefined;
  className?: string | undefined;
}
