import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../List.css.js";
import type { ListItemOwnProps, ListItemProps } from "../List.types.js";

const ItemComponent = forwardRef<HTMLElement, ListItemOwnProps>(function ListItem(props, ref) {
  const { component, icon, className, children, iconProps, ...rest } = props;

  if (icon === undefined || icon === null) {
    return (
      <Box ref={ref} component={component ?? "li"} className={cx(styles.item, className)} {...rest}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      ref={ref}
      component={component ?? "li"}
      className={cx(styles.item_with_icon, className)}
      {...rest}
    >
      <Box
        component="span"
        aria-hidden="true"
        {...iconProps}
        className={cx(styles.item_icon, iconProps?.className)}
      >
        {icon}
      </Box>
      <span>{children}</span>
    </Box>
  );
});

export interface ListItemComponent {
  <C extends ElementType = "li">(props: ListItemProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const ListItem = ItemComponent as unknown as ListItemComponent;
ListItem.displayName = "List.Item";
