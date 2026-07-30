import type { ReactNode } from "react";

import type { ColorExtended, NebulaField, Size } from "@stellaria/nebula-tokens";

import type { CalendarVariant } from "../Calendar/Calendar.types.js";

import type { StyleProps } from "../../utils/style-props.js";

export interface PeriodPickerLabels {
  previousYear?: string | undefined;
  nextYear?: string | undefined;
  previousRange?: string | undefined;
  nextRange?: string | undefined;
}

interface PeriodPickerBaseProps extends Omit<StyleProps, "color"> {
  label?: ReactNode | undefined;
  size?: Size | undefined;
  variant?: CalendarVariant | undefined;
  color?: ColorExtended | undefined;
  locale?: string | undefined;
  minValue?: string | undefined;
  maxValue?: string | undefined;
  disabled?: boolean | undefined;
  labels?: PeriodPickerLabels | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  className?: string | undefined;
}

export type MonthPickerProps = PeriodPickerBaseProps;

export interface YearPickerProps extends PeriodPickerBaseProps {
  yearsPerPage?: number | undefined;
}
