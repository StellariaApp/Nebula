import type { ReactNode } from "react";

import type { SemanticScaleName, Size } from "@stellaria/nebula-tokens";

export interface SegmentItemData {
  value: string;
  label: ReactNode;
  disabled?: boolean | undefined;
}

export interface SegmentProps {
  children: ReactNode;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  size?: Size | undefined;
  color?: SemanticScaleName | undefined;
  disabled?: boolean | undefined;
  fullWidth?: boolean | undefined;
  draggable?: boolean | undefined;
  className?: string | undefined;
}

export type SegmentControlData = ReadonlyArray<string | SegmentItemData>;

export interface SegmentControlProps {
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

export interface SegmentContentProps {
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

export interface SegmentSectionProps {
  children: ReactNode;
  className?: string | undefined;
}
