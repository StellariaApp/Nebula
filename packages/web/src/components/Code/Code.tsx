import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Code.css.js";
import type { CodeOwnProps, CodeProps } from "./Code.types.js";

const CodeImpl = forwardRef<HTMLElement, CodeOwnProps>(function Code(props, ref) {
  const { component, block = false, className, ...rest } = props;

  return (
    <Box
      ref={ref}
      component={component ?? (block ? "pre" : "code")}
      className={cx(styles.base, block ? styles.block : styles.inline, className)}
      {...rest}
    />
  );
});

interface CodeComponent {
  <C extends ElementType = "code">(props: CodeProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Code = CodeImpl as unknown as CodeComponent;
Code.displayName = "Code";
