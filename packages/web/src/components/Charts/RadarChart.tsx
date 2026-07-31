"use client";

import type { ReactElement } from "react";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { CHART_TOKENS, SeriesColor } from "./chart-theme.js";
import { ChartFrame } from "./ChartFrame.js";
import type { RadarChartProps } from "./Charts.types.js";

const DEFAULT_HEIGHT = 280;
const DEFAULT_FILL_OPACITY = 0.22;

const TOOLTIP_STYLE = {
  background: CHART_TOKENS.surface,
  border: `1px solid ${CHART_TOKENS.border}`,
  borderRadius: CHART_TOKENS.radius,
  fontFamily: CHART_TOKENS.font,
  fontSize: 12,
  color: CHART_TOKENS.text,
};

export function RadarChart(props: RadarChartProps): ReactElement {
  const {
    data,
    series,
    angleKey,
    height = DEFAULT_HEIGHT,
    withTooltip = true,
    withLegend = true,
    withGrid = true,
    withAxisLabels = true,
    fillOpacity = DEFAULT_FILL_OPACITY,
    maxValue,
    title,
    summary,
    withDataTable = false,
    dataTableLabel,
    empty,
    className,
    ...style_rest
  } = props;

  const columns = [
    { key: angleKey, label: angleKey },
    ...series.map((entry) => ({ key: entry.key, label: entry.label ?? entry.key })),
  ];

  return (
    <ChartFrame
      title={title}
      summary={summary}
      height={height}
      data={data}
      columns={columns}
      withDataTable={withDataTable}
      dataTableLabel={dataTableLabel}
      empty={empty}
      className={className}
      styleRest={style_rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data}>
          {withGrid ? <PolarGrid stroke={CHART_TOKENS.grid} /> : null}
          <PolarAngleAxis
            dataKey={angleKey}
            tick={{ fill: CHART_TOKENS.axis, fontSize: 12 }}
            stroke={CHART_TOKENS.axis}
          />
          {withAxisLabels ? (
            <PolarRadiusAxis
              tick={{ fill: CHART_TOKENS.axis, fontSize: 11 }}
              stroke={CHART_TOKENS.grid}
              {...(maxValue === undefined ? {} : { domain: [0, maxValue] })}
            />
          ) : null}
          {withTooltip ? <Tooltip contentStyle={TOOLTIP_STYLE} /> : null}
          {withLegend ? <Legend wrapperStyle={{ fontSize: 12, color: CHART_TOKENS.text }} /> : null}
          {series.map((entry, index) => {
            const color = SeriesColor(entry.color, index);
            return (
              <Radar
                key={entry.key}
                dataKey={entry.key}
                name={entry.label ?? entry.key}
                stroke={color}
                fill={color}
                fillOpacity={fillOpacity}
              />
            );
          })}
        </RechartsRadar>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

RadarChart.displayName = "RadarChart";
