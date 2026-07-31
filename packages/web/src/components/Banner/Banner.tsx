"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Banner.css.js";
import type { BannerProps } from "./Banner.types.js";
import { backdropFilter, bg, borderColor, borderWidth, fg, veil } from "./Banner.vars.css.js";

export function Banner(props: BannerProps): ReactElement {
  const {
    title,
    subtitle,
    hiper,
    description,
    image,
    imageAlt = "",
    overlayOpacity = 0.55,
    variant = "light",
    color = "primary",
    size = "md",
    align = "start",
    actions,
    left,
    right,
    bottom,
    children,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const has_image = image !== undefined;

  const css_vars = assignInlineVars({
    [bg]: resolved.background,
    [fg]: resolved.foreground,
    [borderColor]: resolved.borderColor,
    [borderWidth]: resolved.borderWidth,
    [backdropFilter]: resolved.backdropFilter,
    [veil]: has_image
      ? `color-mix(in srgb, ${resolved.background} ${String(Math.round(overlayOpacity * 100))}%, transparent)`
      : "transparent",
  });

  return (
    <section
      className={cx(styles.banner, styles.size[size], sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-variant={variant}
      data-align={align}
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
        {title === undefined ? null : (
          <p className={cx(styles.title, styles.titleSize[size])}>{title}</p>
        )}
        {subtitle === undefined ? null : <p className={styles.subtitle}>{subtitle}</p>}
        {description === undefined ? null : (
          <p className={styles.description}>{description}</p>
        )}
        {children}
        {actions === undefined ? null : <div className={styles.actions}>{actions}</div>}
      </div>

      {right === undefined ? null : <div className={styles.slot}>{right}</div>}
      {bottom === undefined ? null : <div className={styles.bottom}>{bottom}</div>}
    </section>
  );
}

Banner.displayName = "Banner";
