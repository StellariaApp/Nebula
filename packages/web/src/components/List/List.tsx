import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";
import { SpaceToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./List.css.js";
import * as variables from "./List.vars.css.js";
import type { ListItemOwnProps, ListOwnProps, ListProps } from "./List.types.js";

const ListComponent = forwardRef<HTMLElement, ListOwnProps>(function List(props, ref) {
  const {
    component,
    type = "unordered",
    spacing = "xs",
    withPadding = false,
    icon,
    className,
    style,
    children,
    ...rest
  } = props as ListOwnProps & { style?: CSSProperties };

  const css_vars = assignInlineVars({ [variables.spacing]: SpaceToCss(spacing) });

  const items =
    icon === undefined
      ? children
      : Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          const child_props = child.props as ListItemOwnProps;
          if (child_props.icon !== undefined) return child;
          return cloneElement(child as ReactElement<ListItemOwnProps>, { icon });
        });

  return (
    <Box
      ref={ref}
      component={component ?? (type === "ordered" ? "ol" : "ul")}
      className={cx(
        styles.list,
        withPadding ? styles.with_padding : undefined,
        icon === undefined ? undefined : styles.unstyled,
        className,
      )}
      style={{ ...css_vars, ...style }}
      {...rest}
    >
      {items}
    </Box>
  );
});

export interface ListRoot {
  <C extends ElementType = "ul">(props: ListProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const List = ListComponent as unknown as ListRoot;
List.displayName = "List";
