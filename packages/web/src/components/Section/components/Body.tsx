import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../Section.css.js";
import type { SectionSlotProps } from "../Section.types.js";

export function SectionBody(props: SectionSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <Box className={cx(styles.body, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </Box>
  );
}

SectionBody.displayName = "Section.Body";
