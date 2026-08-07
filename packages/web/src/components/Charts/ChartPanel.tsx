"use client";

import { useId, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Charts.css.js";
import * as charts_vars from "./Charts.vars.css.js";
import type { ChartPanelProps } from "./Charts.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

export function ChartPanel(props: ChartPanelProps): ReactElement {
  const {
    panels,
    cols = 2,
    gap = "md",
    label,
    className,
    cardProps,
    headProps,
    titleProps,
    descriptionProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const auto_id = useId();
  const css_vars = assignInlineVars({ [charts_vars.panelCols]: String(cols) });

  return (
    <div
      className={cx(styles.panel_grid, styles.panel_gap[gap], sprinkle_class, className)}
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
            {...cardProps}
            className={cx(styles.panel_card, styles.panel_span[span], cardProps?.className)}
            {...(panel.title === undefined ? {} : { "aria-labelledby": heading_id })}
          >
            {panel.title === undefined && panel.action === undefined ? null : (
              <Box {...headProps} className={cx(styles.panel_head, headProps?.className)}>
                <div>
                  {panel.title === undefined ? null : (
                    <Text
                      component="h3"
                      id={heading_id}
                      {...titleProps}
                      className={cx(styles.panel_title, titleProps?.className)}
                    >
                      {panel.title}
                    </Text>
                  )}
                  {panel.description === undefined ? null : (
                    <Text
                      {...descriptionProps}
                      className={cx(styles.panel_description, descriptionProps?.className)}
                    >
                      {panel.description}
                    </Text>
                  )}
                </div>
                {panel.action}
              </Box>
            )}
            {panel.content}
          </section>
        );
      })}
    </div>
  );
}

ChartPanel.displayName = "ChartPanel";
