import type { ReactNode } from "react";

import type { Size, SizeValue } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type ModalSize = Size;

export type ModalSide = "start" | "end" | "top" | "bottom";

export interface ModalProps extends StyleProps {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  size?: SizeValue | undefined;
  fullScreen?: boolean | undefined;
  blurred?: boolean | undefined;
  drawer?: boolean | ModalSide | undefined;
  centered?: boolean | undefined;
  closeOnClickOutside?: boolean | undefined;
  closeOnEscape?: boolean | undefined;
  withCloseButton?: boolean | undefined;
  closeLabel?: string | undefined;
  padding?: "none" | "sm" | "md" | "lg" | undefined;
  radius?: "none" | "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
  /** The header row: heading on the left, close button on the right. */
  headerProps?: BoxSlotProps | undefined;
  /** Title and subtitle column, inside the header. */
  headingProps?: BoxSlotProps | undefined;
  /** The title. It spreads AFTER the aria props, so the consumer wins. */
  titleProps?: TextSlotProps | undefined;
  /** The subtitle, when there is one. */
  subtitleProps?: TextSlotProps | undefined;
  /** The body. Its padding is governed by `padding`; the slot composes with it, it does not override it. */
  bodyProps?: BoxSlotProps | undefined;
  /** The footer, when there is a `footer`. */
  footerProps?: BoxSlotProps | undefined;
  bodyClassName?: string | undefined;
  "aria-label"?: string | undefined;
}
