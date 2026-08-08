import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface PlayerLabels {
  region: string;
  close: string;
}

export interface PlayerProps extends StyleProps {
  /**
   * El reproductor de dentro del marco. Es el unico nodo del catalogo que pinta un peer —react-player—
   * y por eso se tipa con los atributos del `video` que pinta y no con `BoxSlotProps`: su `src`, su tamano y
   * sus manejadores los gobierna el componente.
   */
  surfaceProps?: ComponentPropsWithoutRef<"video"> | undefined;
  src: string;
  opened?: boolean | undefined;
  onClose?: (() => void) | undefined;
  title?: ReactNode | undefined;
  ratio?: number | undefined;
  controls?: boolean | undefined;
  playing?: boolean | undefined;
  loop?: boolean | undefined;
  muted?: boolean | undefined;
  volume?: number | undefined;
  light?: boolean | string | undefined;
  onReady?: (() => void) | undefined;
  onEnded?: (() => void) | undefined;
  onError?: ((error: unknown) => void) | undefined;
  labels?: Partial<PlayerLabels> | undefined;
  className?: string | undefined;
}
