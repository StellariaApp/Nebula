import type { ComponentPropsWithoutRef } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { PlayerControlsLabels } from "./labels.js";

export interface AudioPlayerProps extends StyleProps {
  src: string;
  /** What a screen reader says of the clip. */
  label?: string | undefined;
  labels?: Partial<PlayerControlsLabels> | undefined;
  className?: string | undefined;
  /** The `<audio>` itself. `src` and the handlers the player needs are its own. */
  surfaceProps?: Omit<ComponentPropsWithoutRef<"audio">, "src"> | undefined;
  /** The seek track, a real `range`. */
  trackProps?: ComponentPropsWithoutRef<"input"> | undefined;
  /** The volume slider inside its popover. */
  volumeProps?: ComponentPropsWithoutRef<"input"> | undefined;
}
