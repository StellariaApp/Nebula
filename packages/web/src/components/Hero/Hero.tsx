"use client";

import { Children, isValidElement, useId, useMemo, type ReactElement, type ReactNode } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { ResolveVariant } from "../../theme/resolve-variant.js";
import { ContainsPart } from "../../utils/children.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";

import { HeroActions } from "./components/Actions.js";
import { HeroBody } from "./components/Body.js";
import { HeroBottom } from "./components/Bottom.js";
import { HeroDescription } from "./components/Description.js";
import { HeroHeader } from "./components/Header.js";
import { HeroHiper } from "./components/Hiper.js";
import { HeroLeft } from "./components/Left.js";
import { HeroRight } from "./components/Right.js";
import { HeroSubtitle } from "./components/Subtitle.js";
import { HeroTitle } from "./components/Title.js";
import { HeroContext } from "./Hero.context.js";
import * as styles from "./Hero.css.js";
import type { HeroProps } from "./Hero.types.js";
import * as variables from "./Hero.vars.css.js";

interface Split {
  left: ReactNode[];
  right: ReactNode[];
  bottom: ReactNode[];
  body: ReactNode[];
}

const REGIONS = new Map<unknown, keyof Split>([
  [HeroLeft, "left"],
  [HeroRight, "right"],
  [HeroBottom, "bottom"],
]);

function SplitChildren(children: ReactNode): Split {
  const split: Split = { left: [], right: [], bottom: [], body: [] };
  Children.forEach(children, (child) => {
    if (child === null || child === undefined || child === false) return;
    const region = isValidElement(child) ? REGIONS.get(child.type) : undefined;
    split[region ?? "body"].push(child);
  });
  return split;
}

const BODY_PARTS = new Set<unknown>([
  HeroHiper,
  HeroHeader,
  HeroTitle,
  HeroSubtitle,
  HeroDescription,
  HeroActions,
]);

function HasBodyPart(nodes: readonly ReactNode[]): boolean {
  return nodes.some((node) => isValidElement(node) && BODY_PARTS.has(node.type));
}

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
    order,
    contentWidth = DEFAULT_WIDTH,
    actions,
    left,
    right,
    bottom,
    children,
    className,
    titleProps,
    subtitleProps,
    headerProps,
    hiperProps,
    descriptionProps,
    actionsProps,
    bodyProps,
    leftProps,
    rightProps,
    bottomProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const has_image = image !== undefined;

  const title_id = useId();
  const parts = useMemo(() => SplitChildren(children), [children]);
  const owns_body = HasBodyPart(parts.body);
  const has_title = title !== undefined;
  const names_region = useMemo(
    () => has_title || ContainsPart(children, HeroTitle),
    [has_title, children],
  );
  const context = useMemo(() => ({ titleId: title_id, order, size }), [title_id, order, size]);

  const css_vars = assignInlineVars({
    [variables.contentMax]: LengthToCss(contentWidth),
    [variables.bg]: resolved.background,
    [variables.fg]: color === "transparent" ? vars.color.text.primary : resolved.foreground,
    [variables.borderColor]: resolved.borderColor,
    [variables.borderWidth]: resolved.borderWidth,
    [variables.backdropFilter]: resolved.backdropFilter,
    [variables.veil]: has_image
      ? `color-mix(in srgb, ${resolved.background} ${String(Math.round(overlayOpacity * 100))}%, transparent)`
      : "transparent",
  });

  return (
    <HeroContext.Provider value={context}>
      <section
        className={cx(styles.hero, styles.size[size], sprinkle_class, className)}
        style={{ ...css_vars, ...sprinkle_style }}
        data-variant={variant}
        data-align={align}
        {...(names_region ? { "aria-labelledby": title_id } : {})}
        {...rest}
      >
        {has_image ? (
          <>
            <img className={styles.media} src={image} alt={imageAlt} />
            <span className={styles.scrim} aria-hidden="true" />
          </>
        ) : null}

        {parts.left.length > 0 ? (
          parts.left
        ) : left === undefined ? null : (
          <HeroLeft {...leftProps}>{left}</HeroLeft>
        )}

        <HeroBody {...bodyProps}>
          {owns_body ? (
            parts.body
          ) : (
            <>
              {hiper === undefined ? null : typeof hiper === "string" ? (
                <HeroHiper {...hiperProps}>{hiper}</HeroHiper>
              ) : (
                hiper
              )}
              <HeroHeader {...headerProps}>
                {has_title ? <HeroTitle {...titleProps}>{title}</HeroTitle> : null}
                {subtitle === undefined ? null : (
                  <HeroSubtitle {...subtitleProps}>{subtitle}</HeroSubtitle>
                )}
                {description === undefined ? null : (
                  <HeroDescription {...descriptionProps}>{description}</HeroDescription>
                )}
              </HeroHeader>
              {parts.body}
              {actions === undefined ? null : (
                <HeroActions {...actionsProps}>{actions}</HeroActions>
              )}
            </>
          )}
          {parts.bottom.length > 0 ? (
            parts.bottom
          ) : bottom === undefined ? null : (
            <HeroBottom {...bottomProps}>{bottom}</HeroBottom>
          )}
        </HeroBody>

        {parts.right.length > 0 ? (
          parts.right
        ) : right === undefined ? null : (
          <HeroRight {...rightProps}>{right}</HeroRight>
        )}
      </section>
    </HeroContext.Provider>
  );
}

Hero.displayName = "Hero";
