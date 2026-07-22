import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import type { BoxOwnProps, BoxProps } from "./Box.types.js";

const BoxImpl = forwardRef<HTMLElement, BoxOwnProps>(function Box(props, ref) {
  const { component, className, ...style_and_rest } = props;
  const Component = component ?? "div";
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_and_rest);

  return (
    <Component
      ref={ref}
      className={cx(sprinkle_class, className)}
      {...(style === undefined ? {} : { style })}
      {...rest}
    />
  );
});

interface BoxComponent {
  <C extends ElementType = "div">(props: BoxProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Box = BoxImpl as unknown as BoxComponent;
Box.displayName = "Box";
