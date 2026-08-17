import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Title } from "../../Title/Title.js";

import * as styles from "../Hero.css.js";
import type { HeroOrder, HeroSlotProps } from "../Hero.types.js";

export interface HeroTitleProps extends Omit<HeroSlotProps, "order"> {
  /**
   * The heading level. `<Hero title>` passes it for you; writing the title by hand means passing it
   * yourself, because the root cannot reach an element it did not create (ADR-156).
   */
  order?: HeroOrder | undefined;
  /** What `aria-labelledby` on the root points at. Same rule as `order`. */
  id?: string | undefined;
}

export function HeroTitle(props: HeroTitleProps): ReactElement {
  const { children, className, order, id, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);

  return (
    <Title
      {...(id === undefined ? {} : { id })}
      order={order}
      className={cx(styles.title, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </Title>
  );
}

HeroTitle.displayName = "Hero.Title";
