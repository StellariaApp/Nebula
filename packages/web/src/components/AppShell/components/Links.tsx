"use client";

import type { ReactElement, ReactNode } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { NavLink } from "../../NavLink/NavLink.js";
import type { NavLinkProps } from "../../NavLink/NavLink.types.js";
import { Text } from "../../Text/Text.js";

import * as styles from "../AppShell.css.js";
import type { AppShellLinksProps } from "../AppShell.types.js";

export function AppShellLinks(props: AppShellLinksProps): ReactElement {
  const { children, title, action, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <div className={cx(styles.link_group, sprinkle_class, className)} style={style} {...rest}>
      {title === undefined && action === undefined ? null : (
        <div className={styles.link_group_head}>
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
      <div className={styles.rail_nav}>{children}</div>
    </div>
  );
}

export function AppShellLink(props: NavLinkProps): ReactElement {
  const { py = "xxs", ...rest } = props;
  return <NavLink py={py} {...rest} />;
}

export function AppShellRailLabel(props: {
  children: ReactNode;
  className?: string | undefined;
}): ReactElement {
  const { children, className } = props;
  return <span className={cx(styles.rail_label, className)}>{children}</span>;
}
