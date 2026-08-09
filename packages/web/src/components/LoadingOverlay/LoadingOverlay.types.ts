import type { ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { OverlayBlur } from "../Overlay/Overlay.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface LoadingOverlayProps extends Omit<StyleProps, "opacity"> {
  visible: boolean;
  label?: string | undefined;
  loader?: ReactNode | undefined;
  color?: ColorExtended | undefined;
  opacity?: number | undefined;
  blur?: OverlayBlur | undefined;
  zIndex?: number | undefined;
  className?: string | undefined;
  /** La caja de estado. Lleva `role="status"`, asi que su contenido se anuncia. */
  bodyProps?: BoxSlotProps | undefined;
  /** Envoltorio del indicador. El indicador en si se sustituye con `loader`. */
  loaderProps?: BoxSlotProps | undefined;
  /** El rotulo bajo el indicador. */
  labelProps?: TextSlotProps | undefined;
}
