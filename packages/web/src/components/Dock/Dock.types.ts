import type { ReactNode } from "react";

import type { BreakpointName, GlassLevel } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";
import type { AffixPosition } from "../Affix/Affix.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { PopoverPlacement, PopoverProps } from "../Popover/Popover.types.js";

/** The breakpoints the dock can fold under. `wide` is left out: nothing is narrower than it. */
export type DockCompactBelow = Exclude<BreakpointName, "wide">;

export interface DockProps extends Omit<StyleProps, "position" | "zIndex"> {
  /**
   * The controls. A function receives `stacked`: `false` in the row that shows on wide screens,
   * `true` inside the popover the dock folds into — the same controls, drawn twice, so a `Select`
   * can take a fixed width in the row and the full width in the column.
   */
  children: ReactNode | ((stacked: boolean) => ReactNode);
  /** The name of the landmark. Both surfaces are `aside` and carry it. */
  "aria-label": string;
  /**
   * Below this breakpoint the row folds into a single button that opens the same controls in a
   * popover. Three controls in a row measure ~300 px and a phone has 390. `false` never folds.
   * @default "phone"
   */
  compactBelow?: DockCompactBelow | false | undefined;
  /** What the folded button shows. It is `aria-hidden`; `triggerLabel` names the button. */
  trigger?: ReactNode | undefined;
  /** The name of the folded button. Falls back to `aria-label`. */
  triggerLabel?: string | undefined;
  /** Width of the popover the controls stack into. @default 220 */
  width?: number | string | undefined;
  /** Where the popover opens from the folded button. @default "top end" */
  placement?: PopoverPlacement | undefined;
  /** Distance between the folded button and its popover, in px. @default 12 */
  offset?: number | undefined;
  /** The glass step of both surfaces. @default "strong" */
  level?: GlassLevel | undefined;
  /** Which corner it sits in. @default { bottom: 24, right: 24 } */
  position?: AffixPosition | undefined;
  /** @default 200 */
  zIndex?: number | undefined;
  /** Renders through a portal, like `Affix`. @default true */
  withinPortal?: boolean | undefined;
  /** Whether it renders at all. @default true */
  visible?: boolean | undefined;
  className?: string | undefined;
  /** The row surface, a `GlassSurface`: its `shadow` is the glass one, so it is not a style prop here. */
  surfaceProps?: Omit<BoxSlotProps, "shadow" | "component"> | undefined;
  /** The folded surface, the one holding the button. Same contract as `surfaceProps`. */
  compactProps?: Omit<BoxSlotProps, "shadow" | "component"> | undefined;
  /** The folded button. */
  triggerProps?: ActionIconProps | undefined;
  /** The popover the controls stack into. */
  popoverProps?: Partial<Omit<PopoverProps, "trigger" | "children">> | undefined;
  /** The column inside that popover. */
  stackProps?: BoxSlotProps | undefined;
}
