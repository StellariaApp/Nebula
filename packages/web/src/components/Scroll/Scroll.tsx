import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { Cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Scroll.css.js";
import { scrollbarSize as scrollbarSizeVar } from "./Scroll.vars.css.js";
import type { ScrollOwnProps, ScrollProps } from "./Scroll.types.js";

const ScrollImpl = forwardRef<HTMLElement, ScrollOwnProps>(function Scroll(props, ref) {
  const { component, axis = "y", gutter = false, scrollbarSize, className, style, children, ...rest } =
    props as ScrollOwnProps & { style?: CSSProperties };

  const css_vars =
    scrollbarSize === undefined
      ? undefined
      : assignInlineVars({ [scrollbarSizeVar]: LengthToCss(scrollbarSize) });

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      className={Cx(styles.scroll({ axis, gutter }), className)}
      style={{ ...css_vars, ...style }}
      {...rest}
    >
      {children}
    </Box>
  );
});

interface ScrollComponent {
  <C extends ElementType = "div">(props: ScrollProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Scroll = ScrollImpl as unknown as ScrollComponent;
Scroll.displayName = "Scroll";
