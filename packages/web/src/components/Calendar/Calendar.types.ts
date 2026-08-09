import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type {
  ColorExtended,
  DateRange,
  NebulaField,
  Size,
  Variant,
} from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type CalendarVariant = Extract<Variant, "filled" | "outline" | "light" | "ghost">;

export interface CalendarLabels {
  previousMonth?: string | undefined;
  nextMonth?: string | undefined;
}

/**
 * The calendar slots, shared by `Calendar` and `RangeCalendar`. React Aria builds the grids and the
 * days from state, not from composition, so every day or label slot spreads over ALL of them.
 */
export interface CalendarSlotProps {
  /** The month row. With `visibleMonths` greater than 1, this is what lines them up. */
  monthsProps?: BoxSlotProps | undefined;
  /** The header, with the two arrows and the month label. */
  headerProps?: BoxSlotProps | undefined;
  /** The month label, which is the `h2` of the header. React Aria composes its text. */
  headingProps?: TextSlotProps | undefined;
  /** The previous-month arrow. Its accessible label comes from `labels.previousMonth`. */
  previousProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The next-month arrow. Its accessible label comes from `labels.nextMonth`. */
  nextProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /**
   * Every day. It spreads over ALL of them and goes AFTER the aria cell props, which bring the
   * keyboard and the selection; they carry `data-selected`, `data-today` and the rest of the state,
   * which is where their colours come from.
   */
  cellProps?: BoxSlotProps | undefined;
  /** Every weekday label. */
  weekdayProps?: ComponentPropsWithoutRef<"th"> | undefined;
}

interface CalendarBaseProps extends StyleProps, CalendarSlotProps {
  label?: ReactNode | undefined;
  size?: Size | undefined;
  variant?: CalendarVariant | undefined;
  color?: ColorExtended | undefined;
  locale?: string | undefined;
  minValue?: string | undefined;
  maxValue?: string | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  autoFocus?: boolean | undefined;
  visibleMonths?: number | undefined;
  labels?: CalendarLabels | undefined;
  className?: string | undefined;
}

export interface CalendarProps extends CalendarBaseProps {
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

export interface RangeCalendarProps extends CalendarBaseProps {
  field?: NebulaField<DateRange> | undefined;
  value?: DateRange | undefined;
  defaultValue?: DateRange | undefined;
  onChange?: ((value: DateRange) => void) | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}
