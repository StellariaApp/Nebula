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

import { ResponsiveVars, type ResponsiveSlots } from "./responsive-vars.js";
import * as styles from "./SimpleGrid.css.js";
import type { SimpleGridOwnProps, SimpleGridProps } from "./SimpleGrid.types.js";
import * as variables from "./SimpleGrid.vars.css.js";

const COLS_VARS: ResponsiveSlots = {
  base: variables.colsBase,
  phone: variables.colsPhone,
  tablet: variables.colsTablet,
  laptop: variables.colsLaptop,
  desktop: variables.colsDesktop,
  wide: variables.colsWide,
};

const SimpleGridComponent = forwardRef<HTMLElement, SimpleGridOwnProps>(
  function SimpleGrid(props, ref) {
    const {
      component,
      cols = 1,
      spacing = "md",
      verticalSpacing,
      justifyItems,
      className,
      style,
      children,
      ...rest
    } = props as SimpleGridOwnProps & { style?: CSSProperties };

    const css_vars = assignInlineVars({
      ...ResponsiveVars(cols, COLS_VARS, 1),
      [variables.spacingX]: SpaceToCss(spacing),
      [variables.spacingY]: SpaceToCss(verticalSpacing ?? spacing),
      ...(justifyItems === undefined ? {} : { [variables.justify]: justifyItems }),
    });

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.simple_grid, className)}
        style={{ ...css_vars, ...style }}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

export interface SimpleGridComponent {
  <C extends ElementType = "div">(props: SimpleGridProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const SimpleGrid = SimpleGridComponent as unknown as SimpleGridComponent;
SimpleGrid.displayName = "SimpleGrid";
