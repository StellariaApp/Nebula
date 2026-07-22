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

import { GridCol } from "./Col.js";
import * as styles from "./Grid.css.js";
import type { GridOwnProps, GridProps } from "./Grid.types.js";
import { gridColumns, gridGrow, gridGutter } from "./Grid.vars.css.js";

const GridImpl = forwardRef<HTMLElement, GridOwnProps>(function Grid(props, ref) {
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
    [gridColumns]: String(columns),
    [gridGutter]: SpaceToCss(gutter),
    [gridGrow]: grow ? "1" : "0",
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

interface GridComponent {
  <C extends ElementType = "div">(props: GridProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
  Col: typeof GridCol;
}

export const Grid = GridImpl as unknown as GridComponent;
Grid.displayName = "Grid";
Grid.Col = GridCol;
