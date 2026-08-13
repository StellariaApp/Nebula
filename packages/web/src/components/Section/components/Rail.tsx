import { forwardRef } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../Section.css.js";
import type { SectionRailProps } from "../Section.types.js";

export const SectionRail = forwardRef<HTMLElement, SectionRailProps>((props, ref) => {
  const { children, className, size = "md", ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <Box
      ref={ref}
      className={cx(styles.rail, styles.rail_size[size], sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </Box>
  );
});

SectionRail.displayName = "Section.Rail";
