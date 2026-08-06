import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import type { BoxOwnProps, BoxProps } from "./Box.types.js";

const BoxComponent = forwardRef<HTMLElement, BoxOwnProps>(function Box(props, ref) {
  const { component, className, ...rest_props } = props;
  const Component = component ?? "div";
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(rest_props);

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

export const Box = BoxComponent as unknown as BoxComponent;
Box.displayName = "Box";
