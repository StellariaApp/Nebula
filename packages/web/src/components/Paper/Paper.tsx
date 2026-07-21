import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { Cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Paper.css.js";
import type { PaperOwnProps, PaperProps } from "./Paper.types.js";

const PaperImpl = forwardRef<HTMLElement, PaperOwnProps>(function Paper(props, ref) {
  const {
    component,
    shadow = "none",
    radius = "md",
    withBorder = false,
    className,
    style,
    children,
    ...rest
  } = props as PaperOwnProps & { style?: CSSProperties };

  const named_radius = typeof radius === "string" ? radius : "md";
  const inline_radius: CSSProperties =
    typeof radius === "number" ? { borderRadius: LengthToCss(radius) } : {};

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      className={Cx(styles.paper({ shadow, radius: named_radius, withBorder }), className)}
      style={{ ...inline_radius, ...style }}
      {...rest}
    >
      {children}
    </Box>
  );
});

interface PaperComponent {
  <C extends ElementType = "div">(props: PaperProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Paper = PaperImpl as unknown as PaperComponent;
Paper.displayName = "Paper";
