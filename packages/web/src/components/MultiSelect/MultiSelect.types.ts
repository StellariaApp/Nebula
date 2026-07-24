import type { ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { RenderOption, SelectOption } from "../../collections/options.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";

export interface MultiSelectProps {
  data: readonly SelectOption[];
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  placeholder?: string | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  field?: NebulaField<string[]> | undefined;
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  searchable?: boolean | undefined;
  maxValues?: number | undefined;
  renderOption?: RenderOption | undefined;
  placement?: PopoverPlacement | undefined;
  maxDropdownHeight?: number | undefined;
  emptyLabel?: string | undefined;
  removeLabel?: ((option: SelectOption) => string) | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}
