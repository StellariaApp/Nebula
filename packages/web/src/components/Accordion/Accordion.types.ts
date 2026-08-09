import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

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
  /** Every item in the list. It spreads over ALL of them, not over one. */
  itemProps?: BoxSlotProps | undefined;
  /** The button that opens and closes. It already carries the `aria-expanded` and the `aria-controls`. */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The item icon, when it has one. The chevron is NOT exposed: motion animates it. */
  iconProps?: BoxSlotProps | undefined;
  /** The item label, inside the button. */
  labelProps?: TextSlotProps | undefined;
  /** The disclosure panel. It lives inside a `Collapse`, so that is what governs its height. */
  panelProps?: BoxSlotProps | undefined;
}
