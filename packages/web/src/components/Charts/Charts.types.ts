import type { ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

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

export interface ChartBaseProps extends Omit<StyleProps, "color"> {
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

export interface SparkLineProps extends Omit<StyleProps, "color"> {
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

export interface TrendIndicatorProps extends Omit<StyleProps, "color" | "direction"> {
  value: number;
  direction?: TrendDirection | undefined;
  format?: ((value: number) => string) | undefined;
  invertColors?: boolean | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
