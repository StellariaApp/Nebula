import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { Cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Grid.css.js";
import type { GridColOwnProps, GridColProps } from "./Grid.types.js";
import { colOffset, colSpan } from "./Grid.vars.css.js";

const ColImpl = forwardRef<HTMLElement, GridColOwnProps>(function GridCol(props, ref) {
  const { component, span = "auto", offset = 0, className, style, ...rest } =
    props as GridColOwnProps & {
      style?: CSSProperties;
    };

  const is_numeric = typeof span === "number";
  const variant_class = is_numeric
    ? styles.colNumeric
    : span === "content"
      ? styles.colContent
      : styles.colAuto;

  const css_vars = assignInlineVars({
    [colOffset]: String(offset),
    [colSpan]: is_numeric ? String(span) : "1",
  });

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      className={Cx(styles.colBase, variant_class, className)}
      style={{ ...css_vars, ...style }}
      {...rest}
    />
  );
});

interface GridColComponent {
  <C extends ElementType = "div">(props: GridColProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const GridCol = ColImpl as unknown as GridColComponent;
GridCol.displayName = "Grid.Col";
