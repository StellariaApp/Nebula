import type { ReactNode } from "react";

import type { SemanticScaleName, Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export interface TabItem {
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
  size?: Size | undefined;
  color?: SemanticScaleName | undefined;
  disabled?: boolean | undefined;
  fullWidth?: boolean | undefined;
  swipeable?: boolean | undefined;
  draggable?: boolean | undefined;
  fill?: boolean | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}
