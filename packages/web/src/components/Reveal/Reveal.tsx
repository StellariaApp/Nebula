"use client";

import type { ElementType, ReactElement } from "react";

import { cx } from "../../utils/style-props.js";
import { ExtractStyleProps } from "../../utils/style-props.js";

import type { RevealProps } from "./Reveal.types.js";
import { useReveal } from "./use-reveal.js";

/**
 * Una entrada al entrar en pantalla.
 *
 * No monta ningun componente de motion: el hook decide CUANDO con un `IntersectionObserver` y el
 * navegador se encarga del COMO con una transicion de CSS. La fisica no se pierde — el muelle del
 * tema se muestrea a `linear()`, rebote incluido — y a cambio la animacion corre en el compositor,
 * que importa porque esta es la unica del catalogo que se dispara MIENTRAS se hace scroll.
 *
 * Ver `Reveal.css.ts` para el porque completo.
 */
export function Reveal(props: RevealProps): ReactElement {
  const {
    children,
    component,
    preset,
    spring,
    duration,
    once,
    amount,
    rootMargin,
    index,
    distance,
    initial,
    className,
    style,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const reveal = useReveal({ preset, spring, duration, once, amount, rootMargin, index, distance, initial });

  const Root: ElementType = component ?? "div";

  return (
    <Root
      ref={reveal.ref}
      className={cx(reveal.className, sprinkle_class, className)}
      style={{ ...reveal.style, ...sprinkle_style, ...style }}
      data-reveal={reveal["data-reveal"]}
      {...rest}
    >
      {children}
    </Root>
  );
}

Reveal.displayName = "Reveal";
