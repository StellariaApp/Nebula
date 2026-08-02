import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Mark.css.js";
import type { MarkOwnProps, MarkProps } from "./Mark.types.js";
import { markBg, markFg } from "./Mark.vars.css.js";

const MarkComponent = forwardRef<HTMLElement, MarkOwnProps>(function Mark(props, ref) {
  const {
    component,
    color = "warning",
    className,
    style,
    ...rest
  } = props as MarkOwnProps & {
    style?: CSSProperties;
  };

  const css_vars = assignInlineVars({
    [markBg]: ResolveAccent(color, "200"),
    [markFg]: ResolveAccent(color, "900"),
  });

  return (
    <Box
      ref={ref}
      component={component ?? "mark"}
      className={cx(styles.mark, className)}
      style={{ ...css_vars, ...style }}
      {...rest}
    />
  );
});

interface MarkComponent {
  <C extends ElementType = "mark">(props: MarkProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Mark = MarkComponent as unknown as MarkComponent;
Mark.displayName = "Mark";
