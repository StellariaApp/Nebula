import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type ChartDatum = Readonly<Record<string, string | number | null | undefined>>;

export interface ChartSeries {
  key: string;
  label?: string | undefined;
  color?: ColorExtended | undefined;
  stackId?: string | undefined;
}

export interface ChartAxis {
  key?: string | undefined;
  label?: string | undefined;
  hide?: boolean | undefined;
  tickFormatter?: ((value: string | number, index: number) => string) | undefined;
}

export interface ChartBaseProps extends StyleProps {
  /** El `figcaption` del titulo, que es a quien apunta el `aria-labelledby` del lienzo. Sin `title` no se pinta. */
  titleProps?: TextSlotProps | undefined;
  /** El parrafo del resumen, que es la descripcion accesible del grafico. Sin `summary` no se pinta. */
  summaryProps?: TextSlotProps | undefined;
  /** El `details` que despliega la tabla de datos. Solo existe con `withDataTable`. */
  detailsProps?: ComponentPropsWithoutRef<"details"> | undefined;
  /** El `summary` que abre ese desplegable, donde cae `dataTableLabel`. Solo existe con `withDataTable`. */
  detailsSummaryProps?: ComponentPropsWithoutRef<"summary"> | undefined;
  /** La tabla de datos de dentro del desplegable. Solo existe con `withDataTable`. */
  tableProps?: ComponentPropsWithoutRef<"table"> | undefined;
  data: readonly ChartDatum[];
  series: readonly ChartSeries[];
  xAxis?: ChartAxis | undefined;
  yAxis?: ChartAxis | undefined;
  height?: number | undefined;
  withTooltip?: boolean | undefined;
  withLegend?: boolean | undefined;
  withGrid?: boolean | undefined;
  title?: string | undefined;
  summary?: string | undefined;
  withDataTable?: boolean | undefined;
  dataTableLabel?: string | undefined;
  empty?: ReactNode | undefined;
  className?: string | undefined;
}

export interface BarChartProps extends ChartBaseProps {
  layout?: "horizontal" | "vertical" | undefined;
  radius?: number | undefined;
}

export interface LineChartProps extends ChartBaseProps {
  curve?: "linear" | "monotone" | "step" | undefined;
  withDots?: boolean | undefined;
}

export interface AreaChartProps extends LineChartProps {
  fillOpacity?: number | undefined;
}

export interface PieChartProps extends Omit<ChartBaseProps, "series" | "xAxis" | "yAxis"> {
  valueKey: string;
  labelKey: string;
  colors?: readonly ColorExtended[] | undefined;
  donut?: boolean | undefined;
  thickness?: number | undefined;
}

export interface SparkLineProps extends StyleProps {
  data: readonly number[];
  color?: ColorExtended | undefined;
  width?: number | undefined;
  height?: number | undefined;
  strokeWidth?: number | undefined;
  withArea?: boolean | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export type TrendDirection = "up" | "down" | "flat";

export interface TrendIndicatorProps extends Omit<StyleProps, "direction"> {
  /** La flecha. Es decorativa: la direccion se anuncia aparte con un texto oculto. */
  arrowProps?: BoxSlotProps | undefined;
  value: number;
  direction?: TrendDirection | undefined;
  format?: ((value: number) => string) | undefined;
  invertColors?: boolean | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export interface RadarChartProps extends Omit<ChartBaseProps, "xAxis" | "yAxis"> {
  /** Clave del eje angular: cada valor distinto es un vértice del polígono. */
  angleKey: string;
  fillOpacity?: number | undefined;
  withAxisLabels?: boolean | undefined;
  maxValue?: number | undefined;
}

export interface ChartLegendEntry {
  key: string;
  label: string;
  color: string;
}

export interface ChartLegendProps extends StyleProps {
  /** Cada entrada de la leyenda. Lleva `data-interactive`, que depende de si hay `onToggle`. */
  itemProps?: ComponentPropsWithoutRef<"button"> | undefined;
  entries: readonly ChartLegendEntry[];
  hidden?: readonly string[] | undefined;
  onToggle?: ((key: string) => void) | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export interface ChartTooltipDatum {
  key: string;
  label: string;
  value: string | number;
  color: string;
}

export interface ChartTooltipProps extends StyleProps {
  /** El titulo del globo, si lo hay. */
  titleProps?: TextSlotProps | undefined;
  /** Cada fila de serie. Se esparce sobre todas. */
  rowProps?: BoxSlotProps | undefined;
  /** El valor de cada fila, ya pasado por `format` si lo hay. */
  valueProps?: TextSlotProps | undefined;
  title?: ReactNode | undefined;
  items: readonly ChartTooltipDatum[];
  format?: ((value: string | number, key: string) => string) | undefined;
  className?: string | undefined;
}

export interface ChartPanelItem {
  id: string;
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  action?: ReactNode | undefined;
  span?: 1 | 2 | 3 | undefined;
  content: ReactNode;
}

export interface ChartPanelProps extends StyleProps {
  /** Cada tarjeta de panel. Se esparce sobre TODAS; su ancho lo fija el `span` de cada panel. */
  cardProps?: ComponentPropsWithoutRef<"section"> | undefined;
  /** La cabecera de cada panel. No se pinta si el panel no trae titulo ni accion. */
  headProps?: BoxSlotProps | undefined;
  /** El titulo de cada panel, que es el `h3` al que apunta su `aria-labelledby`. */
  titleProps?: TextSlotProps | undefined;
  /** La descripcion de cada panel, si la trae. */
  descriptionProps?: TextSlotProps | undefined;
  panels: readonly ChartPanelItem[];
  cols?: 1 | 2 | 3 | undefined;
  gap?: "sm" | "md" | "lg" | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
