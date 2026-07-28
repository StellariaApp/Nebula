import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./ButtonGroup.css.js";
import type { ButtonGroupOwnProps, ButtonGroupProps } from "./ButtonGroup.types.js";

const ButtonGroupComponent = forwardRef<HTMLElement, ButtonGroupOwnProps>(
  function ButtonGroup(props, ref) {
    const { component, orientation = "horizontal", className, children, ...rest } = props;

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        role="group"
        className={cx(
          styles.group,
          orientation === "vertical" ? styles.vertical : styles.horizontal,
          className,
        )}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

interface ButtonGroupComponent {
  <C extends ElementType = "div">(
    props: ButtonGroupProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const ButtonGroup = ButtonGroupComponent as unknown as ButtonGroupComponent;
ButtonGroup.displayName = "ButtonGroup";
