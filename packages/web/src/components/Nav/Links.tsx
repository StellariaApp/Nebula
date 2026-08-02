"use client";

import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m } from "motion/react";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { NavLinksContext, useNavLinks } from "./Nav.context.js";
import * as styles from "./Nav.css.js";
import { NAV_LABELS } from "./labels.js";
import type { NavLinkItemProps, NavLinksProps } from "./Nav.types.js";
import { indicatorBg, indicatorBorder, indicatorFg } from "./Nav.vars.css.js";
import { useNavActive, type NavItem } from "./use-nav-active.js";
import { useNavIndicator } from "./use-nav-indicator.js";
import { useStickyChrome } from "./use-sticky-chrome.js";

export function NavLinksLink(props: NavLinkItemProps): ReactElement {
  const {
    children,
    component,
    href,
    active,
    disabled = false,
    onPress,
    leftSection,
    rightSection,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const group = useNavLinks();
  const is_active = active ?? (href !== undefined && group?.activeHref === href);
  const aria_current = href !== undefined && href.startsWith("#") ? "location" : "page";

  const Element = component ?? (href === undefined ? "button" : "a");
  const item_ref = href === undefined ? undefined : group?.SetItemRef(href);

  return (
    <Element
      ref={item_ref}
      className={cx(styles.link, sprinkle_class, className)}
      style={sprinkle_style}
      data-active={is_active ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      {...(Element === "button" ? { type: "button" } : {})}
      {...(href === undefined || disabled ? {} : { href })}
      {...(disabled ? { "aria-disabled": true } : {})}
      {...(is_active ? { "aria-current": aria_current } : {})}
      {...(onPress === undefined || disabled ? {} : { onClick: onPress })}
      {...rest}
    >
      {leftSection === undefined || leftSection === null ? null : leftSection}
      {children}
      {rightSection === undefined || rightSection === null ? null : rightSection}
    </Element>
  );
}

NavLinksLink.displayName = "NavLinksLink";

function CollectItems(children: ReactNode, out: NavItem[]): void {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === NavLinksLink) {
      const item = child.props as NavLinkItemProps;
      if (typeof item.href === "string") out.push({ href: item.href, active: item.active });
      return;
    }

    if (child.type === Fragment) {
      CollectItems((child.props as { children?: ReactNode }).children, out);
    }
  });
}

export function NavLinks(props: NavLinksProps): ReactElement {
  const {
    children,
    active,
    activeMode = "auto",
    align = "center",
    spyOffset,
    variant = "light",
    color = "primary",
    withIndicator = true,
    labels,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const items = useMemo(() => {
    const collected: NavItem[] = [];
    CollectItems(children, collected);
    return collected;
  }, [children]);

  const list_ref = useRef<HTMLElement>(null);
  const chrome = useStickyChrome(list_ref);

  const resolved_active = useNavActive(items, {
    mode: activeMode,
    active,
    offset: spyOffset,
    chrome,
  });

  const indicator = useNavIndicator(withIndicator ? resolved_active.href : undefined);

  const SetRoot = useCallback(
    (node: HTMLElement | null): void => {
      list_ref.current = node;
      indicator.containerRef(node);
    },
    [indicator],
  );

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [indicatorBg]: resolved.background,
    [indicatorBorder]: resolved.borderColor,
    [indicatorFg]: resolved.foreground,
  });

  const text = useMemo(
    () => (labels === undefined ? NAV_LABELS : { ...NAV_LABELS, ...labels }),
    [labels],
  );

  const context = useMemo(
    () => ({
      activeHref: resolved_active.href,
      mode: resolved_active.mode,
      SetItemRef: indicator.SetItemRef,
    }),
    [resolved_active.href, resolved_active.mode, indicator.SetItemRef],
  );

  return (
    <nav
      ref={SetRoot}
      aria-label={aria_label ?? text.links}
      className={cx(styles.links({ align }), sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-mode={resolved_active.mode}
      {...rest}
    >
      {withIndicator ? (
        <m.span
          aria-hidden="true"
          className={styles.indicator}
          style={{
            x: indicator.x,
            width: indicator.width,
            top: indicator.y,
            height: indicator.height,
          }}
          initial={false}
          animate={{ opacity: indicator.ready ? 1 : 0 }}
          transition={indicator.ready ? indicator.fadeIn : indicator.fadeOut}
        />
      ) : null}
      <NavLinksContext.Provider value={context}>{children}</NavLinksContext.Provider>
    </nav>
  );
}

NavLinks.displayName = "NavLinks";
