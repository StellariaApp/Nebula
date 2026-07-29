import type { ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { RenderOption, SelectOption } from "../../collections/options.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface SelectProps extends StyleProps {
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
  rootClassName?: string | undefined;
  name?: string | undefined;
}
