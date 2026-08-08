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
 * Las ranuras del calendario, compartidas por `Calendar` y `RangeCalendar`. Las rejillas y los días
 * los monta React Aria a partir del estado, no por composición, así que cada ranura de día o de
 * rótulo se esparce sobre TODOS.
 */
export interface CalendarSlotProps {
  /** La fila de meses. Con `visibleMonths` mayor que 1 es quien los pone en fila. */
  monthsProps?: BoxSlotProps | undefined;
  /** La cabecera, con las dos flechas y el rótulo del mes. */
  headerProps?: BoxSlotProps | undefined;
  /** El rótulo del mes, que es el `h2` de la cabecera. Su texto lo compone React Aria. */
  headingProps?: TextSlotProps | undefined;
  /** La flecha de mes anterior. Su rótulo accesible sale de `labels.previousMonth`. */
  previousProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** La flecha de mes siguiente. Su rótulo accesible sale de `labels.nextMonth`. */
  nextProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /**
   * Cada día. Se esparce sobre TODOS y va DESPUÉS de las props de celda de aria, que traen el
   * teclado y la selección; llevan `data-selected`, `data-today` y el resto del estado, que es de
   * donde salen sus colores.
   */
  cellProps?: BoxSlotProps | undefined;
  /** Cada rótulo de día de la semana. */
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
