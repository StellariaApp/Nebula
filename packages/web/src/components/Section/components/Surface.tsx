"use client";

import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

import { cx } from "../../../utils/style-props.js";
import { useReveal } from "../../Reveal/use-reveal.js";
import type { SectionRevealProps } from "../Section.types.js";

export interface SectionSurfaceProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  /** Como entra la banda. Llega de `Section`, que lo recibe en `revealProps`. */
  reveal?: SectionRevealProps | undefined;
}

/**
 * La banda que revela, y lo UNICO de `Section` que necesita cliente.
 *
 * Existe para que `Section` pueda ser de servidor, igual que `Hero.Surface`: lo que un componente de
 * servidor pasa como `children` a uno de cliente SIGUE SIENDO DE SERVIDOR, asi que el rail entero
 * —cabecera, cuerpo, pie y todo lo que el consumidor mete dentro— se queda fuera del cliente.
 *
 * `Section` solo la monta cuando `reveal` esta puesto. Sin el no hay nada que animar y el elemento
 * raiz es un `<section>` de servidor sin mas.
 *
 * Desde que `useReveal` es CSS, esta cascara no monta nada de motion: es un observador, una clase y
 * un atributo.
 */
export function SectionSurface(props: SectionSurfaceProps): ReactElement {
  const { children, className, style, reveal: options, ...section } = props;
  const reveal = useReveal(options ?? {});

  return (
    <section
      ref={reveal.ref}
      className={cx(reveal.className, className)}
      style={{ ...reveal.style, ...style }}
      data-reveal={reveal["data-reveal"]}
      {...section}
    >
      {children}
    </section>
  );
}

SectionSurface.displayName = "Section.Surface";
