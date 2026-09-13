import type { ComponentPropsWithoutRef } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";
import type { PlayerControlsLabels } from "../AudioPlayer/labels.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

export interface VideoPlayerProps extends StyleProps {
  src: string;
  /** The still frame before it starts. Without one the frame is the sunken surface; `null` says so on purpose. */
  poster?: string | null | undefined;
  /** What a screen reader says of the clip. */
  label?: string | undefined;
  /** Caps the frame: a grid caps it, a room lets it run. */
  maxHeight?: number | string | undefined;
  /** Cover the frame instead of measuring what the clip measures. It is the grid's business, not the player's. */
  fill?: boolean | undefined;
  /**
   * Do not open the file until someone presses play. A grid of 24 cards mounted 12 `video`
   * elements, each opening a range request only to read its header. With it, stopped there is no
   * `video` at all: the poster is an `<img>`, and the clip mounts on the first play. Without a
   * poster it mounts when it comes into view (200 px early) rather than on load.
   */
  defer?: boolean | undefined;
  /** The clip's seconds, already known. Saves opening the file to write the total. */
  duration?: number | null | undefined;
  /** Starts on its own and muted, like a feed. */
  autoPlay?: boolean | undefined;
  loop?: boolean | undefined;
  /** Says it started or stopped, so whoever frames it can step aside. */
  onPlaying?: ((playing: boolean) => void) | undefined;
  labels?: Partial<PlayerControlsLabels> | undefined;
  className?: string | undefined;
  /** The `<video>` itself. `src`, `poster` and the handlers the player needs are its own. */
  surfaceProps?: Omit<ComponentPropsWithoutRef<"video">, "src" | "poster"> | undefined;
  /** The control bar over the frame. */
  barProps?: BoxSlotProps | undefined;
  /** The seek track, a real `range`. */
  trackProps?: ComponentPropsWithoutRef<"input"> | undefined;
  /** The volume slider inside its popover. */
  volumeProps?: ComponentPropsWithoutRef<"input"> | undefined;
  /** The full-screen button in the corner. */
  fullscreenProps?: ActionIconProps | undefined;
  /** The big play button over the middle, only while stopped. */
  playProps?: ComponentPropsWithoutRef<"button"> | undefined;
}
