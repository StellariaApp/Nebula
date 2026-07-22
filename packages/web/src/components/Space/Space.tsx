import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { cx } from "../../utils/style-props.js";
import { SpaceToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Space.css.js";
import type { SpaceOwnProps, SpaceProps } from "./Space.types.js";

const SpaceImpl = forwardRef<HTMLElement, SpaceOwnProps>(function Space(props, ref) {
  const { component, w, h, className, style, ...rest } = props as SpaceOwnProps & {
    style?: CSSProperties;
  };

  const dimensions: CSSProperties = {
    ...(w === undefined ? {} : { width: SpaceToCss(w) }),
    ...(h === undefined ? {} : { height: SpaceToCss(h) }),
  };

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      aria-hidden="true"
      className={cx(styles.space, className)}
      style={{ ...dimensions, ...style }}
      {...rest}
    />
  );
});

interface SpaceComponent {
  <C extends ElementType = "div">(props: SpaceProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Space = SpaceImpl as unknown as SpaceComponent;
Space.displayName = "Space";
