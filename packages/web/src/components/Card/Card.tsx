"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { m, useReducedMotion, type MotionStyle } from "motion/react";

import { MotionOff, Spring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Image } from "../Image/Image.js";

import * as styles from "./Card.css.js";
import type { CardImageProps, CardProps, CardSectionProps, CardSlotProps } from "./Card.types.js";

const HOVER_LIFT = -2;

export function CardSection(props: CardSectionProps): ReactElement {
  const { children, inset = true, withBorder = false, className } = props;
  return (
    <div
      className={cx(inset && styles.sectionInset, withBorder && styles.sectionBorder, className)}
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
  const { children, className } = props;
  return <div className={cx(styles.badges, className)}>{children}</div>;
}

CardBadges.displayName = "CardBadges";

export function CardMeta(props: CardSlotProps): ReactElement {
  const { children, className } = props;
  return <div className={cx(styles.meta, className)}>{children}</div>;
}

CardMeta.displayName = "CardMeta";

export function CardActions(props: CardSlotProps): ReactElement {
  const { children, className } = props;
  return <div className={cx(styles.actions, className)}>{children}</div>;
}

CardActions.displayName = "CardActions";

export function Card(props: CardProps): ReactElement {
  const {
    children,
    radius = "md",
    shadow = "none",
    padding = "lg",
    withBorder = true,
    interactive: interactive_prop,
    onPress,
    href,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);

  const interactive = interactive_prop ?? (onPress !== undefined || href !== undefined);

  const class_name = cx(
    styles.card({ radius, shadow, padding, withBorder, interactive }),
    sprinkle_class,
    className,
  );

  const motion_props = {
    ...(sprinkle_style === undefined ? {} : { style: sprinkle_style as MotionStyle }),
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
