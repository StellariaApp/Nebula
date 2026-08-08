import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { AnchorSlotProps } from "../Anchor/Anchor.types.js";

export interface SpoilerProps extends StyleProps {
  /**
   * El bloque recortado. Su `max-height` se escribe DESPUES de la ranura mientras esta cerrado,
   * porque es lo que hace el recorte; el resto si se ajusta.
   */
  contentProps?: BoxSlotProps | undefined;
  /** El enlace que abre y cierra. Solo se pinta si el contenido desborda `maxHeight`. */
  toggleProps?: AnchorSlotProps | undefined;
  children: ReactNode;
  maxHeight?: number | undefined;
  showLabel?: ReactNode | undefined;
  hideLabel?: ReactNode | undefined;
  expanded?: boolean | undefined;
  defaultExpanded?: boolean | undefined;
  onExpandedChange?: ((expanded: boolean) => void) | undefined;
  className?: string | undefined;
}
