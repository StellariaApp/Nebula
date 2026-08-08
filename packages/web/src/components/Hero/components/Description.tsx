import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Text } from "../../Text/Text.js";

import * as styles from "../Hero.css.js";
import type { HeroSlotProps } from "../Hero.types.js";

export function HeroDescription(props: HeroSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <Text
      inherit
      className={cx(styles.description, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </Text>
  );
}

HeroDescription.displayName = "Hero.Description";
