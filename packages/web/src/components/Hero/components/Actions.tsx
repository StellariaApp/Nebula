import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../Hero.css.js";
import type { HeroSlotProps } from "../Hero.types.js";

export function HeroActions(props: HeroSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <Box className={cx(styles.actions, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </Box>
  );
}

HeroActions.displayName = "Hero.Actions";
