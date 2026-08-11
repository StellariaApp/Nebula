import type { ComponentPropsWithoutRef, ReactNode, RefObject } from "react";

import type { GlassLevel, Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { ActionIconProps } from "../ActionIcon/ActionIcon.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { TitleOrder, TitleSlotProps } from "../Title/Title.types.js";

export interface AppShellLabels {
  skipToContent: string;
  navigation: string;
  complementary: string;
}

export interface AppShellProps extends StyleProps {
  /** The skip-to-content link, visible only when focused. It exists in both layouts. */
  skipProps?: ComponentPropsWithoutRef<"a"> | undefined;
  /** The top chrome band. Only exists in the rail layout, and only with a `header`. */
  chromeProps?: BoxSlotProps | undefined;
  /** The `main`. In the rail layout it is also what scrolls; its ref goes separately, through `mainRef`. */
  mainProps?: BoxSlotProps | undefined;
  /** The shadow sail at the start of the scrolling area. Rail layout only, and only with `scrollShadow`. */
  scrollShadowProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  header?: ReactNode | undefined;
  navbar?: ReactNode | undefined;
  aside?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  navbarOpened?: boolean | undefined;
  defaultNavbarOpened?: boolean | undefined;
  onNavbarChange?: ((opened: boolean) => void) | undefined;
  navbarWidth?: number | undefined;
  asideWidth?: number | undefined;
  headerHeight?: number | undefined;
  collapsedWidth?: number | undefined;
  collapsible?: boolean | undefined;
  padded?: boolean | undefined;
  labels?: Partial<AppShellLabels> | undefined;
  contentId?: string | undefined;
  className?: string | undefined;
  /** Full-height bar. Its presence switches the shell to the rail layout. */
  sidebar?: ReactNode | undefined;
  /** Decorative layer behind everything: this is where a `StarField` lives. */
  backdrop?: ReactNode | undefined;
  /** @default 320 */
  sidebarWidth?: number | undefined;
  /**
   * Bounds the rail grid — bar and content together — and centres it. Only the surfaces stay
   * full-bleed. Rail layout only.
   */
  contentWidth?: Unit | undefined;
  /** Third rail state: the bar shrinks to `sidebarMiniWidth` and its labels are hidden. */
  sidebarCollapsed?: boolean | undefined;
  sidebarMiniWidth?: number | undefined;
  chromeHeight?: number | undefined;
  /** The `main` is what scrolls in the rail layout; it is exposed so you can hook a parallax background to it. */
  mainRef?: RefObject<HTMLElement | null> | undefined;
  /** Shadow sail at the start of the scrolling area; it appears under the chrome, not over it. */
  scrollShadow?: boolean | undefined;
  /** The height the sail sticks from: use it to keep it beneath sticky chrome. */
  scrollShadowOffset?: number | undefined;
}

export interface AppShellRailProps extends StyleProps {
  children?: ReactNode | undefined;
  /** Full-height bar. Its presence switches the shell to rail mode. */
  sidebar?: ReactNode | undefined;
  /** Decorative layer behind everything: this is where a `StarField` lives. */
  backdrop?: ReactNode | undefined;
  sidebarWidth?: number | undefined;
  chromeHeight?: number | undefined;
  labels?: Partial<AppShellLabels> | undefined;
  contentId?: string | undefined;
  className?: string | undefined;
}

export interface AppShellSlotProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export interface AppShellLinksProps extends StyleProps {
  /** The group header. Not rendered without a `title` or an `action`. */
  headerProps?: BoxSlotProps | undefined;
  /** The label of that header. Only rendered with `title`. */
  titleProps?: TextSlotProps | undefined;
  /**
   * The link column. With a `deep` group it loses the bottom border — and the rail padding when the
   * bar is collapsed or the screen is narrow — so the group nests without a seam.
   */
  contentProps?: BoxSlotProps | undefined;
  children?: ReactNode | undefined;
  /** Group label. It goes away on collapse, like every other label in the rail. */
  title?: ReactNode | undefined;
  action?: ReactNode | undefined;
  className?: string | undefined;
  deep?: boolean | undefined;
}

export interface AppShellLabelProps extends Omit<StyleProps, "flex"> {
  children: ReactNode;
  className?: string | undefined;
  /** The label takes the free space in the row. It shadows the `flex` style prop, which does not apply here. */
  flex?: boolean | undefined;
}

export interface AppShellSidebarProps extends StyleProps {
  /** The anchor for the collapse button. Not rendered without `onCollapse`. */
  toggleProps?: BoxSlotProps | undefined;
  /** That button. It carries `aria-expanded`, which is where the chevron rotation comes from. */
  collapseProps?: ActionIconProps | undefined;
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  /** With a callback, the bar renders its own collapse button. It disappears below `laptop`. */
  collapsed?: boolean | undefined;
  onCollapse?: ((collapsed: boolean) => void) | undefined;
  collapseLabels?: { collapse: string; expand: string } | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface AppShellSectionProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
  "aria-label"?: string | undefined;
  "aria-labelledby"?: string | undefined;
}

export interface AppShellHeaderProps extends Omit<StyleProps, "order"> {
  /** The title and subtitle column. Not rendered if you pass `children`, which replaces it. */
  contentProps?: BoxSlotProps | undefined;
  /** The title. Its heading level comes from `order`, not from the size. */
  titleProps?: TitleSlotProps | undefined;
  /** The subtitle. Only rendered with `subtitle`. */
  subtitleProps?: TextSlotProps | undefined;
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  order?: TitleOrder | undefined;
  actions?: ReactNode | undefined;
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  /** In the grid layout, the header sticks to the top and takes its area. */
  sticky?: boolean | undefined;
  className?: string | undefined;
}

export interface AppShellNavProps extends StyleProps {
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface AppShellFooterProps extends StyleProps {
  children?: ReactNode | undefined;
  level?: GlassLevel | undefined;
  className?: string | undefined;
}

export interface AppShellSubbarProps extends StyleProps {
  children: ReactNode;
  level?: GlassLevel | undefined;
  /** It sticks right below the header when scrolling. */
  sticky?: boolean | undefined;
  className?: string | undefined;
}

export interface AppShellContentProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
}
