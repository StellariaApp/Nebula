import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Text } from "../../Text/Text.js";

import * as styles from "../Hero.css.js";
import type { HeroSlotProps } from "../Hero.types.js";

export function HeroHiper(props: HeroSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <Text className={cx(styles.hiper, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </Text>
  );
}

HeroHiper.displayName = "Hero.Hiper";
