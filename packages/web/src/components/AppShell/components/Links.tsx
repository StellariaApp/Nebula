"use client";

import type { ReactElement, ReactNode } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { NavLink } from "../../NavLink/NavLink.js";
import type { NavLinkProps } from "../../NavLink/NavLink.types.js";
import { Text } from "../../Text/Text.js";

import * as styles from "../AppShell.css.js";
import type { AppShellLinksProps } from "../AppShell.types.js";

export function AppShellLinks(props: AppShellLinksProps): ReactElement {
  const { children, title, action, className, deep, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <div className={cx(styles.links, sprinkle_class, className)} style={style} {...rest}>
      {title === undefined && action === undefined ? null : (
        <div className={styles.links_header}>
          {title === undefined ? (
            <span />
          ) : (
            <Text fz="caption" c="text.muted" tt="uppercase" ls="wide" fw="semibold" truncate>
              {title}
            </Text>
          )}
          {action}
        </div>
      )}
      <div className={cx(styles.links_content, deep && styles.links_deep)}>{children}</div>
    </div>
  );
}

export function AppShellLink(props: NavLinkProps): ReactElement {
  return <NavLink className={cx(styles.link, props.className)} {...props} />;
}

export function AppShellLabel(props: {
  children: ReactNode;
  className?: string | undefined;
  flex?: boolean | undefined;
}): ReactElement {
  const { children, className, flex } = props;
  return <span className={cx(styles.label, className, flex && styles.label_flex)}>{children}</span>;
}
