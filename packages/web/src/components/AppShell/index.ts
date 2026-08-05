import { AppShell as AppShellRoot } from "./AppShell.js";
import {
  AppShellAside,
  AppShellContent,
  AppShellFooter,
  AppShellHeader,
  AppShellNav,
  AppShellSection,
  AppShellRailLabel,
  AppShellSidebar,
  AppShellSubbar,
} from "./AppShellRail.js";

export const AppShell = Object.assign(AppShellRoot, {
  Sidebar: AppShellSidebar,
  RailLabel: AppShellRailLabel,
  Nav: AppShellNav,
  Aside: AppShellAside,
  Section: AppShellSection,
  Header: AppShellHeader,
  Subbar: AppShellSubbar,
  Content: AppShellContent,
  Footer: AppShellFooter,
});

export {
  AppShellAside,
  AppShellContent,
  AppShellFooter,
  AppShellHeader,
  AppShellNav,
  AppShellSection,
  AppShellSidebar,
  AppShellSubbar,
};
export type {
  AppShellContentProps,
  AppShellHeaderProps,
  AppShellLabels,
  AppShellProps,
  AppShellFooterProps,
  AppShellNavProps,
  AppShellSectionProps,
  AppShellSidebarProps,
  AppShellSubbarProps,
} from "./AppShell.types.js";
