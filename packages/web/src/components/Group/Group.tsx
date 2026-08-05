import {
  Children,
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

import * as styles from "./Group.css.js";
import type { GroupOwnProps, GroupProps } from "./Group.types.js";
import { groupCount, groupGap } from "./Group.vars.css.js";

const GroupComponent = forwardRef<HTMLElement, GroupOwnProps>(function Group(props, ref) {
  const {
    component,
    gap = "md",
    wrap = true,
    grow = false,
    preventGrowOverflow = true,
    align = "center",
    justify,
    className,
    style,
    children,
    ...rest
  } = props as GroupOwnProps & { style?: CSSProperties };

  const count = Children.count(children);
  const css_vars = assignInlineVars({
    [groupGap]: SpaceToCss(gap),
    [groupCount]: String(count === 0 ? 1 : count),
  });

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      className={cx(styles.group, wrap ? styles.wrap_on : styles.wrap_off, className)}
      align={align}
      justify={justify}
      data-grow={grow ? "true" : undefined}
      data-prevent-overflow={preventGrowOverflow ? "true" : undefined}
      style={{ ...css_vars, ...style }}
      {...rest}
    >
      {children}
    </Box>
  );
});

interface GroupComponent {
  <C extends ElementType = "div">(props: GroupProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Group = GroupComponent as unknown as GroupComponent;
Group.displayName = "Group";
