import { AppShell as AppShellRoot } from "./AppShell.js";
import { AppShellAside } from "./components/Aside.js";
import { AppShellContent } from "./components/Content.js";
import { AppShellFooter } from "./components/Footer.js";
import { AppShellHeader } from "./components/Header.js";
import { AppShellLink, AppShellLinks, AppShellLabel } from "./components/Links.js";
import { AppShellNav } from "./components/Nav.js";
import { AppShellSection } from "./components/Section.js";
import {
  AppShellSidebar,
  AppShellSidebarBody,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
} from "./components/Sidebar.js";
import { AppShellSubbar } from "./components/Subbar.js";

const Sidebar = /* @__PURE__ */ Object.assign(AppShellSidebar, {
  Header: AppShellSidebarHeader,
  Body: AppShellSidebarBody,
  Footer: AppShellSidebarFooter,
});

export const AppShell = /* @__PURE__ */ Object.assign(AppShellRoot, {
  Sidebar,
  Label: AppShellLabel,
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
  AppShellLabel,
  AppShellSubbar,
};
export type {
  AppShellContentProps,
  AppShellHeaderProps,
  AppShellLabels,
  AppShellProps,
  AppShellFooterProps,
  AppShellNavProps,
  AppShellRailCollapse,
  AppShellSectionProps,
  AppShellSidebarProps,
  AppShellSlotProps,
  AppShellLinksProps,
  AppShellSubbarProps,
} from "./AppShell.types.js";
