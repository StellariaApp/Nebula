import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import type { BreakpointName } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";
import { SpaceToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./SimpleGrid.css.js";
import type { SimpleGridCols, SimpleGridOwnProps, SimpleGridProps } from "./SimpleGrid.types.js";
import * as variables from "./SimpleGrid.vars.css.js";

const BREAKPOINT_VARS: Record<BreakpointName, string> = {
  phone: variables.colsPhone,
  tablet: variables.colsTablet,
  laptop: variables.colsLaptop,
  desktop: variables.colsDesktop,
  wide: variables.colsWide,
};

function ColsVars(cols: SimpleGridCols): Record<string, string> {
  if (typeof cols === "number") return { [variables.colsBase]: String(cols) };

  const out: Record<string, string> = { [variables.colsBase]: String(cols.base ?? 1) };
  for (const name of Object.keys(BREAKPOINT_VARS) as BreakpointName[]) {
    const value = cols[name];
    if (value !== undefined) out[BREAKPOINT_VARS[name]] = String(value);
  }
  return out;
}

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
      ...ColsVars(cols),
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

interface SimpleGridComponent {
  <C extends ElementType = "div">(props: SimpleGridProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const SimpleGrid = SimpleGridComponent as unknown as SimpleGridComponent;
SimpleGrid.displayName = "SimpleGrid";
