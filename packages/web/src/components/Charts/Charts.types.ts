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
  /** The title `figcaption`, which is what the canvas `aria-labelledby` points at. Not rendered without `title`. */
  titleProps?: TextSlotProps | undefined;
  /** The summary paragraph, which is the accessible description of the chart. Not rendered without `summary`. */
  summaryProps?: TextSlotProps | undefined;
  /**
   * The canvas the chart is painted on. Its height is written AFTER the slot, because it comes from
   * `height`; with `title` or `summary` it also carries the `role="img"` and the `aria-labelledby`
   * that give it an accessible name, so rewriting those here leaves the chart nameless.
   */
  canvasProps?: BoxSlotProps | undefined;
  /** The `details` that discloses the data table. Only exists with `withDataTable`. */
  detailsProps?: ComponentPropsWithoutRef<"details"> | undefined;
  /** The `summary` that opens that disclosure, where `dataTableLabel` lands. Only exists with `withDataTable`. */
  detailsSummaryProps?: ComponentPropsWithoutRef<"summary"> | undefined;
  /** The data table inside the disclosure. Only exists with `withDataTable`. */
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
  /** The arrow. Decorative: the direction is announced separately with hidden text. */
  arrowProps?: BoxSlotProps | undefined;
  value: number;
  direction?: TrendDirection | undefined;
  format?: ((value: number) => string) | undefined;
  invertColors?: boolean | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export interface RadarChartProps extends Omit<ChartBaseProps, "xAxis" | "yAxis"> {
  /** Key of the angular axis: each distinct value is a vertex of the polygon. */
  angleKey: string;
  /** @default 0.22 */
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
  /** Every legend entry. It carries `data-interactive`, which depends on whether there is an `onToggle`. */
  itemProps?: ComponentPropsWithoutRef<"button"> | undefined;
  entries: readonly ChartLegendEntry[];
  /** @default [] */
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
  /** The tooltip title, when there is one. */
  titleProps?: TextSlotProps | undefined;
  /** Every series row. It spreads over all of them. */
  rowProps?: BoxSlotProps | undefined;
  /** The value of each row, already passed through `format` when there is one. */
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
  /** Every panel card. It spreads over ALL of them; the width comes from the `span` of each panel. */
  cardProps?: ComponentPropsWithoutRef<"section"> | undefined;
  /** The header of each panel. Not rendered when the panel has no title and no action. */
  headProps?: BoxSlotProps | undefined;
  /** The title of each panel, which is the `h3` its `aria-labelledby` points at. */
  titleProps?: TextSlotProps | undefined;
  /** The description of each panel, when it has one. */
  descriptionProps?: TextSlotProps | undefined;
  panels: readonly ChartPanelItem[];
  cols?: 1 | 2 | 3 | undefined;
  gap?: "sm" | "md" | "lg" | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
