import type { ReactNode } from "react";
import type { StyleProps } from "../../utils/style-props.js";

export interface AccordionItemData {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean | undefined;
  icon?: ReactNode | undefined;
}

export type AccordionValue<Multiple extends boolean> = Multiple extends true
  ? string[]
  : string | undefined;

export interface AccordionProps<Multiple extends boolean = false> extends StyleProps {
  data: readonly AccordionItemData[];
  multiple?: Multiple | undefined;
  value?: AccordionValue<Multiple> | undefined;
  defaultValue?: AccordionValue<Multiple> | undefined;
  onChange?: ((value: AccordionValue<Multiple>) => void) | undefined;
  disabled?: boolean | undefined;
  chevronPosition?: "start" | "end" | undefined;
  className?: string | undefined;
}
