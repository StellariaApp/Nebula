import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Text } from "../../Text/Text.js";

import * as styles from "../Section.css.js";
import type { SectionSlotProps } from "../Section.types.js";

export function SectionDescription(props: SectionSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <Text className={cx(styles.description, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </Text>
  );
}

SectionDescription.displayName = "Section.Description";
