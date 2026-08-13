import type { ReactNode } from "react";

export type Direction = "ltr" | "rtl";

export interface DirectionProviderProps {
  /**
   * The subtree that inherits the direction. It is wrapped in a `div` carrying `dir`, so this
   * provider adds an element — placing it between a flex or grid container and its items breaks the
   * layout.
   */
  children: ReactNode;
  /**
   * The direction, controlled. Passing it pins the value: `detectFromDocument` and the context's own
   * `setDirection` still fire `onDirectionChange`, but nothing moves until you change this.
   */
  direction?: Direction | undefined;
  /**
   * Where the direction starts when nothing controls it. Ignored once `direction` is passed.
   * @default "ltr"
   */
  defaultDirection?: Direction | undefined;
  /**
   * Fires with the direction being moved to, in both modes. In controlled mode it is the only signal
   * you get, since the provider will not move on its own.
   */
  onDirectionChange?: ((direction: Direction) => void) | undefined;
  /**
   * Reads `dir` off the document element once on mount and adopts it. For an app whose direction is
   * decided server-side on the `html` tag; it only ever reads, and never writes back.
   * @default false
   */
  detectFromDocument?: boolean | undefined;
}

export interface DirectionContextValue {
  direction: Direction;
  setDirection: (direction: Direction) => void;
  toggleDirection: () => void;
}
