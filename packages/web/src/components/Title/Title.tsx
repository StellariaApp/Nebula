import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Title.css.js";
import type { TitleOwnProps, TitleProps } from "./Title.types.js";

const TitleImpl = forwardRef<HTMLElement, TitleOwnProps>(function Title(props, ref) {
  const { component, order = 1, className, ...rest } = props;

  return (
    <Box
      ref={ref}
      component={component ?? (`h${String(order)}` as ElementType)}
      className={cx(styles.heading, styles.orders[order], className)}
      {...rest}
    />
  );
});

interface TitleComponent {
  <C extends ElementType = "h1">(props: TitleProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Title = TitleImpl as unknown as TitleComponent;
Title.displayName = "Title";
