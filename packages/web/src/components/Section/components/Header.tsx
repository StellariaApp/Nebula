import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../Section.css.js";
import type { SectionHeadingProps, SectionSlotProps } from "../Section.types.js";

export function SectionHeading(props: SectionHeadingProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <div className={cx(styles.heading, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </div>
  );
}

SectionHeading.displayName = "Section.Heading";

export function SectionHeader(props: SectionSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <Box className={cx(styles.head, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </Box>
  );
}

SectionHeader.displayName = "Section.Header";
