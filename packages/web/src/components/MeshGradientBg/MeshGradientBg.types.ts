import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole, RadiusName } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

/**
 * Malla de gradientes radiales derivada de los stops de `effects.gradients[gradient]`. Con `grain`
 * añade la textura de ruido del tema: esa combinación es lo que `00-inventory` §1.15 llama
 * `GrainyGradient`.
 *
 * GUARDRAIL (docs/06 §6): fondo de hero, onboarding, empty state o pantalla de entrada. No es fondo
 * de trabajo — ni tablas, ni formularios, ni lectura larga.
 */
export interface MeshGradientBgOwnProps extends Omit<BoxOwnProps, "component"> {
  component?: ElementType | undefined;
  gradient?: GradientRole | undefined;
  radius?: RadiusName | number | undefined;
  grain?: boolean | undefined;
  scrim?: number | undefined;
}

export type MeshGradientBgProps<C extends ElementType = "div"> = MeshGradientBgOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof MeshGradientBgOwnProps | "component">;
