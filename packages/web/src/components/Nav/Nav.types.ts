import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { ColorExtended, GlassLevel, Unit, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { ButtonCloseProps } from "../ButtonClose/ButtonClose.types.js";

export type NavSize = "sm" | "md" | "lg";

export type NavActiveMode = "auto" | "hash" | "pathname" | "manual";

export type NavResolvedMode = Exclude<NavActiveMode, "auto">;

export type NavLinksAlign = "start" | "center" | "end";
export type NavLinksCollapse = "none" | "phone" | "tablet" | "laptop";

export interface NavLabels {
  more: string;
  links: string;
}

export interface NavProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  size?: NavSize | undefined;
  withBorder?: boolean | undefined;
  /** @default 1180 */
  contentWidth?: Unit | undefined;
  /** The glass step of the bar surface. A static bar wears it from the start (ADR-125). */
  level?: GlassLevel | undefined;
  floating?: boolean | undefined;
  sticky?: boolean | undefined;
  scrolled?: boolean | undefined;
  /** @default 24 */
  scrollThreshold?: number | undefined;
  /** @default 1180 */
  floatingWidth?: Unit | undefined;
  /** @default 12 */
  floatingGap?: Unit | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavLogoProps extends StyleProps {
  /** The mark itself — an `svg`, an `img`, or wordmark text. */
  children?: ReactNode | undefined;
  /**
   * The element it paints, and where a router link plugs in. Left alone it follows `href`.
   * @default "a" with an `href`, "div" without one
   */
  component?: ElementType | undefined;
  /**
   * Where the mark links to, conventionally the home page. Without it the logo is not a link at all,
   * which is the right answer only when the page it sits on IS home.
   */
  href?: string | undefined;
  /**
   * How tall the mark is drawn; the width follows its aspect. Height is the one that matters here
   * because the bar's height is what the logo has to sit inside.
   */
  height?: Unit | undefined;
  className?: string | undefined;
  /**
   * Names the logo link. A mark that is an image carries no text, so without this the link is
   * announced as its URL — set it whenever the children are not readable words.
   */
  "aria-label"?: string | undefined;
}

export interface NavSidebarProps {
  /** The drawer header, which carries only the close button. */
  headProps?: BoxSlotProps | undefined;
  /** That close button. The scrim closes too, and it is not a slot: it is the scrim itself. */
  closeProps?: ButtonCloseProps | undefined;
  /** The scrolling body, where the children land. */
  bodyProps?: BoxSlotProps | undefined;
  /** The drawer footer. Not rendered without `footer`. */
  footerProps?: BoxSlotProps | undefined;
  opened: boolean;
  onClose: () => void;
  children?: ReactNode | undefined;
  /** Goes in the footer, stacked: this is where the status badge and the CTA fit. */
  footer?: ReactNode | undefined;
  /** Above this point the drawer closes by itself. */
  collapse?: NavLinksCollapse | undefined;
  closeLabel?: string | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

export interface NavLinksProps extends Omit<StyleProps, "align"> {
  /** The dropdown for the links that do not fit. Only with `overflowMenu`, and only if any are left over. */
  overflowProps?: ComponentPropsWithoutRef<"details"> | undefined;
  /** Its trigger, the three-dot one. */
  overflowTriggerProps?: ComponentPropsWithoutRef<"summary"> | undefined;
  /** The dropdown panel, where the hidden links land. */
  overflowPanelProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  active?: string | undefined;
  activeMode?: NavActiveMode | undefined;
  align?: NavLinksAlign | undefined;
  collapse?: NavLinksCollapse | undefined;
  /** Priority+: measures the real width and sends the links that do not fit to the menu. */
  overflowMenu?: boolean | undefined;
  spyOffset?: number | undefined;
  variant?: Variant | undefined;
  color?: ColorExtended | undefined;
  withIndicator?: boolean | undefined;
  labels?: Partial<NavLabels> | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavLinkItemProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  href?: string | undefined;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  onPress?: (() => void) | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface NavSlotProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
  /** Below this point the actions disappear: they live in the drawer footer. */
  collapse?: NavLinksCollapse | undefined;
}

export interface NavDividerProps extends StyleProps {
  /**
   * Lands on the rule. It is decorative and carries no role, so it separates the nav visually
   * without adding a landmark or an announcement between the groups it splits.
   */
  className?: string | undefined;
}
