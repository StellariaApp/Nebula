"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Timeline.css.js";
import * as variables from "./Timeline.vars.css.js";
import type { TimelineProps } from "./Timeline.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

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
    itemProps,
    bulletProps,
    lineProps,
    bodyProps,
    titleProps,
    metaProps,
    descriptionProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.bulletBg]: resolved.background,
    [variables.bulletFg]: resolved.foreground,
    [variables.bulletBorder]: resolved.borderColor,
    [variables.bulletSize]: `${String(bulletSize)}px`,
    [variables.lineWidth]: `${String(lineWidth)}px`,
  });

  return (
    <ol
      className={cx(styles.root, styles.align[align], sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
    >
      {items.map((item, index) => {
        const reached = index <= active;
        return (
          <Box
            component="li"
            key={index}
            data-reached={reached ? "true" : undefined}
            {...itemProps}
            className={cx(styles.item, itemProps?.className)}
          >
            <Box
              component="span"
              data-reached={reached ? "true" : undefined}
              {...bulletProps}
              className={cx(styles.bullet, bulletProps?.className)}
            >
              {item.bullet}
            </Box>
            <Box
              component="span"
              data-reached={index < active ? "true" : undefined}
              aria-hidden="true"
              {...lineProps}
              className={cx(styles.line, lineProps?.className)}
            />
            <Box {...bodyProps} className={cx(styles.body, bodyProps?.className)}>
              <Text
                component="span"
                {...titleProps}
                className={cx(styles.title, titleProps?.className)}
              >
                {item.title}
              </Text>
              {item.meta === undefined ? null : (
                <Text
                  component="span"
                  {...metaProps}
                  className={cx(styles.meta, metaProps?.className)}
                >
                  {item.meta}
                </Text>
              )}
              {item.description === undefined ? null : (
                <Text
                  component="span"
                  {...descriptionProps}
                  className={cx(styles.description, descriptionProps?.className)}
                >
                  {item.description}
                </Text>
              )}
              {reached ? <VisuallyHidden>{reachedLabel}</VisuallyHidden> : null}
            </Box>
          </Box>
        );
      })}
    </ol>
  );
}

Timeline.displayName = "Timeline";
