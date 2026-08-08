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
   * Cada casilla de la rejilla. Se esparce sobre TODAS: las genera el componente —los doce meses
   * del año a la vista, o la página de años—, no la composición; `minValue` y `maxValue` solo
   * deciden cuáles quedan deshabilitadas. Es un `div` con `role="option"`, así que se tipa como
   * `div`.
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
