import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface PlayerLabels {
  region: string;
  close: string;
}

export interface PlayerProps extends StyleProps {
  /**
   * The player inside the frame. It is the only node in the catalogue that renders a peer —
   * react-player — and that is why it is typed with the attributes of the `video` it renders and not
   * with `BoxSlotProps`: the component governs its `src`, its size and its handlers.
   */
  surfaceProps?: ComponentPropsWithoutRef<"video"> | undefined;
  src: string;
  opened?: boolean | undefined;
  onClose?: (() => void) | undefined;
  title?: ReactNode | undefined;
  /** @default 16 / 9 */
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
