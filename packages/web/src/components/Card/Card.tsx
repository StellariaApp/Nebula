"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { m, useReducedMotion, type MotionStyle } from "motion/react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { MotionOff, Spring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Image } from "../Image/Image.js";

import * as styles from "./Card.css.js";
import type { CardImageProps, CardProps, CardSectionProps, CardSlotProps } from "./Card.types.js";
import * as variables from "./Card.vars.css.js";

const HOVER_LIFT = -2;

export function CardSection(props: CardSectionProps): ReactElement {
  const { children, inset = true, withBorder = false, className } = props;
  return (
    <div
      className={cx(inset && styles.section_inset, withBorder && styles.section_border, className)}
    >
      {children}
    </div>
  );
}

CardSection.displayName = "CardSection";

export function CardImage(props: CardImageProps): ReactElement {
  const { src, alt, height = 180, className } = props;
  return (
    <CardSection>
      <Image
        {...(src === undefined ? {} : { src })}
        alt={alt}
        height={height}
        radius={0}
        {...(className === undefined ? {} : { className })}
      />
    </CardSection>
  );
}

CardImage.displayName = "CardImage";

export function CardBadges(props: CardSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <div className={cx(styles.badges, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </div>
  );
}

CardBadges.displayName = "CardBadges";

export function CardMeta(props: CardSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <div className={cx(styles.meta, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </div>
  );
}

CardMeta.displayName = "CardMeta";

export function CardActions(props: CardSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <div className={cx(styles.actions, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </div>
  );
}

CardActions.displayName = "CardActions";

export function Card(props: CardProps): ReactElement {
  const {
    children,
    variant,
    color = "primary",
    r = "md",
    shadow = "none",
    padding = "lg",
    withBorder = true,
    glass = "subtle",
    interactive: interactive_prop,
    onPress,
    href,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps({ r, ...style_rest });

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);

  const interactive = interactive_prop ?? (onPress !== undefined || href !== undefined);

  const resolved =
    variant === undefined ? null : ResolveVariant(variant, color, theme, undefined, glass);

  const class_name = cx(
    styles.card({
      shadow,
      padding,
      withBorder: withBorder || resolved?.borderWidth === "1px",
      interactive,
      glowing: resolved !== null && resolved.glow !== "none",
    }),
    sprinkle_class,
    className,
  );

  const variant_vars =
    resolved === null
      ? {}
      : assignInlineVars({
          [variables.bg]: resolved.background,
          [variables.fg]: resolved.foreground,
          [variables.borderColor]: resolved.borderColor,
          [variables.backdropFilter]: resolved.backdropFilter,
          [variables.glow]: resolved.glow,
        });

  const root_style = { ...variant_vars, ...sprinkle_style } as MotionStyle;

  const motion_props = {
    style: root_style,
    ...(is_off || !interactive
      ? {}
      : {
          whileHover: { y: HOVER_LIFT },
          whileTap: { scale: 0.995 },
          transition: Spring("gentle", motion_context),
        }),
  };

  return href !== undefined ? (
    <m.a
      {...motion_props}
      href={href}
      className={class_name}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
    >
      {children}
    </m.a>
  ) : onPress !== undefined ? (
    <m.button
      {...motion_props}
      type="button"
      className={class_name}
      onClick={onPress}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
    >
      {children}
    </m.button>
  ) : (
    <m.div
      {...motion_props}
      className={class_name}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
    >
      {children}
    </m.div>
  );
}

Card.displayName = "Card";
