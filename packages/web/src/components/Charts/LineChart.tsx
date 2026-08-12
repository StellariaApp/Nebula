"use client";

import type { ReactElement } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AxisProps, Columns, DEFAULT_HEIGHT, TOOLTIP_STYLE } from "./cartesian.js";
import { CHART_TOKENS, SeriesColor } from "./chart-theme.js";
import { ChartFrame } from "./ChartFrame.js";
import type { LineChartProps } from "./Charts.types.js";

export function LineChart(props: LineChartProps): ReactElement {
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
    withDots = false,
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
        <RechartsLine data={[...data]}>
          {withGrid ? <CartesianGrid stroke={CHART_TOKENS.grid} vertical={false} /> : null}
          <XAxis {...AxisProps(xAxis, "name")} />
          <YAxis {...AxisProps(yAxis, undefined)} />
          {withTooltip ? <Tooltip contentStyle={TOOLTIP_STYLE} /> : null}
          {withLegend ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
          {series.map((entry, index) => (
            <Line
              key={entry.key}
              type={curve}
              dataKey={entry.key}
              {...(entry.label === undefined ? {} : { name: entry.label })}
              stroke={SeriesColor(entry.color, index)}
              strokeWidth={2}
              dot={withDots}
            />
          ))}
        </RechartsLine>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

LineChart.displayName = "LineChart";
