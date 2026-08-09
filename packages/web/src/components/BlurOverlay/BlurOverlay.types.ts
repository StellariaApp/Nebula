import type { ReactNode } from "react";

import type { BlurLevel, ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

/**
 * Capa que **desenfoca lo que hay detrás** en vez de teñirlo. `Overlay` es lo contrario: tinte
 * primero, blur opcional.
 *
 * GUARDRAIL: `blur` operativo máximo `md` (investigación de estilo de Stellaria §4.5); `lg`+ solo en
 * overlays puntuales a pantalla completa. No apilar dos BlurOverlay ni montarlo sobre un
 * `GlassSurface`: el `backdrop-filter` encadenado se paga por frame.
 */
export interface BlurOverlayProps extends Omit<StyleProps, "opacity"> {
  /**
   * La caja que centra a `children`. No existe sin hijos, y sin ellos la capa entera pasa a ser
   * `aria-hidden`. El velo no tiene ranura: es el efecto, y lo gobiernan `blur`, `color` y
   * `opacity`.
   */
  contentProps?: BoxSlotProps | undefined;
  blur?: BlurLevel | undefined;
  color?: ColorExtended | undefined;
  opacity?: number | undefined;
  fixed?: boolean | undefined;
  center?: boolean | undefined;
  zIndex?: number | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}
