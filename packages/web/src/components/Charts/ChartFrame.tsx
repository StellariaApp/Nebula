"use client";

import { useId, type ReactElement, type ReactNode } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Charts.css.js";
import type { ChartDatum } from "./Charts.types.js";

export interface ChartFrameProps {
  title: string | undefined;
  summary: string | undefined;
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
    summary,
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
        <figcaption className={styles.title} id={title_id}>
          {title}
        </figcaption>
      ) : null}

      <div
        className={styles.canvas}
        style={{ height }}
        role="img"
        {...(has_title ? { "aria-labelledby": title_id } : {})}
        {...(has_summary ? { "aria-describedby": summary_id } : {})}
      >
        {children}
      </div>

      {has_summary ? (
        <p className={styles.summary} id={summary_id}>
          {summary}
        </p>
      ) : null}

      {withDataTable ? (
        <details className={styles.details}>
          <summary className={styles.detailsSummary}>
            {dataTableLabel ?? "Ver datos en tabla"}
          </summary>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
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
