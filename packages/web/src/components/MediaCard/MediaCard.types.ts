import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

/** A small label in a corner: «new», «clonable», the state. It is only read. */
export interface MediaCardCorner {
  text: string;
  tone: "accent" | "plain";
}

export interface MediaCardCount {
  icon: ReactNode;
  value: string;
  label: string;
}

export interface MediaCardProps extends StyleProps {
  /** Its place in the grid, for the staggered reveal. */
  index?: number | undefined;
  /**
   * Where pressing it leads. With it the whole card is a link (`component` picks the router's
   * element); without it, `onOpen` opens something here — a viewer — through a hit layer the size
   * of the frame, not a `button` around the card, which would put the menu inside a button.
   */
  href?: string | undefined;
  /** The link element when there is an `href`: `Link` of the router. @default "a" */
  component?: ElementType | undefined;
  onOpen?: (() => void) | undefined;
  /** The name of the hit layer. Required with `onOpen`. */
  openLabel?: string | undefined;
  /** What fills the frame, in order, already resolved. With more than one they cycle on hover. */
  frames: readonly string[];
  /** A muted preview clip that plays on hover, or — with `playable` — the clip the card IS a player of. */
  clip?: string | null | undefined;
  /** The still frame of the clip. Falls back to the first frame. */
  poster?: string | null | undefined;
  /** The card is a player: `VideoPlayer` takes the frame and hides corners and foot while it runs. */
  playable?: boolean | undefined;
  /** The clip's seconds, already known, for the player. */
  seconds?: number | null | undefined;
  /** The clip's length already written («0:05»), the label at the bottom-left. */
  clock?: string | null | undefined;
  /** The first frame is a cell of a six-view sheet: show the face cell, not the whole sheet, and do not cycle. */
  sheet?: boolean | undefined;
  cornerStart?: MediaCardCorner | null | undefined;
  cornerEnd?: MediaCardCorner | null | undefined;
  /** A button over the image, top right: save, the menu. */
  action?: ReactNode | undefined;
  /** The other button, top left. With it, `cornerStart` moves down beside the clock. */
  actionStart?: ReactNode | undefined;
  /** The portrait beside the title. `name` draws the initial without `src`. */
  avatar?: { src?: string | null | undefined; name: string } | undefined;
  title: string;
  subtitle?: string | undefined;
  /** A figure with its icon at the bottom left, over the foot. */
  count?: MediaCardCount | null | undefined;
  /** The chip at the bottom right: the tier. */
  ceiling?: string | null | undefined;
  ceilingLabel?: string | undefined;
  /** What the frame shows without frames or player. */
  fallback?: ReactNode | undefined;
  className?: string | undefined;
  /** The 3/4 frame. */
  frameProps?: BoxSlotProps | undefined;
  /** The glass foot with avatar, title and subtitle, a `GlassSurface`. */
  footProps?: Omit<BoxSlotProps, "shadow" | "component"> | undefined;
  /** Every frame image. */
  imageProps?: ComponentPropsWithoutRef<"img"> | undefined;
}
