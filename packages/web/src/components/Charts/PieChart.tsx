"use client";

import type { ReactElement } from "react";

import { Cell, Legend, Pie, PieChart as RechartsPie, ResponsiveContainer, Tooltip } from "recharts";

import { CHART_TOKENS, SeriesColor } from "./chart-theme.js";
import { ChartFrame } from "./ChartFrame.js";
import type { PieChartProps } from "./Charts.types.js";

const DEFAULT_HEIGHT = 260;

export function PieChart(props: PieChartProps): ReactElement {
  const {
    data,
    valueKey,
    labelKey,
    colors,
    donut = false,
    thickness = 32,
    height = DEFAULT_HEIGHT,
    withTooltip = true,
    withLegend = true,
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

  const outer = Math.max(60, Math.min(height / 2 - 16, 120));
  const inner = donut ? Math.max(0, outer - thickness) : 0;

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
      columns={[
        { key: labelKey, label: labelKey },
        { key: valueKey, label: valueKey },
      ]}
      withDataTable={withDataTable}
      dataTableLabel={dataTableLabel}
      empty={empty}
      className={className}
      styleRest={style_rest}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie
            data={[...data]}
            dataKey={valueKey}
            nameKey={labelKey}
            innerRadius={inner}
            outerRadius={outer}
            paddingAngle={donut ? 2 : 0}
          >
            {data.map((row, index) => (
              <Cell
                key={String(row[labelKey] ?? index)}
                fill={SeriesColor(colors?.[index % (colors.length || 1)], index)}
              />
            ))}
          </Pie>
          {withTooltip ? (
            <Tooltip
              contentStyle={{
                background: CHART_TOKENS.surface,
                border: `1px solid ${CHART_TOKENS.border}`,
                borderRadius: CHART_TOKENS.radius,
                fontFamily: CHART_TOKENS.font,
                fontSize: 12,
                color: CHART_TOKENS.text,
              }}
            />
          ) : null}
          {withLegend ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
        </RechartsPie>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

PieChart.displayName = "PieChart";
