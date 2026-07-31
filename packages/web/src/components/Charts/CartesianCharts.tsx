"use client";

import type { ReactElement } from "react";

import {
  Area,
  AreaChart as RechartsArea,
  Bar,
  BarChart as RechartsBar,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_TOKENS, SeriesColor } from "./chart-theme.js";
import { ChartFrame } from "./ChartFrame.js";
import type {
  AreaChartProps,
  BarChartProps,
  ChartAxis,
  ChartSeries,
  LineChartProps,
} from "./Charts.types.js";

const DEFAULT_HEIGHT = 260;

function Columns(xAxis: ChartAxis | undefined, series: readonly ChartSeries[]) {
  const key = xAxis?.key ?? "name";
  return [
    { key, label: xAxis?.label ?? key },
    ...series.map((entry) => ({ key: entry.key, label: entry.label ?? entry.key })),
  ];
}

function AxisProps(axis: ChartAxis | undefined, fallbackKey: string | undefined) {
  return {
    ...(fallbackKey === undefined ? {} : { dataKey: axis?.key ?? fallbackKey }),
    hide: axis?.hide === true,
    stroke: CHART_TOKENS.axis,
    tick: { fill: CHART_TOKENS.axis, fontSize: 12 },
    ...(axis?.tickFormatter === undefined ? {} : { tickFormatter: axis.tickFormatter }),
  };
}

const TOOLTIP_STYLE = {
  background: CHART_TOKENS.surface,
  border: `1px solid ${CHART_TOKENS.border}`,
  borderRadius: CHART_TOKENS.radius,
  fontFamily: CHART_TOKENS.font,
  fontSize: 12,
  color: CHART_TOKENS.text,
};

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
    summary,
    withDataTable = false,
    dataTableLabel,
    empty,
    className,
    ...style_rest
  } = props;

  return (
    <ChartFrame
      title={title}
      summary={summary}
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
    summary,
    withDataTable = false,
    dataTableLabel,
    empty,
    className,
    ...style_rest
  } = props;

  return (
    <ChartFrame
      title={title}
      summary={summary}
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
    summary,
    withDataTable = false,
    dataTableLabel,
    empty,
    className,
    ...style_rest
  } = props;

  return (
    <ChartFrame
      title={title}
      summary={summary}
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
