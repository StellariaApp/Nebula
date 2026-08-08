"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";
import { NavLink } from "../../NavLink/NavLink.js";
import type { NavLinkProps } from "../../NavLink/NavLink.types.js";
import { Text } from "../../Text/Text.js";

import * as styles from "../AppShell.css.js";
import type { AppShellLabelProps, AppShellLinksProps } from "../AppShell.types.js";

export function AppShellLinks(props: AppShellLinksProps): ReactElement {
  const {
    children,
    title,
    action,
    className,
    deep,
    headerProps,
    titleProps,
    contentProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <div className={cx(styles.links, sprinkle_class, className)} style={style} {...rest}>
      {title === undefined && action === undefined ? null : (
        <Box {...headerProps} className={cx(styles.links_header, headerProps?.className)}>
          {title === undefined ? (
            <span />
          ) : (
            <Text
              fz="caption"
              c="text.muted"
              tt="uppercase"
              ls="wide"
              fw="semibold"
              truncate
              {...titleProps}
            >
              {title}
            </Text>
          )}
          {action}
        </Box>
      )}
      <Box
        {...contentProps}
        className={cx(styles.links_content, deep && styles.links_deep, contentProps?.className)}
      >
        {children}
      </Box>
    </div>
  );
}

export function AppShellLink(props: NavLinkProps): ReactElement {
  return <NavLink {...props} className={cx(styles.link, props.className)} />;
}

export function AppShellLabel(props: AppShellLabelProps): ReactElement {
  const { children, className, flex, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <span
      className={cx(styles.label, sprinkle_class, className, flex && styles.label_flex)}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );
}
