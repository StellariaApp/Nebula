"use client";

import { useId, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Text } from "../Text/Text.js";
import { Title } from "../Title/Title.js";
import { GlassSurface } from "../GlassSurface/GlassSurface.js";

import * as styles from "./AppShell.css.js";
import { chromeHeight, railWidth } from "./AppShell.css.js";
import type {
  AppShellContentProps,
  AppShellHeaderProps,
  AppShellRailProps,
  AppShellSectionProps,
  AppShellSidebarProps,
  AppShellSubbarProps,
} from "./AppShell.types.js";

const DEFAULT_LABELS = {
  skipToContent: "Saltar al contenido",
  navigation: "Navegación principal",
  complementary: "Complementario",
};

const SIDEBAR_WIDTH = 336;
const CHROME_HEIGHT = 72;

export function AppShellRail(props: AppShellRailProps): ReactElement {
  const {
    children,
    sidebar,
    backdrop,
    sidebarWidth = SIDEBAR_WIDTH,
    chromeHeight: chrome = CHROME_HEIGHT,
    labels,
    contentId,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const auto_id = useId();
  const content_id = contentId ?? `shell-content-${auto_id}`;
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <div
      className={cx(styles.rail, sprinkle_class, className)}
      style={{
        ...assignInlineVars({
          [railWidth]: `${String(sidebarWidth)}px`,
          [chromeHeight]: `${String(chrome)}px`,
        }),
        ...sprinkle_style,
      }}
    >
      <a href={`#${content_id}`} className={styles.skip}>
        {text.skipToContent}
      </a>

      {backdrop}
      {sidebar}

      <div className={styles.railMain} id={content_id}>
        {children}
      </div>
    </div>
  );
}

export function AppShellSidebar(props: AppShellSidebarProps): ReactElement {
  const { children, top, bottom, level = "subtle", className, ...rest } = props;
  return (
    <GlassSurface
      component="aside"
      level={level}
      radius={0}
      className={cx(styles.sidebar, className)}
      {...rest}
    >
      {top === undefined ? null : (
        <div className={cx(styles.sidebarSlot, styles.sidebarTop)}>{top}</div>
      )}
      <div className={styles.sidebarBody}>{children}</div>
      {bottom === undefined ? null : (
        <div className={cx(styles.sidebarSlot, styles.sidebarBottom)}>{bottom}</div>
      )}
    </GlassSurface>
  );
}

export function AppShellSection(props: AppShellSectionProps): ReactElement {
  const { children, className, ...rest } = props;
  return (
    <section className={cx(styles.section, className)} {...rest}>
      {children}
    </section>
  );
}

export function AppShellHeader(props: AppShellHeaderProps): ReactElement {
  const { title, subtitle, order = 2, actions, children, level = "default", className } = props;
  return (
    <GlassSurface
      component="header"
      level={level}
      radius={0}
      className={cx(styles.sectionHeader, className)}
    >
      {children ?? (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          {title === undefined ? null : (
            <Title order={order} fz="h5">
              {title}
            </Title>
          )}
          {subtitle === undefined ? null : (
            <Text fz="body3" c="text.secondary">
              {subtitle}
            </Text>
          )}
        </div>
      )}
      {actions}
    </GlassSurface>
  );
}

export function AppShellSubbar(props: AppShellSubbarProps): ReactElement {
  const { children, level = "control", className } = props;
  return (
    <GlassSurface level={level} radius={0} className={cx(styles.sectionSub, className)}>
      {children}
    </GlassSurface>
  );
}

export function AppShellContent(props: AppShellContentProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <div className={cx(styles.content, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </div>
  );
}
