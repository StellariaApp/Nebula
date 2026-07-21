import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { Cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Divider.css.js";
import { dividerColor, dividerStyle, dividerThickness } from "./Divider.vars.css.js";
import type { DividerOwnProps, DividerProps, DividerSize } from "./Divider.types.js";

const THICKNESS: Record<DividerSize, number> = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 };

function ResolveThickness(size: DividerSize | number): string {
  if (typeof size === "string") return `${String(THICKNESS[size])}px`;
  return LengthToCss(size);
}

const DividerImpl = forwardRef<HTMLElement, DividerOwnProps>(function Divider(props, ref) {
  const {
    component,
    orientation = "horizontal",
    size = "xs",
    variant = "solid",
    color = "default",
    label,
    labelPosition = "center",
    className,
    style,
    ...rest
  } = props as DividerOwnProps & { style?: CSSProperties };

  const has_label = label !== undefined && label !== null && orientation === "horizontal";

  const css_vars = assignInlineVars({
    [dividerColor]: vars.color.border[color],
    [dividerThickness]: ResolveThickness(size),
    [dividerStyle]: variant,
  });

  const left_class = labelPosition === "left" ? styles.fixed : styles.grow;
  const right_class = labelPosition === "right" ? styles.fixed : styles.grow;

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      role="separator"
      aria-orientation={orientation}
      className={Cx(styles.root({ orientation, withLabel: has_label }), className)}
      style={{ ...css_vars, ...style }}
      {...rest}
    >
      {has_label ? (
        <>
          <span aria-hidden="true" className={Cx(styles.line, left_class)} />
          <span className={styles.label}>{label}</span>
          <span aria-hidden="true" className={Cx(styles.line, right_class)} />
        </>
      ) : null}
    </Box>
  );
});

interface DividerComponent {
  <C extends ElementType = "div">(props: DividerProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Divider = DividerImpl as unknown as DividerComponent;
Divider.displayName = "Divider";
