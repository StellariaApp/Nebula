import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { SemanticScaleName, Size, Variant } from "@stellaria/nebula-tokens";
import type { PressEvent } from "react-aria";

/**
 * Props de arrastre/animación del DOM que `motion` redefine con otra firma
 * (recibe su propia definición de animación, no el evento nativo). Se excluyen
 * del contrato para no exponer una ambigüedad al consumidor; ninguna es
 * relevante en un botón.
 */
type MotionConflictingProps =
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop";

/**
 * Contrato de Button. Las props visuales (`variant`/`size`/`color`) vienen del
 * contrato compartido de `@stellaria/nebula-tokens`, así que la versión native
 * expondrá exactamente las mismas (docs/01 §4).
 */
export interface ButtonProps
  extends Omit<
    ComponentPropsWithoutRef<"button">,
    "color" | "disabled" | MotionConflictingProps
  > {
  /** Receta visual del `variantMap` del tema. Default `"filled"`. */
  variant?: Variant | undefined;
  /** Altura de `sizes.control`. Default `"md"`. */
  size?: Size | undefined;
  /** Escala semántica que resuelve las referencias `scale.*`. Default `"primary"`. */
  color?: SemanticScaleName | undefined;
  disabled?: boolean | undefined;
  /** Muestra spinner, bloquea la interacción y anuncia `aria-busy`. */
  loading?: boolean | undefined;
  fullWidth?: boolean | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  children?: ReactNode | undefined;
  /**
   * Acción del botón con detalle de interacción (`pointerType`: mouse/touch/
   * keyboard/virtual). Es el handler que comparte contrato con native, donde no
   * existe `onClick`. `onClick` sigue soportado y se comporta igual — React Aria
   * los trata como el mismo handler, así que ambos se disparan también con
   * Enter/Space.
   */
  onPress?: ((event: PressEvent) => void) | undefined;
}
