"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
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
    titleProps,
    descriptionProps,
    iconProps,
    illustrationProps,
    actionsProps,
    footerProps,
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
        <Box
          aria-hidden="true"
          {...illustrationProps}
          className={cx(styles.media, styles.illustration[size], illustrationProps?.className)}
        >
          {illustration}
        </Box>
      )}
      <EmptyState
        title={title}
        size={size}
        {...(description === undefined ? {} : { description })}
        {...(icon === undefined ? {} : { icon })}
        {...(titleProps === undefined ? {} : { titleProps })}
        {...(descriptionProps === undefined ? {} : { descriptionProps })}
        {...(iconProps === undefined ? {} : { iconProps })}
        {...(has_actions
          ? {
              actions: (
                <Box
                  component="span"
                  {...actionsProps}
                  className={cx(styles.actions, actionsProps?.className)}
                >
                  {action}
                  {secondaryAction}
                </Box>
              ),
            }
          : {})}
      />
      {footer === undefined || footer === null ? null : (
        <Box {...footerProps} className={cx(styles.footer, footerProps?.className)}>
          {footer}
        </Box>
      )}
    </section>
  );
}

EmptyModule.displayName = "EmptyModule";
