import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

export interface AppShellLabels {
  skipToContent: string;
  navigation: string;
  complementary: string;
}

export interface AppShellProps extends Omit<StyleProps, "color" | "header"> {
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
}
