"use client";

import { forwardRef, type ElementType } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { useReveal, type UseRevealOptions } from "../Reveal/use-reveal.js";

import type { BoxOwnProps } from "./Box.types.js";

export interface BoxRevealProps extends BoxOwnProps {
  reveal?: UseRevealOptions | undefined;
}

/**
 * La cascara de cliente de `Box`, y la razon de que `reveal` no viva dentro de `Box`.
 *
 * `Box` NO lleva `"use client"`, y 136 ficheros del catalogo montan sobre el: 49 son componentes de
 * servidor. Meter el `IntersectionObserver` dentro de `Box` se los llevaria al cliente a los 49 de
 * golpe. Con la cascara, `Box` sigue siendo de servidor y solo cambia su raiz cuando le piden
 * `reveal`; lo que pasa como `children` se sigue renderizando en el servidor.
 *
 * Es el mismo patron que `Hero.Surface` y `Section.Surface`, que es lo que saco del cliente a los
 * dos duenos del elemento que marca el LCP.
 *
 * Vale la pena porque desde que `useReveal` es CSS esto no arrastra motion: un observador, una clase
 * y un atributo. Con un componente de motion por instancia no habria defendido ponerlo en `Box`.
 */
export const BoxReveal = forwardRef<HTMLElement, BoxRevealProps>(function BoxReveal(props, ref) {
  const { component, className, reveal: options, ...rest_props } = props;
  const Component: ElementType = component ?? "div";
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(rest_props);
  const reveal = useReveal(options ?? {});

  const SetRef = (element: HTMLElement | null): void => {
    reveal.ref.current = element;
    if (ref === null || ref === undefined) return;
    if (typeof ref === "function") ref(element);
    else ref.current = element;
  };

  return (
    <Component
      ref={SetRef}
      className={cx(reveal.className, sprinkle_class, className)}
      style={{ ...reveal.style, ...style }}
      data-reveal={reveal["data-reveal"]}
      {...rest}
    />
  );
});

BoxReveal.displayName = "Box.Reveal";
