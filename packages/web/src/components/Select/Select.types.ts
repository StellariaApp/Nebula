import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { RenderOption, SelectOption } from "../../collections/options.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { OverlayMotionSlotProps } from "../../overlays/overlay-motion.js";

export interface SelectProps extends StyleProps, FormFieldSlotProps {
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
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  renderOption?: RenderOption | undefined;
  placement?: PopoverPlacement | undefined;
  maxDropdownHeight?: number | undefined;
  emptyLabel?: string | undefined;
  className?: string | undefined;
  /** The button that opens the list. */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The value shown in the button. It carries the placeholder style when there is no selection. */
  valueProps?: BoxSlotProps | undefined;
  /** The chevron. It carries `data-open`, which is where its rotation comes from. */
  chevronProps?: BoxSlotProps | undefined;
  /**
   * The dropdown, which is the motion wrapper of the floating surface and does not go through `Box`:
   * it does not accept style props. Its width and position are written after the slot and are not
   * overridden; the `style` you pass composes with them.
   */
  dropdownProps?: OverlayMotionSlotProps | undefined;
  rootClassName?: string | undefined;
  name?: string | undefined;
}
