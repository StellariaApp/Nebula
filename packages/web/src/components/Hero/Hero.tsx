"use client";

import { useId, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";

import * as styles from "./Hero.css.js";
import type { HeroProps } from "./Hero.types.js";
import {
  backdropFilter,
  bg,
  borderColor,
  borderWidth,
  contentMax,
  fg,
  veil,
} from "./Hero.vars.css.js";

const DEFAULT_WIDTH = 1400;

export function Hero(props: HeroProps): ReactElement {
  const {
    title,
    subtitle,
    hiper,
    description,
    image,
    imageAlt = "",
    overlayOpacity = 0.55,
    variant = "filled",
    color = "transparent",
    size = "lg",
    align = "start",
    order = 1,
    contentWidth = DEFAULT_WIDTH,
    actions,
    left,
    right,
    bottom,
    children,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const has_image = image !== undefined;

  const title_id = useId();
  const Title = `h${String(order)}` as "h2";

  const css_vars = assignInlineVars({
    [contentMax]: LengthToCss(contentWidth),
    [bg]: resolved.background,
    [fg]: color === "transparent" ? theme.colors.text.primary : resolved.foreground,
    [borderColor]: resolved.borderColor,
    [borderWidth]: resolved.borderWidth,
    [backdropFilter]: resolved.backdropFilter,
    [veil]: has_image
      ? `color-mix(in srgb, ${resolved.background} ${String(Math.round(overlayOpacity * 100))}%, transparent)`
      : "transparent",
  });

  return (
    <section
      className={cx(styles.hero, styles.size[size], sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-variant={variant}
      data-align={align}
      {...(title === undefined ? {} : { "aria-labelledby": title_id })}
      {...rest}
    >
      {has_image ? (
        <>
          <img className={styles.media} src={image} alt={imageAlt} />
          <span className={styles.scrim} aria-hidden="true" />
        </>
      ) : null}

      {left === undefined ? null : <div className={styles.slot}>{left}</div>}

      <div className={styles.body}>
        {hiper === undefined ? null : <p className={styles.hiper}>{hiper}</p>}
        <div className={styles.header}>
          {title === undefined ? null : (
            <Title className={cx(styles.title, styles.titleSize[size])} id={title_id}>
              {title}
            </Title>
          )}
          {subtitle === undefined ? null : <p className={styles.subtitle}>{subtitle}</p>}
          {description === undefined ? null : <p className={styles.description}>{description}</p>}
        </div>
        {children}
        {actions === undefined ? null : <div className={styles.actions}>{actions}</div>}
      </div>

      {right === undefined ? null : <div className={styles.slot}>{right}</div>}
      {bottom === undefined ? null : <div className={styles.bottom}>{bottom}</div>}
    </section>
  );
}

Hero.displayName = "Hero";
