import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface PlayerLabels {
  region: string;
  close: string;
}

export interface PlayerProps extends StyleProps {
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
