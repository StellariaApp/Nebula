import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import type { Size, Unit } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Container.css.js";
import type { ContainerOwnProps, ContainerProps } from "./Container.types.js";
import { containerSize } from "./Container.vars.css.js";

const SIZE_WIDTH: Record<Size, number> = {
  xs: 540,
  sm: 720,
  md: 960,
  lg: 1140,
  xl: 1320,
};

function ResolveMaxWidth(size: Size | Unit, fluid: boolean): string {
  if (fluid) return "100%";
  if (typeof size === "string" && size in SIZE_WIDTH)
    return `${String(SIZE_WIDTH[size as Size])}px`;
  return LengthToCss(size);
}

const ContainerComponent = forwardRef<HTMLElement, ContainerOwnProps>(
  function Container(props, ref) {
    const {
      component,
      size = "md",
      fluid = false,
      px,
      style,
      className,
      children,
      ...rest
    } = props as ContainerOwnProps & { style?: CSSProperties };

    const css_vars = assignInlineVars({
      [containerSize]: ResolveMaxWidth(size, fluid),
    });

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.container, className)}
        px={px ?? "md"}
        style={{ ...css_vars, ...style }}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

interface ContainerComponent {
  <C extends ElementType = "div">(props: ContainerProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Container = ContainerComponent as unknown as ContainerComponent;
Container.displayName = "Container";
