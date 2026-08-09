import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole } from "@stellaria/nebula-tokens";

import type { BoxOwnProps, BoxSlotProps } from "../Box/Box.types.js";

/**
 * Malla de gradientes radiales derivada de los stops de `effects.gradients[gradient]`. Con `grain`
 * añade la textura de ruido del tema: esa combinación es lo que `00-inventory` §1.15 llama
 * `GrainyGradient`.
 *
 * GUARDRAIL (docs/06 §6): fondo de hero, onboarding, empty state o pantalla de entrada. No es fondo
 * de trabajo — ni tablas, ni formularios, ni lectura larga.
 */
export interface MeshGradientBgOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * El velo que atenúa la malla. Solo se pinta con `scrim` mayor que 0, y de ahí sale su opacidad;
   * la ranura es lo que permite teñirlo de otro color sin forkear. La capa de grano no tiene
   * ranura: es la textura del efecto y su opacidad la fija el tema.
   */
  scrimProps?: BoxSlotProps | undefined;
  component?: ElementType | undefined;
  gradient?: GradientRole | undefined;
  grain?: boolean | undefined;
  scrim?: number | undefined;
}

export type MeshGradientBgProps<C extends ElementType = "div"> = MeshGradientBgOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof MeshGradientBgOwnProps | "component">;
