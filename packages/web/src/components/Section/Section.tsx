"use client";

import { useId, type ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Alert } from "../Alert/Alert.js";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay.js";

import * as styles from "./Section.css.js";
import type { SectionProps } from "./Section.types.js";

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
    isEmpty = false,
    order = 2,
    divided = false,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const title_id = useId();
  const has_title = title !== undefined;
  const Heading = `h${String(order)}` as "h2";

  const labelling = has_title
    ? { "aria-labelledby": title_id }
    : aria_label === undefined
      ? {}
      : { "aria-label": aria_label };

  return (
    <section
      className={cx(styles.section, sprinkle_class, className)}
      style={sprinkle_style}
      data-divided={divided ? "true" : undefined}
      {...labelling}
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
    </section>
  );
}

Section.displayName = "Section";
