import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { Cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Mark.css.js";
import type { MarkOwnProps, MarkProps } from "./Mark.types.js";

const MarkImpl = forwardRef<HTMLElement, MarkOwnProps>(function Mark(props, ref) {
  const { component, color = "warning", className, ...rest } = props;

  return (
    <Box
      ref={ref}
      component={component ?? "mark"}
      className={Cx(styles.mark({ color }), className)}
      {...rest}
    />
  );
});

interface MarkComponent {
  <C extends ElementType = "mark">(props: MarkProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Mark = MarkImpl as unknown as MarkComponent;
Mark.displayName = "Mark";
