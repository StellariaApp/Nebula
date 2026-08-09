import type { ReactNode } from "react";

import type { ColorExtended, NebulaField, Size } from "@stellaria/nebula-tokens";

import type { CalendarVariant } from "../Calendar/Calendar.types.js";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface PeriodPickerLabels {
  previousYear?: string | undefined;
  nextYear?: string | undefined;
  previousRange?: string | undefined;
  nextRange?: string | undefined;
}

interface PeriodPickerBaseProps extends StyleProps {
  /**
   * Every cell in the grid. It spreads over ALL of them: the component generates them — the twelve
   * months of the visible year, or the page of years — not composition; `minValue` and `maxValue`
   * only decide which end up disabled. It is a `div` with `role="option"`, so it is typed as a `div`.
   */
  cellProps?: BoxSlotProps | undefined;
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
  /** @default 12 */
  yearsPerPage?: number | undefined;
}
