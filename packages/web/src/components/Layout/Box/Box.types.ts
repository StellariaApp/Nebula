import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { StyleProps } from "../../../utils/style-props.js";

/**
 * Props propias de Box, independientes del elemento renderizado.
 *
 * Nota de tipado: el monorepo compila con `exactOptionalPropertyTypes`, así que
 * TODA prop opcional del API público declara `| undefined` explícito — de lo
 * contrario `className={cond ? "x" : undefined}` no compilaría en el consumidor.
 */
export interface BoxOwnProps extends StyleProps {
  /**
   * Elemento o componente a renderizar (polimorfismo — ADR-018 §2).
   * Default `"div"`.
   */
  component?: ElementType | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}

/**
 * Props de Box para un elemento concreto: las propias + las nativas de ese
 * elemento (sin colisionar con las propias).
 */
export type BoxProps<C extends ElementType = "div"> = BoxOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof BoxOwnProps | "component">;
