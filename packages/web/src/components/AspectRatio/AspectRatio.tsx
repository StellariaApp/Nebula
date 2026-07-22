import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./AspectRatio.css.js";
import { ratio as ratioVar } from "./AspectRatio.vars.css.js";
import type { AspectRatioOwnProps, AspectRatioProps } from "./AspectRatio.types.js";

const AspectRatioImpl = forwardRef<HTMLElement, AspectRatioOwnProps>(
  function AspectRatio(props, ref) {
    const {
      component,
      ratio = 1,
      className,
      style,
      children,
      ...rest
    } = props as AspectRatioOwnProps & { style?: CSSProperties };

    const css_vars = assignInlineVars({ [ratioVar]: String(ratio) });

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.aspectRatio, className)}
        style={{ ...css_vars, ...style }}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

interface AspectRatioComponent {
  <C extends ElementType = "div">(
    props: AspectRatioProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const AspectRatio = AspectRatioImpl as unknown as AspectRatioComponent;
AspectRatio.displayName = "AspectRatio";
