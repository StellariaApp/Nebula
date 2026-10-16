import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";
import type { BadgeProps } from "../Badge/Badge.types.js";

export type LiveVideoFit = "contain" | "cover";

export interface LiveVideoLabels {
  fullscreen: string;
  exitFullscreen: string;
  live: string;
}

export interface LiveVideoProps extends StyleProps {
  /**
   * The live feed, usually a WebRTC `MediaStream`. It is written to `srcObject` only when it
   * changes, and `null` or `undefined` releases it. The `<video>` stays mounted either way.
   */
  stream: MediaStream | null | undefined;
  /**
   * How the picture sits in the frame. `"contain"` letterboxes it on the sunken surface and keeps
   * every pixel visible; `"cover"` fills the frame and crops what overflows.
   * @default "contain"
   */
  fit?: LiveVideoFit | undefined;
  /** What a screen reader says of the feed. */
  label?: string | undefined;
  /**
   * Painted over the frame while there is no picture: no stream yet, or a stream whose first frame
   * has not arrived. Without it the frame is the bare sunken surface.
   */
  placeholder?: ReactNode | undefined;
  /** The full-screen button in the corner. It enlarges the frame, not the bare `<video>`. @default false */
  withFullscreen?: boolean | undefined;
  /** A live badge in the top corner, shown only while there is a picture. @default false */
  withLiveBadge?: boolean | undefined;
  /** Says when the first frame arrives (`true`) and when the picture goes away (`false`). */
  onReady?: ((ready: boolean) => void) | undefined;
  labels?: Partial<LiveVideoLabels> | undefined;
  className?: string | undefined;
  /**
   * The `<video>` element itself, as an object ref or a callback. It is set on the first render,
   * before any stream, so listeners attached to it do not have to wait for the feed.
   */
  surfaceRef?: Ref<HTMLVideoElement> | undefined;
  /** The `<video>`. `src` and `controls` are not offered: the feed is `stream` and there are no native controls. */
  surfaceProps?:
    Omit<ComponentPropsWithoutRef<"video">, "src" | "controls" | "children"> | undefined;
  /** The full-screen button, only rendered with `withFullscreen`. */
  fullscreenProps?: ActionIconProps | undefined;
  /** The live badge, only rendered with `withLiveBadge`. */
  liveBadgeProps?: BadgeProps | undefined;
}
