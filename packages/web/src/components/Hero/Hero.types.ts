import type { CSSProperties, ReactNode } from "react";

import type { ColorExtended, Unit, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type HeroVariant = Extract<Variant, "filled" | "outline" | "light" | "glass">;

export type HeroSize = "sm" | "md" | "lg" | "xl";

export type HeroOrder = 1 | 2 | 3 | 4 | 5 | 6;

/** Props de cualquier parte de `Hero`: hijos, `className` y las style props del sistema. */
export interface HeroSlotProps extends Omit<StyleProps, "color" | "left" | "right" | "bottom"> {
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export interface HeroProps extends Omit<
  StyleProps,
  "color" | "align" | "left" | "right" | "bottom"
> {
  /**
   * Nombra la region por `aria-labelledby`. Sin el, y sin un `Hero.Title` entre los hijos, la banda
   * no llega a ser un landmark con nombre.
   */
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  /** El rotulo pequeno sobre el titulo —la novedad, la categoria—. Cae encima de todo el bloque de texto. */
  hiper?: ReactNode | undefined;
  description?: ReactNode | undefined;
  /** Imagen de fondo a sangre. El texto se lee sobre su velo, no sobre ella: lo gradua `overlayOpacity`. */
  image?: string | undefined;
  /** Vacio la deja decorativa, que es lo correcto cuando la imagen no aporta nada que el texto no diga. */
  imageAlt?: string | undefined;
  /** Opacidad del velo sobre `image`. Sin `image` no hay velo, asi que no tiene efecto. */
  overlayOpacity?: number | undefined;
  variant?: HeroVariant | undefined;
  /** Con `transparent` —el defecto— la banda no pinta fondo propio y hereda el de la pagina. */
  color?: ColorExtended | undefined;
  size?: HeroSize | undefined;
  align?: "start" | "center" | undefined;
  /** Nivel del encabezado del titulo, de 1 a 6. Es estructura, no tamano: el tamano sale de `size`. */
  order?: HeroOrder | undefined;
  /** Ancho maximo del carril interior; la banda sigue ocupando el ancho completo. @default 1400 */
  contentWidth?: Unit | undefined;
  id?: string | undefined;
  style?: CSSProperties | undefined;
  actions?: ReactNode | undefined;
  /** Region a la izquierda del cuerpo. Equivale a `Hero.Left`, que es la via para reordenarla. */
  left?: ReactNode | undefined;
  /** Region a la derecha del cuerpo. Equivale a `Hero.Right`. */
  right?: ReactNode | undefined;
  /** Region bajo el cuerpo, a lo ancho del carril. Equivale a `Hero.Bottom`. */
  bottom?: ReactNode | undefined;
  /**
   * Cae EN MEDIO del cuerpo, entre la descripcion y las acciones, no al final. Si entre los hijos hay
   * partes del compound —`Hero.Header`, `Hero.Title`...— el cuerpo pasa a ser tuyo entero y las props
   * de texto dejan de montarse (ADR-111).
   */
  children?: ReactNode | undefined;
  className?: string | undefined;
}
