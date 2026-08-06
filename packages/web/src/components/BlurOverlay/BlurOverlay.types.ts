import type { ReactNode } from "react";

import type { BlurLevel, ColorExtended, RadiusName } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

/**
 * Capa que **desenfoca lo que hay detrás** en vez de teñirlo. `Overlay` es lo contrario: tinte
 * primero, blur opcional.
 *
 * GUARDRAIL: `blur` operativo máximo `md` (investigación de estilo de Stellaria §4.5); `lg`+ solo en
 * overlays puntuales a pantalla completa. No apilar dos BlurOverlay ni montarlo sobre un
 * `GlassSurface`: el `backdrop-filter` encadenado se paga por frame.
 */
export interface BlurOverlayProps extends Omit<StyleProps, "opacity"> {
  blur?: BlurLevel | undefined;
  color?: ColorExtended | undefined;
  opacity?: number | undefined;
  radius?: RadiusName | "none" | undefined;
  fixed?: boolean | undefined;
  center?: boolean | undefined;
  zIndex?: number | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}
