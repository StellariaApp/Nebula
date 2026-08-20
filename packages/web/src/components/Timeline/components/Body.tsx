import type { CSSProperties, ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";
import { Text } from "../../Text/Text.js";
import { VisuallyHidden } from "../../VisuallyHidden/VisuallyHidden.js";

import * as styles from "../Timeline.css.js";
import type { TimelineProps } from "../Timeline.types.js";
import * as variables from "../Timeline.vars.css.js";

export interface TimelineBodyProps extends Omit<TimelineProps, "color" | "variant"> {
  /** La clase de la matriz cuando el color es una escala que el tema conoce (ADR-150). */
  tone?: string | undefined;
  /** Las vars en linea cuando el color es arbitrario y hay que resolverlo con el tema. */
  toneStyle?: CSSProperties | undefined;
}

export function TimelineBody(props: TimelineBodyProps): ReactElement {
  const {
    items,
    active = -1,
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
    tone,
    toneStyle,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const metrics = assignInlineVars({
    [variables.bulletSize]: `${String(bulletSize)}px`,
    [variables.lineWidth]: `${String(lineWidth)}px`,
  });

  return (
    <ol
      className={cx(styles.root, styles.align[align], tone, sprinkle_class, className)}
      style={{ ...toneStyle, ...metrics, ...sprinkle_style }}
    >
      {items.map((item, index) => {
        const reached = index <= active;
        return (
          <Box
            component="li"
            key={index}
            data-reached={reached ? "true" : undefined}
            {...itemProps}
            reveal={{ index }}
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

TimelineBody.displayName = "Timeline.Body";
