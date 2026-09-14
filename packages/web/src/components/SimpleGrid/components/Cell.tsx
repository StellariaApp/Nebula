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

import { ResponsiveVars, type ResponsiveSlots } from "../responsive-vars.js";
import * as styles from "../SimpleGrid.css.js";
import type { SimpleGridCellOwnProps, SimpleGridCellProps } from "../SimpleGrid.types.js";
import * as variables from "../SimpleGrid.vars.css.js";

const SPAN_VARS: ResponsiveSlots = {
  base: variables.spanBase,
  phone: variables.spanPhone,
  tablet: variables.spanTablet,
  laptop: variables.spanLaptop,
  desktop: variables.spanDesktop,
  wide: variables.spanWide,
};

const ROW_SPAN_VARS: ResponsiveSlots = {
  base: variables.rowSpanBase,
  phone: variables.rowSpanPhone,
  tablet: variables.rowSpanTablet,
  laptop: variables.rowSpanLaptop,
  desktop: variables.rowSpanDesktop,
  wide: variables.rowSpanWide,
};

const CellComponent = forwardRef<HTMLElement, SimpleGridCellOwnProps>(
  function SimpleGridCell(props, ref) {
    const {
      component,
      span = 1,
      rowSpan = 1,
      className,
      style,
      ...rest
    } = props as SimpleGridCellOwnProps & { style?: CSSProperties };

    const css_vars = assignInlineVars({
      ...ResponsiveVars(span, SPAN_VARS, 1),
      ...ResponsiveVars(rowSpan, ROW_SPAN_VARS, 1),
    });

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.cell, className)}
        style={{ ...css_vars, ...style }}
        {...rest}
      />
    );
  },
);

export interface SimpleGridCellComponent {
  <C extends ElementType = "div">(
    props: SimpleGridCellProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const SimpleGridCell = CellComponent as unknown as SimpleGridCellComponent;
SimpleGridCell.displayName = "SimpleGrid.Cell";
