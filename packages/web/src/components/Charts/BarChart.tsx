"use client";

import type { ReactElement } from "react";

import {
  Bar,
  BarChart as RechartsBar,
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
import type { BarChartProps } from "./Charts.types.js";

export function BarChart(props: BarChartProps): ReactElement {
  const {
    data,
    series,
    xAxis,
    yAxis,
    height = DEFAULT_HEIGHT,
    withTooltip = true,
    withLegend = false,
    withGrid = true,
    layout = "horizontal",
    radius = 4,
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
        <RechartsBar data={[...data]} layout={layout}>
          {withGrid ? <CartesianGrid stroke={CHART_TOKENS.grid} vertical={false} /> : null}
          <XAxis {...AxisProps(xAxis, "name")} />
          <YAxis {...AxisProps(yAxis, undefined)} />
          {withTooltip ? <Tooltip contentStyle={TOOLTIP_STYLE} cursor={false} /> : null}
          {withLegend ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
          {series.map((entry, index) => (
            <Bar
              key={entry.key}
              dataKey={entry.key}
              {...(entry.label === undefined ? {} : { name: entry.label })}
              {...(entry.stackId === undefined ? {} : { stackId: entry.stackId })}
              fill={SeriesColor(entry.color, index)}
              radius={radius}
            />
          ))}
        </RechartsBar>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

BarChart.displayName = "BarChart";
