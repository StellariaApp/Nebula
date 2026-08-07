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
  /** Cada item de la lista. Se esparce sobre TODOS, no sobre uno. */
  itemProps?: BoxSlotProps | undefined;
  /** El boton que abre y cierra. Lleva ya el aria-expanded y el aria-controls. */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** Icono del item, si lo trae. El chevron NO se expone: lo anima motion. */
  iconProps?: BoxSlotProps | undefined;
  /** Rotulo del item, dentro del boton. */
  labelProps?: TextSlotProps | undefined;
  /** Panel desplegable. Vive dentro de un Collapse, asi que su altura la gobierna el. */
  panelProps?: BoxSlotProps | undefined;
}
