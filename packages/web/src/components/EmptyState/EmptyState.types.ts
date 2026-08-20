import type { ReactNode } from "react";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { UseRevealOptions } from "../Reveal/use-reveal.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface EmptyStateProps extends StyleProps {
  title: ReactNode;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
  /**
   * Animates it in when it first scrolls into view. `true` takes the catalogue entrance; an object
   * tunes it — `index` staggers a list.
   *
   * It is declared here and forwarded to the root `Box` rather than inherited: `reveal` lives on
   * `BoxOwnProps`, and most of the catalogue types its props over `StyleProps`, so nothing arrives
   * on its own.
   */
  reveal?: boolean | UseRevealOptions | undefined;
  /** The title. The only node always rendered, because `title` is required. */
  titleProps?: TextSlotProps | undefined;
  /** The description. Only rendered with `description`. */
  descriptionProps?: TextSlotProps | undefined;
  /** The glyph. Only rendered with `icon`, and it is `aria-hidden`. */
  iconProps?: BoxSlotProps | undefined;
  /** The action row. Only rendered with `actions`. */
  actionsProps?: BoxSlotProps | undefined;
}
