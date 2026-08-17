import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Image } from "../Image/Image.js";

import * as styles from "./Card.css.js";
import type { CardImageProps, CardProps, CardSectionProps, CardSlotProps } from "./Card.types.js";
import { CardSurface } from "./components/Surface.js";

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
        r={0}
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
  return <CardSurface {...props} />;
}

Card.displayName = "Card";
