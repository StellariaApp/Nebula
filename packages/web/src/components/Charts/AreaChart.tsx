"use client";

import type { ReactElement } from "react";

import {
  Area,
  AreaChart as RechartsArea,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AxisProps, Columns, DEFAULT_HEIGHT, TOOLTIP_STYLE } from "./cartesian.js";
import { CHART_TOKENS, SeriesColor } from "./chart-theme.js";
import { ChartFrame } from "./ChartFrame.js";
import type { AreaChartProps } from "./Charts.types.js";

export function AreaChart(props: AreaChartProps): ReactElement {
  const {
    data,
    series,
    xAxis,
    yAxis,
    height = DEFAULT_HEIGHT,
    withTooltip = true,
    withLegend = false,
    withGrid = true,
    curve = "monotone",
    fillOpacity = 0.2,
    title,
    titleProps,
    summary,
    summaryProps,
    canvasProps,
    detailsProps,
    detailsSummaryProps,
    tableProps,
    withDataTable = false,
    dataTableLabel,
    empty,
    className,
    ...style_rest
  } = props;

  return (
    <ChartFrame
      title={title}
      titleProps={titleProps}
      summary={summary}
      summaryProps={summaryProps}
      canvasProps={canvasProps}
      detailsProps={detailsProps}
      detailsSummaryProps={detailsSummaryProps}
      tableProps={tableProps}
      height={height}
      data={data}
      columns={Columns(xAxis, series)}
      withDataTable={withDataTable}
      dataTableLabel={dataTableLabel}
      empty={empty}
      className={className}
      styleRest={style_rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsArea data={[...data]}>
          {withGrid ? <CartesianGrid stroke={CHART_TOKENS.grid} vertical={false} /> : null}
          <XAxis {...AxisProps(xAxis, "name")} />
          <YAxis {...AxisProps(yAxis, undefined)} />
          {withTooltip ? <Tooltip contentStyle={TOOLTIP_STYLE} /> : null}
          {withLegend ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
          {series.map((entry, index) => (
            <Area
              key={entry.key}
              type={curve}
              dataKey={entry.key}
              {...(entry.label === undefined ? {} : { name: entry.label })}
              {...(entry.stackId === undefined ? {} : { stackId: entry.stackId })}
              stroke={SeriesColor(entry.color, index)}
              fill={SeriesColor(entry.color, index)}
              fillOpacity={fillOpacity}
              strokeWidth={2}
            />
          ))}
        </RechartsArea>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

AreaChart.displayName = "AreaChart";
