"use client";

import { useId, type ReactElement, type ReactNode } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Charts.css.js";
import type { ChartBaseProps, ChartDatum } from "./Charts.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

export interface ChartFrameProps {
  title: string | undefined;
  titleProps: ChartBaseProps["titleProps"];
  summary: string | undefined;
  summaryProps: ChartBaseProps["summaryProps"];
  canvasProps: ChartBaseProps["canvasProps"];
  detailsProps: ChartBaseProps["detailsProps"];
  detailsSummaryProps: ChartBaseProps["detailsSummaryProps"];
  tableProps: ChartBaseProps["tableProps"];
  height: number;
  data: readonly ChartDatum[];
  columns: readonly { key: string; label: string }[];
  withDataTable: boolean;
  dataTableLabel: string | undefined;
  empty: ReactNode | undefined;
  className: string | undefined;
  styleRest: Record<string, unknown>;
  children: ReactNode;
}

export function ChartFrame(props: ChartFrameProps): ReactElement {
  const {
    title,
    titleProps,
    summary,
    summaryProps,
    canvasProps,
    detailsProps,
    detailsSummaryProps,
    tableProps,
    height,
    data,
    columns,
    withDataTable,
    dataTableLabel,
    empty,
    className,
    styleRest,
    children,
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(styleRest);

  const title_id = useId();
  const summary_id = useId();
  const has_title = title !== undefined;
  const has_summary = summary !== undefined;

  if (data.length === 0 && empty !== undefined) {
    return (
      <div className={cx(styles.root, sprinkle_class, className)} style={sprinkle_style}>
        {empty}
      </div>
    );
  }

  return (
    <figure className={cx(styles.root, sprinkle_class, className)} style={sprinkle_style}>
      {has_title ? (
        <Text
          component="figcaption"

          {...titleProps}
          id={title_id}
          className={cx(styles.title, titleProps?.className)}
        >
          {title}
        </Text>
      ) : null}

      <Box
        {...(has_title || has_summary
          ? {
              role: "img",
              "aria-labelledby": has_title ? title_id : summary_id,
              ...(has_title && has_summary ? { "aria-describedby": summary_id } : {}),
            }
          : {})}
        {...canvasProps}
        className={cx(styles.canvas, canvasProps?.className)}
        style={{ ...canvasProps?.style, height }}
      >
        {children}
      </Box>

      {has_summary ? (
        <Text
          {...summaryProps}
          id={summary_id}
          className={cx(styles.summary, summaryProps?.className)}
        >
          {summary}
        </Text>
      ) : null}

      {withDataTable ? (
        <details {...detailsProps} className={cx(styles.details, detailsProps?.className)}>
          <summary
            {...detailsSummaryProps}
            className={cx(styles.details_summary, detailsSummaryProps?.className)}
          >
            {dataTableLabel ?? "View data as a table"}
          </summary>
          <div className={styles.table_wrap}>
            <table {...tableProps} className={cx(styles.table, tableProps?.className)}>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} scope="col">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.key}>{String(row[column.key] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
    </figure>
  );
}

ChartFrame.displayName = "ChartFrame";
