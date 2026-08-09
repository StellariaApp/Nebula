import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { RenderOption, SelectOption } from "../../collections/options.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { OverlayMotionSlotProps } from "../../overlays/overlay-motion.js";
import type { FormFieldSlotProps } from "../FormField/FormField.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { UnstyledButtonProps } from "../UnstyledButton/UnstyledButton.types.js";

export interface MultiSelectProps extends StyleProps, FormFieldSlotProps {
  /** The box that groups the tags and the search field. */
  controlProps?: BoxSlotProps | undefined;
  /** Every tag of a chosen value. It spreads over ALL of them. */
  chipProps?: BoxSlotProps | undefined;
  /** The label of each tag. */
  chipLabelProps?: TextSlotProps | undefined;
  /** The cross that removes each tag. Its accessible label comes from `removeLabel`. */
  chipRemoveProps?: UnstyledButtonProps | undefined;
  /**
   * The search field. It spreads AFTER the aria combobox props and after the component keyboard
   * handler, so an `onKeyDown` here takes out backspace-to-remove.
   */
  searchProps?: ComponentPropsWithoutRef<"input"> | undefined;
  /** The button that opens the list. */
  triggerProps?: UnstyledButtonProps | undefined;
  /** The chevron of that button. It carries `data-open`, which is where its rotation comes from. */
  chevronProps?: BoxSlotProps | undefined;
  /**
   * The dropdown, which is the motion wrapper of the floating surface and does not go through `Box`:
   * it does not accept style props. Its width and position are written after the slot and are not
   * overridden; the `style` you pass composes with them.
   */
  dropdownProps?: OverlayMotionSlotProps | undefined;
  data: readonly SelectOption[];
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  placeholder?: string | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  field?: NebulaField<string[]> | undefined;
  value?: readonly string[] | undefined;
  /** @default [] */
  defaultValue?: readonly string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  searchable?: boolean | undefined;
  maxValues?: number | undefined;
  renderOption?: RenderOption | undefined;
  placement?: PopoverPlacement | undefined;
  maxDropdownHeight?: number | undefined;
  emptyLabel?: string | undefined;
  /** @default (option) => `Remove ${option.label}` */
  removeLabel?: ((option: SelectOption) => string) | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}
