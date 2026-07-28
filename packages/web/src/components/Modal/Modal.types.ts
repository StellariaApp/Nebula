import type { ReactNode } from "react";

import type { Size, SizeValue } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type ModalSize = Size;

export type ModalSide = "start" | "end" | "top" | "bottom";

export interface ModalProps extends StyleProps {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
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
  bodyClassName?: string | undefined;
  "aria-label"?: string | undefined;
}
