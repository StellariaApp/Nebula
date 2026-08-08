import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { GradientRole, RadiusName } from "@stellaria/nebula-tokens";

import type { GradientProp } from "../../theme/resolve-variant.js";
import type { BoxOwnProps, BoxSlotProps } from "../Box/Box.types.js";

/**
 * Región pintada con un gradiente del tema.
 *
 * GUARDRAIL (docs/06 §6): acento de marca en CTA, badge, header o hero. **No** es fondo dominante de
 * tablas, formularios ni lectura larga, y nunca pinta texto principal — para eso está `GradientText`
 * con su fallback. Si va a llevar texto encima, sube `scrim` hasta que el par vuelva a ser AA.
 */
export interface GradientBackgroundOwnProps extends Omit<BoxOwnProps, "component"> {
  /**
   * El velo que atenúa el gradiente. Solo se pinta con `scrim` mayor que 0, y de ahí sale su
   * opacidad; la ranura es lo que permite teñirlo de otro color sin forkear. La capa de grano no
   * tiene ranura: es la textura del efecto y su opacidad la fija el tema.
   */
  scrimProps?: BoxSlotProps | undefined;
  component?: ElementType | undefined;
  gradient?: GradientRole | GradientProp | undefined;
  radius?: RadiusName | number | undefined;
  scrim?: number | undefined;
  grain?: boolean | undefined;
}

export type GradientBackgroundProps<C extends ElementType = "div"> = GradientBackgroundOwnProps & {
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof GradientBackgroundOwnProps | "component">;
