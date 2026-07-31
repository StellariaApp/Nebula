import type { ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { RenderOption, SelectOption } from "../../collections/options.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

export type ComboboxMenuTrigger = "input" | "focus" | "manual";

export interface ComboboxProps extends StyleProps {
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
  inputValue?: string | undefined;
  onInputChange?: ((value: string) => void) | undefined;
  allowsCustomValue?: boolean | undefined;
  menuTrigger?: ComboboxMenuTrigger | undefined;
  renderOption?: RenderOption | undefined;
  placement?: PopoverPlacement | undefined;
  maxDropdownHeight?: number | undefined;
  virtualizeFrom?: number | undefined;
  optionHeight?: number | undefined;
  emptyLabel?: string | undefined;
  clearLabel?: string | undefined;
  toggleLabel?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
  name?: string | undefined;
}
