import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { Cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./List.css.js";
import type { ListItemOwnProps, ListItemProps } from "./List.types.js";

const ItemImpl = forwardRef<HTMLElement, ListItemOwnProps>(function ListItem(props, ref) {
  const { component, icon, className, children, ...rest } = props;

  if (icon === undefined || icon === null) {
    return (
      <Box ref={ref} component={component ?? "li"} className={Cx(styles.item, className)} {...rest}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      ref={ref}
      component={component ?? "li"}
      className={Cx(styles.itemWithIcon, className)}
      {...rest}
    >
      <span className={styles.itemIcon} aria-hidden="true">
        {icon}
      </span>
      <span>{children}</span>
    </Box>
  );
});

interface ListItemComponent {
  <C extends ElementType = "li">(props: ListItemProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const ListItem = ItemImpl as unknown as ListItemComponent;
ListItem.displayName = "List.Item";
