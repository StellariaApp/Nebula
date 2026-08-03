import { AppShell as AppShellRoot } from "./AppShell.js";
import {
  AppShellContent,
  AppShellHeader,
  AppShellRail,
  AppShellSection,
  AppShellSidebar,
  AppShellSubbar,
} from "./AppShellRail.js";

export const AppShell = Object.assign(AppShellRoot, {
  Rail: AppShellRail,
  Sidebar: AppShellSidebar,
  Section: AppShellSection,
  Header: AppShellHeader,
  Subbar: AppShellSubbar,
  Content: AppShellContent,
});

export {
  AppShellContent,
  AppShellHeader,
  AppShellRail,
  AppShellSection,
  AppShellSidebar,
  AppShellSubbar,
};
export type {
  AppShellContentProps,
  AppShellHeaderProps,
  AppShellLabels,
  AppShellProps,
  AppShellRailProps,
  AppShellSectionProps,
  AppShellSidebarProps,
  AppShellSubbarProps,
} from "./AppShell.types.js";
