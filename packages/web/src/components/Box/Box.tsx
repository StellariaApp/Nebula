import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { BoxReveal } from "./Box.reveal.js";
import type { BoxOwnProps, BoxProps } from "./Box.types.js";

const BoxComponent = forwardRef<HTMLElement, BoxOwnProps>(function Box(props, ref) {
  const { component, className, reveal, ...rest_props } = props;

  /*
   * Sin `reveal` no hay nada que animar, asi que `Box` se queda como estaba: de servidor, sin
   * observador y sin estado. Con el, la raiz pasa a la cascara de cliente y los `children` siguen
   * llegando desde el servidor. Ver `Box.reveal.tsx` para el porque.
   */
  if (reveal !== undefined && reveal !== false) {
    return (
      <BoxReveal
        ref={ref}
        {...(component === undefined ? {} : { component })}
        {...(className === undefined ? {} : { className })}
        reveal={reveal === true ? {} : reveal}
        {...rest_props}
      />
    );
  }

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
