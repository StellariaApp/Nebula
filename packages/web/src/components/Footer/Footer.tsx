import {
  Children,
  isValidElement,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { SpaceToCss, LengthToCss } from "../../utils/token-css.js";

import * as styles from "./Footer.css.js";
import type {
  FooterBrandProps,
  FooterGroupProps,
  FooterLegalProps,
  FooterLinkProps,
  FooterProps,
} from "./Footer.types.js";
import * as variables from "./Footer.vars.css.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const DEFAULT_WIDTH = 1180;

export function FooterBrand(props: FooterBrandProps): ReactElement {
  const {
    children,
    logo,
    description,
    href,
    component,
    className,
    linkProps,
    descriptionProps,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const Mark = component ?? (href === undefined ? "span" : "a");
  const has_role = href !== undefined || component !== undefined;

  return (
    <div className={cx(styles.brand, sprinkle_class, className)} style={sprinkle_style} {...rest}>
      {logo === undefined ? null : (
        <Mark
          {...linkProps}
          className={cx(styles.brand_link, linkProps?.className)}
          {...(href === undefined ? {} : { href })}
          {...(has_role && aria_label !== undefined ? { "aria-label": aria_label } : {})}
        >
          {logo}
        </Mark>
      )}
      {description === undefined ? null : (
        <Text
          {...descriptionProps}
          className={cx(styles.brand_description, descriptionProps?.className)}
        >
          {description}
        </Text>
      )}
      {children}
    </div>
  );
}

FooterBrand.displayName = "FooterBrand";

export function FooterLink(props: FooterLinkProps): ReactElement {
  const { children, component, href, onPress, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const Element = component ?? (href === undefined ? "button" : "a");

  return (
    <li>
      <Element
        className={cx(styles.link, sprinkle_class, className)}
        style={sprinkle_style}
        {...(Element === "button" ? { type: "button" } : {})}
        {...(href === undefined ? {} : { href })}
        {...(onPress === undefined ? {} : { onClick: onPress })}
        {...rest}
      >
        {children}
      </Element>
    </li>
  );
}

FooterLink.displayName = "FooterLink";

export function FooterGroup(props: FooterGroupProps): ReactElement {
  const { children, title, className, titleProps, listProps, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const has_links = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === FooterLink,
  );

  return (
    <div className={cx(styles.group, sprinkle_class, className)} style={sprinkle_style} {...rest}>
      {title === undefined ? null : (
        <Text {...titleProps} className={cx(styles.group_title, titleProps?.className)}>
          {title}
        </Text>
      )}
      {has_links ? (
        <Box component="ul" {...listProps} className={cx(styles.group_list, listProps?.className)}>
          {children}
        </Box>
      ) : (
        children
      )}
    </div>
  );
}

FooterGroup.displayName = "FooterGroup";

export function FooterLegal(props: FooterLegalProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  return (
    <div className={cx(styles.legal, sprinkle_class, className)} style={sprinkle_style} {...rest}>
      {children}
    </div>
  );
}

FooterLegal.displayName = "FooterLegal";

export function Footer(props: FooterProps): ReactElement {
  const {
    children,
    component,
    contentWidth = DEFAULT_WIDTH,
    spacing,
    sticky = false,
    glass = false,
    withBorder = true,
    className,
    columnsProps,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const css_vars = assignInlineVars({
    [variables.contentMax]: LengthToCss(contentWidth),
    ...(spacing === undefined ? {} : { [variables.contentGap]: SpaceToCss(spacing) }),
  });

  const legal: ReactNode[] = [];
  const columns: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === FooterLegal) legal.push(child);
    else if (child !== null && child !== undefined && child !== false) columns.push(child);
  });

  const Root: ElementType = component ?? "footer";

  return (
    <Root
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-sticky={sticky ? "true" : undefined}
      data-glass={glass ? "true" : undefined}
      data-with-border={withBorder ? "true" : undefined}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
      {...rest}
    >
      <div className={styles.inner}>
        {columns.length === 0 ? null : (
          <Box {...columnsProps} className={cx(styles.columns, columnsProps?.className)}>
            {columns}
          </Box>
        )}
        {legal}
      </div>
    </Root>
  );
}

Footer.displayName = "Footer";
