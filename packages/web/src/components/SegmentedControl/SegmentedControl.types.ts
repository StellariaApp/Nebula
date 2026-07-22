import type { ReactNode } from "react";

import type { Size } from "@stellaria/nebula-tokens";

export interface SegmentedItem {
  value: string;
  label: ReactNode;
  disabled?: boolean | undefined;
}

export type SegmentedData = ReadonlyArray<string | SegmentedItem>;

export interface SegmentedControlProps {
  data: SegmentedData;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  size?: Size | undefined;
  fullWidth?: boolean | undefined;
  disabled?: boolean | undefined;
  name?: string | undefined;
  "aria-label"?: string | undefined;
  className?: string | undefined;
}
