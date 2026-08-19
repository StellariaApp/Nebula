"use client";

import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

import { m, type HTMLMotionProps, type MotionStyle } from "motion/react";

import { useReveal } from "../../Reveal/use-reveal.js";

export interface SectionSurfaceProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
}

/**
 * La banda que revela, y lo ÚNICO de `Section` que necesita cliente.
 *
 * Existe para que `Section` pueda ser de servidor, igual que `Hero.Surface`: lo que un componente de
 * servidor pasa como `children` a uno de cliente SIGUE SIENDO DE SERVIDOR, así que el rail entero
 * —cabecera, cuerpo, pie y todo lo que el consumidor mete dentro— se queda fuera del cliente.
 *
 * `Section` solo la monta cuando `reveal` está puesto. Sin él no hay nada que animar y el elemento
 * raíz es un `<section>` de servidor sin más.
 */
export function SectionSurface(props: SectionSurfaceProps): ReactElement {
  const { children, style, ...section } = props;
  const reveal = useReveal();

  if (!reveal.armed) {
    return (
      <section ref={reveal.ref} style={style} {...section}>
        {children}
      </section>
    );
  }

  const animated = {
    ref: reveal.ref,
    style: style as MotionStyle,
    "data-reveal": reveal["data-reveal"],
    ...reveal.animated_props,
    ...section,
  } as unknown as HTMLMotionProps<"section">;

  return <m.section {...animated}>{children}</m.section>;
}

SectionSurface.displayName = "Section.Surface";
