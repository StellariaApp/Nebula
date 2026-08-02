import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import { Momentum } from "./components/Momentum.js";
import * as styles from "./Scroll.css.js";
import { scrollbarSize as scrollbarSizeVar } from "./Scroll.vars.css.js";
import type { ScrollOwnProps, ScrollProps } from "./Scroll.types.js";

const WHEEL_GAIN = 1.5;

const ScrollComponent = forwardRef<HTMLElement, ScrollOwnProps>(function Scroll(props, ref) {
  const {
    component,
    axis = "y",
    gutter = false,
    scrollbarSize,
    shadows = false,
    smooth = false,
    momentum = false,
    bounce = true,
    spring = "default",
    multiplier = WHEEL_GAIN,
    className,
    style,
    children,
    ...rest
  } = props as ScrollOwnProps & { style?: CSSProperties };

  const css_vars =
    scrollbarSize === undefined
      ? undefined
      : assignInlineVars({ [scrollbarSizeVar]: LengthToCss(scrollbarSize) });

  const shadow_class = !shadows
    ? undefined
    : axis === "x"
      ? styles.inlineShadows
      : axis === "xy"
        ? styles.bothShadows
        : styles.blockShadows;

  const shared = {
    component: component ?? "div",
    className: cx(
      styles.scroll({ axis, gutter, smooth }),
      shadow_class,
      momentum && bounce ? styles.bouncing : undefined,
      className,
    ),
    style: { ...css_vars, ...style },
    ...rest,
  };

  if (momentum) {
    return (
      <Momentum
        {...shared}
        axis={axis}
        spring={spring}
        multiplier={multiplier}
        bounce={bounce}
        forwardedRef={ref}
      >
        {children}
      </Momentum>
    );
  }

  return (
    <Box ref={ref} {...shared}>
      {children}
    </Box>
  );
});

interface ScrollComponent {
  <C extends ElementType = "div">(props: ScrollProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Scroll = ScrollComponent as unknown as ScrollComponent;
Scroll.displayName = "Scroll";
