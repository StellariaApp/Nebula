import type { ColorExtended, Size, Unit } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type LoaderType = "spinner" | "dots" | "bars";

export interface LoaderProps extends StyleProps {
  /**
   * Which shape spins. They differ in feel, not in meaning: the spinner for a wait of unknown
   * length, the dots for one expected to be short, the bars where a row of them has to read as a
   * placeholder.
   * @default "spinner"
   */
  type?: LoaderType | undefined;
  /**
   * The loader's square, as a control step or as any length. It takes a raw value so it can be
   * matched to the control it sits inside rather than to the nearest step.
   * @default "md"
   */
  size?: Size | Unit | undefined;
  /**
   * The scale it is drawn from, at the 600 step. Tint it to the surface it sits on, not to the
   * action it belongs to — a loader is not a control.
   * @default "primary"
   */
  color?: ColorExtended | undefined;
  /**
   * The accessible name. The loader is a live `status` region with no visible text, so this is the
   * whole of what is announced; say what is loading, not that something is. It is English by
   * default (ADR-120); translate it at the call site.
   * @default "Loading"
   */
  label?: string | undefined;
  className?: string | undefined;
}
