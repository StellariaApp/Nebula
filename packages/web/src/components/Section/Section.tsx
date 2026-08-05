"use client";

import { useId, type ElementType, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m } from "motion/react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Alert } from "../Alert/Alert.js";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay.js";
import { useReveal } from "../Reveal/use-reveal.js";

import * as styles from "./Section.css.js";
import type { SectionProps } from "./Section.types.js";
import * as variables from "./Section.vars.css.js";

const DEFAULT_WIDTH = 1180;

export function Section(props: SectionProps): ReactElement {
  const {
    children,
    title,
    description,
    actions,
    aside,
    footer,
    loading = false,
    error,
    empty,
    size = "md",
    isEmpty = false,
    order = 2,
    divided = false,
    glass = false,
    reveal = false,
    contentWidth = DEFAULT_WIDTH,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const title_id = useId();
  const has_title = title !== undefined;
  const Heading = `h${String(order)}` as "h2";

  const labelling = has_title
    ? { "aria-labelledby": title_id }
    : aria_label === undefined
      ? {}
      : { "aria-label": aria_label };

  const rail_vars = assignInlineVars({ [variables.contentMax]: LengthToCss(contentWidth) });
  const revealed = useReveal();
  const animating = reveal && revealed.armed;
  const Root: ElementType = animating ? m.section : "section";

  return (
    <Root
      {...(reveal ? { ref: revealed.ref } : {})}
      className={cx(styles.section, styles.size[size], sprinkle_class, className)}
      style={{ ...rail_vars, ...sprinkle_style }}
      data-glass={glass ? "true" : undefined}
      data-reveal={reveal ? revealed["data-reveal"] : undefined}
      {...(animating
        ? {
            initial: revealed.initial,
            animate: revealed.animate,
            transition: revealed.transition,
          }
        : {})}
      {...labelling}
      {...rest}
    >
      <div
        className={cx(styles.rail, styles.rail_size[size])}
        data-divided={divided ? "true" : undefined}
      >
        {has_title || description !== undefined || actions !== undefined ? (
          <div className={styles.head}>
            <div className={styles.heading}>
              {has_title ? (
                <Heading className={styles.title} id={title_id}>
                  {title}
                </Heading>
              ) : null}
              {description === undefined ? null : (
                <p className={styles.description}>{description}</p>
              )}
            </div>
            {actions === undefined && aside === undefined ? null : (
              <div className={styles.actions}>
                {aside}
                {actions}
              </div>
            )}
          </div>
        ) : null}

        <div className={styles.body}>
          {error !== undefined ? (
            typeof error === "string" ? (
              <Alert color="error" live="alert">
                {error}
              </Alert>
            ) : (
              error
            )
          ) : isEmpty && empty !== undefined ? (
            empty
          ) : (
            children
          )}
          <LoadingOverlay visible={loading} />
        </div>

        {footer === undefined ? null : <div className={styles.foot}>{footer}</div>}
      </div>
    </Root>
  );
}

Section.displayName = "Section";
