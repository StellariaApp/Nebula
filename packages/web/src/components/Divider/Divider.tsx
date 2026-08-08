import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Divider.css.js";
import * as variables from "./Divider.vars.css.js";
import type { DividerOwnProps, DividerProps, DividerSize } from "./Divider.types.js";
import { Text } from "../Text/Text.js";

const THICKNESS: Record<DividerSize, number> = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 };

function ResolveThickness(size: DividerSize | number): string {
  if (typeof size === "string") return `${String(THICKNESS[size])}px`;
  return LengthToCss(size);
}

const DividerComponent = forwardRef<HTMLElement, DividerOwnProps>(function Divider(props, ref) {
  const {
    component,
    orientation = "horizontal",
    size = "xs",
    lineStyle = "solid",
    color = "default",
    label,
    labelPosition = "center",
    className,
    lineProps,
    labelProps,
    style,
    ...rest
  } = props as DividerOwnProps & { style?: CSSProperties };

  const has_label = label !== undefined && label !== null && orientation === "horizontal";

  const css_vars = assignInlineVars({
    [variables.color]: vars.color.border[color],
    [variables.thickness]: ResolveThickness(size),
    [variables.style]: lineStyle,
  });

  const left_class = labelPosition === "left" ? styles.fixed : styles.grow;
  const right_class = labelPosition === "right" ? styles.fixed : styles.grow;

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      role="separator"
      aria-orientation={orientation}
      className={cx(styles.root({ orientation, withLabel: has_label }), className)}
      style={{ ...css_vars, ...style }}
      {...rest}
    >
      {has_label ? (
        <>
          <Box
            component="span"
            aria-hidden="true"
            {...lineProps}
            className={cx(styles.line, left_class, lineProps?.className)}
          />
          <Text
            inherit
            component="span"
            {...labelProps}
            className={cx(styles.label, labelProps?.className)}
          >
            {label}
          </Text>
          <Box
            component="span"
            aria-hidden="true"
            {...lineProps}
            className={cx(styles.line, right_class, lineProps?.className)}
          />
        </>
      ) : null}
    </Box>
  );
});

interface DividerComponent {
  <C extends ElementType = "div">(props: DividerProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Divider = DividerComponent as unknown as DividerComponent;
Divider.displayName = "Divider";
