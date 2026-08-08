"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Title } from "../../Title/Title.js";

import * as styles from "../Hero.css.js";
import { useHero } from "../Hero.context.js";
import type { HeroSlotProps } from "../Hero.types.js";

export function HeroTitle(props: HeroSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  const hero = useHero();

  return (
    <Title
      order={hero.order}
      id={hero.titleId}
      className={cx(styles.title, styles.title_size[hero.size], sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </Title>
  );
}

HeroTitle.displayName = "Hero.Title";
