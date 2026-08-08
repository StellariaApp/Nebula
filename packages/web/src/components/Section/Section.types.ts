import type { ReactNode } from "react";

import type { Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type SectionSize = "sm" | "md" | "lg" | "xl";

export type SectionOrder = 2 | 3 | 4 | 5 | 6;

/** Props de cualquier parte de `Section`: hijos, `className` y las style props del sistema. */
export interface SectionSlotProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export type SectionHeadingProps = SectionSlotProps;

export interface SectionProps extends StyleProps {
  /**
   * El cuerpo. Si entre los hijos hay un `Section.Header`, sustituye a la cabecera que montan `title`,
   * `description`, `aside` y `actions`; si hay un `Section.Footer`, sustituye a `footer` (ADR-111).
   */
  children?: ReactNode | undefined;
  /**
   * Nombra la region por `aria-labelledby`, y por eso gana a `aria-label`. Sin el, y sin un
   * `Section.Title` entre los hijos, la banda cae al `aria-label`.
   */
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  /** Lo que acompana a las acciones en la fila de cabecera, a su izquierda. Equivale a `Section.Aside`. */
  aside?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  /** Superpone el velo de carga SIN retirar el contenido, para que la pagina no salte al terminar. */
  loading?: boolean | undefined;
  /** Sustituye al contenido. Si es una cadena se envuelve en un `Alert` de error que se anuncia solo. */
  error?: ReactNode | undefined;
  /** Lo que se pinta en lugar del contenido cuando `isEmpty`. Sin `isEmpty` no se pinta nunca. */
  empty?: ReactNode | undefined;
  /** Enciende la rama de `empty`. `error` manda sobre ella: si hay error, el vacio no se pinta. */
  isEmpty?: boolean | undefined;
  /** Nivel del encabezado del titulo, de 2 a 6. Es estructura, no tamano: el tamano es `fz`. */
  order?: SectionOrder | undefined;
  /** Linea separadora dentro del carril, para que no cruce la banda de lado a lado de la pantalla. */
  divided?: boolean | undefined;
  /** La banda de cristal de ADR-082, el peldano mas bajo. Se usa ALTERNANDO secciones: encenderlas todas devuelve un fondo uniforme, que es lo contrario del efecto. */
  glass?: boolean | undefined;
  /** Aparicion al entrar en viewport. Cambia el elemento raiz al de motion, no anade un nodo (ver `Reveal.md`). */
  reveal?: boolean | undefined;
  /** Ancho maximo del carril interior; la banda sigue ocupando el ancho completo. @default 1180 */
  contentWidth?: Unit | undefined;
  id?: string | undefined;
  size?: SectionSize | undefined;
  className?: string | undefined;
  /** Solo se usa si no hay `title` ni `Section.Title`: el titulo, cuando existe, nombra la region. */
  "aria-label"?: string | undefined;
}
