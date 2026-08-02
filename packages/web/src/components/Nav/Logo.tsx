"use client";

import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";

import * as styles from "./Nav.css.js";
import type { NavLogoProps } from "./Nav.types.js";
import { logoHeight } from "./Nav.vars.css.js";

export function NavLogo(props: NavLogoProps): ReactElement {
  const {
    children,
    component,
    href,
    height,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const Element = component ?? (href === undefined ? "span" : "a");
  const css_vars =
    height === undefined ? {} : assignInlineVars({ [logoHeight]: LengthToCss(height) });
  const has_role = href !== undefined || component !== undefined;

  return (
    <Element
      className={cx(styles.logo, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      {...(href === undefined ? {} : { href })}
      {...(has_role && aria_label !== undefined ? { "aria-label": aria_label } : {})}
      {...rest}
    >
      {children}
    </Element>
  );
}

NavLogo.displayName = "NavLogo";
