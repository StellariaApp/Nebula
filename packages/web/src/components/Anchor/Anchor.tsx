import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx } from "../../utils/style-props.js";
import { Text } from "../Text/Text.js";

import * as styles from "./Anchor.css.js";
import type { AnchorOwnProps, AnchorProps, AnchorUnderline } from "./Anchor.types.js";

const UNDERLINE_CLASS: Record<AnchorUnderline, string> = {
  always: styles.underlineAlways,
  hover: styles.underlineHover,
  never: styles.underlineNever,
};

const AnchorImpl = forwardRef<HTMLElement, AnchorOwnProps>(function Anchor(props, ref) {
  const { component, underline = "always", external = false, className, ...rest } = props;

  const external_attrs = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Text
      ref={ref}
      component={component ?? "a"}
      className={cx(styles.anchor, UNDERLINE_CLASS[underline], className)}
      {...external_attrs}
      {...rest}
    />
  );
});

interface AnchorComponent {
  <C extends ElementType = "a">(props: AnchorProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Anchor = AnchorImpl as unknown as AnchorComponent;
Anchor.displayName = "Anchor";
