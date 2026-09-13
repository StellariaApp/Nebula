import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { EmptyState } from "../EmptyState/EmptyState.js";
import { GlassSurface } from "../GlassSurface/GlassSurface.js";

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
    layout = "stack",
    fill = false,
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
  const is_side = layout === "side";

  const root_props = {
    className: cx(
      styles.root,
      styles.surface[surface],
      is_side && styles.side,
      fill && styles.fill,
      sprinkle_class,
      className,
    ),
    style: sprinkle_style,
    "data-surface": surface,
    "data-layout": is_side ? "side" : undefined,
    "data-fill": fill ? "true" : undefined,
  };

  const body = (
    <>
      {illustration === undefined || illustration === null ? null : (
        <Box
          aria-hidden="true"
          {...illustrationProps}
          className={cx(
            styles.media,
            styles.illustration[size],
            is_side && styles.media_side,
            illustrationProps?.className,
          )}
        >
          {illustration}
        </Box>
      )}
      <EmptyState
        title={title}
        size={size}
        {...(is_side ? { className: styles.state_side } : {})}
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
    </>
  );

  if (surface === "glass") {
    return (
      <GlassSurface component="section" level="strong" r="lg" {...root_props}>
        {body}
      </GlassSurface>
    );
  }

  return <section {...root_props}>{body}</section>;
}

EmptyModule.displayName = "EmptyModule";
