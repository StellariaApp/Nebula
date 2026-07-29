import type { ReactNode } from "react";

import type { SemanticScaleName, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface SegmentItemData {
  value: string;
  label: ReactNode;
  disabled?: boolean | undefined;
}

export type SegmentVariant = Extract<Variant, "filled" | "light">;

export interface SegmentProps extends Omit<StyleProps, "color"> {
  children: ReactNode;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  size?: Size | undefined;
  variant?: SegmentVariant | undefined;
  color?: SemanticScaleName | undefined;
  disabled?: boolean | undefined;
  fullWidth?: boolean | undefined;
  draggable?: boolean | undefined;
  className?: string | undefined;
}

export type SegmentControlData = ReadonlyArray<string | SegmentItemData>;

export interface SegmentControlProps extends StyleProps {
  data?: SegmentControlData | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface SegmentControlItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean | undefined;
}

export interface SegmentContentProps extends StyleProps {
  children: ReactNode;
  swipeable?: boolean | undefined;
  fill?: boolean | undefined;
  className?: string | undefined;
}

export interface SegmentContentItemProps {
  value: string;
  children: ReactNode;
  className?: string | undefined;
}

export interface SegmentSectionProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
}
