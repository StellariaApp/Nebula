import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx, extractStyleProps } from "../../../utils/style-props.js";

import type { BoxOwnProps, BoxProps } from "./Box.types.js";

/**
 * Primitivo polimórfico de layout. Traduce las style props tokenizadas del
 * contrato compartido a clases atómicas (sprinkles) y las de valor libre a style
 * inline; el resto de props llega intacto al elemento.
 *
 * Presentacional puro: **sin `"use client"`** — es server-safe (docs/03 §3).
 */
const BoxImpl = forwardRef<HTMLElement, BoxOwnProps>(function Box(props, ref) {
  const { component, className, ...styleAndRest } = props;
  const Component = (component ?? "div");
  const { className: sprinkleClass, style, rest } = extractStyleProps(styleAndRest);

  return (
    <Component
      ref={ref}
      className={cx(sprinkleClass, className)}
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
