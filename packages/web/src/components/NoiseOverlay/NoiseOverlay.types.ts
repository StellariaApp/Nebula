import type { RadiusName } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

/**
 * Grano fino sobre la región que lo contiene. Es la textura de `effects.glass.noiseOpacity`, no un
 * efecto libre: sin `opacity` explícita toma la del tema y con `effects.glass.enabled=false` no
 * pinta nada.
 *
 * GUARDRAIL: es decorativo y va siempre sobre una superficie ya resuelta. Nunca sobre texto de
 * lectura larga ni sobre celdas de datos.
 */
export interface NoiseOverlayProps extends Omit<StyleProps, "opacity"> {
  opacity?: number | undefined;
  radius?: RadiusName | "none" | undefined;
  fixed?: boolean | undefined;
  zIndex?: number | undefined;
  className?: string | undefined;
}
