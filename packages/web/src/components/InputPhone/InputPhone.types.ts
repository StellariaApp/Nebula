import type { ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { DialOption } from "../../collections/dial-codes.js";
import type { RenderFlag } from "../../fields/dial-select.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface InputPhoneProps extends StyleProps {
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
  fieldDial?: NebulaField<string> | undefined;
  dialValue?: string | undefined;
  defaultDialValue?: string | undefined;
  onDialChange?: ((code: string) => void) | undefined;
  data?: readonly DialOption[] | undefined;
  renderFlag?: RenderFlag | undefined;
  emptyLabel?: string | undefined;
  dialLabel?: string | undefined;
  name?: string | undefined;
  dialName?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}
