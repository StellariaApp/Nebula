import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { UseRevealOptions } from "../Reveal/use-reveal.js";

export type AlertVariant = Extract<Variant, "filled" | "outline" | "light" | "glass">;

export interface AlertProps extends StyleProps {
  children?: ReactNode | undefined;
  title?: ReactNode | undefined;
  color?: ColorExtended | undefined;
  variant?: AlertVariant | undefined;
  icon?: ReactNode | undefined;
  withCloseButton?: boolean | undefined;
  onClose?: (() => void) | undefined;
  closeLabel?: string | undefined;
  live?: "status" | "alert" | "off" | undefined;
  actions?: ReactNode | undefined;
  className?: string | undefined;
  /**
   * Animates the alert in when it first scrolls into view. `true` takes the catalogue entrance; an
   * object tunes it.
   */
  reveal?: boolean | UseRevealOptions | undefined;
  /** The title. Its `id` is what names the alert through `aria-labelledby`, and it is written AFTER the slot. Only rendered with `title`. */
  titleProps?: TextSlotProps | undefined;
  /** The glyph. Only rendered with `icon`, and it is `aria-hidden`: the text is what informs. */
  iconProps?: BoxSlotProps | undefined;
  /** The column that groups title, message and actions. Always rendered. */
  bodyProps?: BoxSlotProps | undefined;
  /** The message, which is `children`. It does not exist without them. */
  messageProps?: BoxSlotProps | undefined;
  /** The action row. Only with `actions`. The close button does not land here and has no slot: `withCloseButton` and `closeLabel` govern it. */
  actionsProps?: BoxSlotProps | undefined;
}
