import type { ReactNode } from "react";

import type { ColorExtended, PermissionProps } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { SegmentSize, SegmentVariant } from "../Segment/Segment.types.js";

export interface TabItem extends PermissionProps {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean | undefined;
}

export interface TabsProps extends Omit<StyleProps, "color"> {
  data: readonly TabItem[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  size?: SegmentSize | undefined;
  variant?: SegmentVariant | undefined;
  color?: ColorExtended | undefined;
  disabled?: boolean | undefined;
  fullWidth?: boolean | undefined;
  swipeable?: boolean | undefined;
  draggable?: boolean | undefined;
  fill?: boolean | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}
