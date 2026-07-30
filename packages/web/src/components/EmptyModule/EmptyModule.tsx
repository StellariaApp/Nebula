"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { EmptyState } from "../EmptyState/EmptyState.js";

import * as styles from "./EmptyModule.css.js";
import type { EmptyModuleProps } from "./EmptyModule.types.js";

export function EmptyModule(props: EmptyModuleProps): ReactElement {
  const {
    title,
    description,
    illustration,
    icon,
    action,
    secondaryAction,
    footer,
    size = "md",
    surface = "dashed",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const has_actions = action !== undefined || secondaryAction !== undefined;

  return (
    <section
      className={cx(styles.root, styles.surface[surface], sprinkle_class, className)}
      style={sprinkle_style}
      data-surface={surface}
    >
      {illustration === undefined || illustration === null ? null : (
        <div className={cx(styles.media, styles.illustration[size])} aria-hidden="true">
          {illustration}
        </div>
      )}
      <EmptyState
        title={title}
        size={size}
        {...(description === undefined ? {} : { description })}
        {...(icon === undefined ? {} : { icon })}
        {...(has_actions
          ? {
              actions: (
                <span className={styles.actions}>
                  {action}
                  {secondaryAction}
                </span>
              ),
            }
          : {})}
      />
      {footer === undefined || footer === null ? null : (
        <div className={styles.footer}>{footer}</div>
      )}
    </section>
  );
}

EmptyModule.displayName = "EmptyModule";
