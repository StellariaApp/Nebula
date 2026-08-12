import { CHART_TOKENS } from "./chart-theme.js";
import type { ChartAxis, ChartSeries } from "./Charts.types.js";

export const DEFAULT_HEIGHT = 260;

export const TOOLTIP_STYLE = {
  background: CHART_TOKENS.surface,
  border: `1px solid ${CHART_TOKENS.border}`,
  borderRadius: CHART_TOKENS.radius,
  fontFamily: CHART_TOKENS.font,
  fontSize: 12,
  color: CHART_TOKENS.text,
};

export function Columns(xAxis: ChartAxis | undefined, series: readonly ChartSeries[]) {
  const key = xAxis?.key ?? "name";
  return [
    { key, label: xAxis?.label ?? key },
    ...series.map((entry) => ({ key: entry.key, label: entry.label ?? entry.key })),
  ];
}

export function AxisProps(axis: ChartAxis | undefined, fallbackKey: string | undefined) {
  return {
    ...(fallbackKey === undefined ? {} : { dataKey: axis?.key ?? fallbackKey }),
    hide: axis?.hide === true,
    stroke: CHART_TOKENS.axis,
    tick: { fill: CHART_TOKENS.axis, fontSize: 12 },
    ...(axis?.tickFormatter === undefined ? {} : { tickFormatter: axis.tickFormatter }),
  };
}
