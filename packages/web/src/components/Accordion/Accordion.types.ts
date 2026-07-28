import type { ReactNode } from "react";
import type { StyleProps } from "../../utils/style-props.js";

export interface AccordionItemData {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean | undefined;
  icon?: ReactNode | undefined;
}

export interface AccordionProps extends StyleProps {
  data: readonly AccordionItemData[];
  multiple?: boolean | undefined;
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  disabled?: boolean | undefined;
  chevronPosition?: "start" | "end" | undefined;
  className?: string | undefined;
}
