"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Timeline.css.js";
import {
  bulletBg,
  bulletBorder,
  bulletFg,
  bulletSize as bullet_size_var,
  lineWidth as line_width_var,
} from "./Timeline.vars.css.js";
import type { TimelineProps } from "./Timeline.types.js";

export function Timeline(props: TimelineProps): ReactElement {
  const {
    items,
    active = -1,
    variant = "filled",
    color = "primary",
    align = "start",
    bulletSize = 18,
    lineWidth = 2,
    reachedLabel = "completado",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [bulletBg]: resolved.background,
    [bulletFg]: resolved.foreground,
    [bulletBorder]: resolved.borderColor,
    [bullet_size_var]: `${String(bulletSize)}px`,
    [line_width_var]: `${String(lineWidth)}px`,
  });

  return (
    <ol
      className={cx(styles.root, styles.align[align], sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
    >
      {items.map((item, index) => {
        const reached = index <= active;
        return (
          <li key={index} className={styles.item} data-reached={reached ? "true" : undefined}>
            <span className={styles.bullet} data-reached={reached ? "true" : undefined}>
              {item.bullet}
            </span>
            <span
              className={styles.line}
              data-reached={index < active ? "true" : undefined}
              aria-hidden="true"
            />
            <div className={styles.body}>
              <span className={styles.title}>{item.title}</span>
              {item.meta === undefined ? null : <span className={styles.meta}>{item.meta}</span>}
              {item.description === undefined ? null : (
                <span className={styles.description}>{item.description}</span>
              )}
              {reached ? <VisuallyHidden>{reachedLabel}</VisuallyHidden> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

Timeline.displayName = "Timeline";
