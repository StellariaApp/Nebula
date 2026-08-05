import { AppShell as AppShellRoot } from "./AppShell.js";
import {
  AppShellAside,
  AppShellContent,
  AppShellFooter,
  AppShellHeader,
  AppShellNav,
  AppShellSection,
  AppShellLink,
  AppShellLinks,
  AppShellRailLabel,
  AppShellSidebar,
  AppShellSidebarBody,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  AppShellSubbar,
} from "./AppShellRail.js";

const Sidebar = /* @__PURE__ */ Object.assign(AppShellSidebar, {
  Header: AppShellSidebarHeader,
  Body: AppShellSidebarBody,
  Footer: AppShellSidebarFooter,
});

export const AppShell = Object.assign(AppShellRoot, {
  Sidebar,
  RailLabel: AppShellRailLabel,
  Links: AppShellLinks,
  Link: AppShellLink,
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
  AppShellSidebarBody,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  AppShellLink,
  AppShellLinks,
  AppShellRailLabel,
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
  AppShellSlotProps,
  AppShellLinksProps,
  AppShellSubbarProps,
} from "./AppShell.types.js";
