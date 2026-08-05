import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";
import { SpaceToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Grid.css.js";
import type { GridOwnProps, GridProps } from "./Grid.types.js";
import * as variables from "./Grid.vars.css.js";

const GridComponent = forwardRef<HTMLElement, GridOwnProps>(function Grid(props, ref) {
  const {
    component,
    columns = 12,
    gutter = "md",
    grow = false,
    wrap = true,
    align,
    justify,
    className,
    style,
    children,
    ...rest
  } = props as GridOwnProps & { style?: CSSProperties };

  const css_vars = assignInlineVars({
    [variables.columns]: String(columns),
    [variables.gutter]: SpaceToCss(gutter),
    [variables.grow]: grow ? "1" : "0",
  });

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      className={cx(styles.grid({ wrap }), className)}
      align={align}
      justify={justify}
      style={{ ...css_vars, ...style }}
      {...rest}
    >
      {children}
    </Box>
  );
});

export interface GridRoot {
  <C extends ElementType = "div">(props: GridProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Grid = GridComponent as unknown as GridRoot;
Grid.displayName = "Grid";
