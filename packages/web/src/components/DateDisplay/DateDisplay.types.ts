import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export type DateDisplayMode = "absolute" | "relative" | "auto";

export type DateDisplayPreset = "date" | "datetime" | "time" | "long" | "short";

export interface DateDisplayProps extends StyleProps {
  /**
   * The instant to show. A date-only string is detected as such and never gains a time it did not
   * have. Anything unparseable is not an error — it renders `fallback`.
   */
  value?: string | number | Date | null | undefined;
  /**
   * Absolute, relative, or relative only while recent. `"auto"` is the one that reads best in a
   * feed, and it is the only mode `relativeThreshold` affects.
   * @default "absolute"
   */
  mode?: DateDisplayMode | undefined;
  /**
   * Which named format the absolute form takes. Left out it follows the value: a date-only value
   * gets the date preset, anything carrying a time gets date and time.
   */
  preset?: DateDisplayPreset | undefined;
  /**
   * Overrides the locale. Left out it takes the ambient one from the surrounding React Aria
   * provider, which is what keeps a whole screen formatting alike.
   */
  locale?: string | undefined;
  /**
   * Which zone the instant is rendered in. Left out it is the reader's own, so one timestamp shown
   * in two places reads as two different clock times — set it when the wall clock is part of the
   * fact being stated.
   */
  timeZone?: string | undefined;
  /**
   * Merged over the preset, so it wins field by field rather than replacing the format wholesale. It
   * is applied after `timeZone` and can therefore override that too.
   */
  options?: Intl.DateTimeFormatOptions | undefined;
  /**
   * How near, in milliseconds, an instant has to be for `"auto"` to render it relatively. A week by
   * default, past which "5 weeks ago" stops being more useful than the date itself.
   * @default 604_800_000
   */
  relativeThreshold?: number | undefined;
  /**
   * Puts the absolute form in a `title` while the relative one is showing, so "2 hours ago" can be
   * hovered for the real timestamp. It does nothing when the absolute form is already on screen.
   * @default true
   */
  withTitle?: boolean | undefined;
  /**
   * Pins what "now" means for the relative form. Passing it is what makes the output deterministic,
   * which a snapshot test or a server render needs; left out, every render reads the clock.
   */
  now?: Date | number | undefined;
  /**
   * What renders when the value is missing or unparseable. An em dash by default, so an empty cell
   * still holds its line instead of collapsing.
   * @default "—"
   */
  fallback?: ReactNode | undefined;
  className?: string | undefined;
}
