import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { Cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./VisuallyHidden.css.js";
import type { VisuallyHiddenOwnProps, VisuallyHiddenProps } from "./VisuallyHidden.types.js";

const VisuallyHiddenImpl = forwardRef<HTMLElement, VisuallyHiddenOwnProps>(
  function VisuallyHidden(props, ref) {
    const { component, className, ...rest } = props;
    return (
      <Box
        ref={ref}
        component={component ?? "span"}
        className={Cx(styles.visuallyHidden, className)}
        {...rest}
      />
    );
  },
);

interface VisuallyHiddenComponent {
  <C extends ElementType = "span">(
    props: VisuallyHiddenProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const VisuallyHidden = VisuallyHiddenImpl as unknown as VisuallyHiddenComponent;
VisuallyHidden.displayName = "VisuallyHidden";
