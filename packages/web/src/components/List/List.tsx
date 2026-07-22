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

import { ListItem } from "./Item.js";
import * as styles from "./List.css.js";
import { listSpacing } from "./List.vars.css.js";
import type { ListItemOwnProps, ListOwnProps, ListProps } from "./List.types.js";

const ListImpl = forwardRef<HTMLElement, ListOwnProps>(function List(props, ref) {
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

  const css_vars = assignInlineVars({ [listSpacing]: SpaceToCss(spacing) });

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
        withPadding ? styles.withPadding : undefined,
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

interface ListComponent {
  <C extends ElementType = "ul">(props: ListProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
  Item: typeof ListItem;
}

export const List = ListImpl as unknown as ListComponent;
List.displayName = "List";
List.Item = ListItem;
