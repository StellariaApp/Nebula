"use client";

import { useId, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Charts.css.js";
import type { ChartPanelProps } from "./Charts.types.js";

export function ChartPanel(props: ChartPanelProps): ReactElement {
  const { panels, cols = 2, gap = "md", label, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const auto_id = useId();
  const css_vars = assignInlineVars({ [styles.panelCols]: String(cols) });

  return (
    <div
      className={cx(styles.panelGrid, styles.panelGap[gap], sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      {...(label === undefined ? {} : { role: "group", "aria-label": label })}
      {...rest}
    >
      {panels.map((panel) => {
        const heading_id = `${auto_id}-${panel.id}`;
        const span = Math.min(panel.span ?? 1, cols) as 1 | 2 | 3;
        return (
          <section
            key={panel.id}
            className={cx(styles.panelCard, styles.panelSpan[span])}
            {...(panel.title === undefined ? {} : { "aria-labelledby": heading_id })}
          >
            {panel.title === undefined && panel.action === undefined ? null : (
              <div className={styles.panelHead}>
                <div>
                  {panel.title === undefined ? null : (
                    <h3 className={styles.panelTitle} id={heading_id}>
                      {panel.title}
                    </h3>
                  )}
                  {panel.description === undefined ? null : (
                    <p className={styles.panelDescription}>{panel.description}</p>
                  )}
                </div>
                {panel.action}
              </div>
            )}
            {panel.content}
          </section>
        );
      })}
    </div>
  );
}

ChartPanel.displayName = "ChartPanel";
