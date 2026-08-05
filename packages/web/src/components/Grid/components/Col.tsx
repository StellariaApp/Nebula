import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../Grid.css.js";
import type { GridColOwnProps, GridColProps } from "../Grid.types.js";
import * as variables from "../Grid.vars.css.js";

const ColComponent = forwardRef<HTMLElement, GridColOwnProps>(function GridCol(props, ref) {
  const {
    component,
    span = "auto",
    offset = 0,
    className,
    style,
    ...rest
  } = props as GridColOwnProps & {
    style?: CSSProperties;
  };

  const is_numeric = typeof span === "number";
  const variant_class = is_numeric
    ? styles.col_numeric
    : span === "content"
      ? styles.col_content
      : styles.col_auto;

  const css_vars = assignInlineVars({
    [variables.colOffset]: String(offset),
    [variables.colSpan]: is_numeric ? String(span) : "1",
  });

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      className={cx(styles.col_base, variant_class, className)}
      style={{ ...css_vars, ...style }}
      {...rest}
    />
  );
});

export interface GridColComponent {
  <C extends ElementType = "div">(props: GridColProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const GridCol = ColComponent as unknown as GridColComponent;
GridCol.displayName = "Grid.Col";
