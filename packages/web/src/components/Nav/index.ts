import { NavLinks as NavLinksBase, NavLinksLink } from "./components/Links.js";
import { NavLogo } from "./components/Logo.js";
import { NavSidebar } from "./components/Sidebar.js";
import { Nav as NavRoot } from "./Nav.js";
import { NavActions, NavDivider } from "./components/Section.js";

const NavLinks = /* @__PURE__ */ Object.assign(NavLinksBase, { Link: NavLinksLink });

export const Nav = /* @__PURE__ */ Object.assign(NavRoot, {
  Logo: NavLogo,
  Links: NavLinks,
  Actions: NavActions,
  Divider: NavDivider,
  Sidebar: NavSidebar,
});

export { NavActions, NavDivider, NavLinks, NavLinksLink, NavLogo, NavSidebar };
export { NAV_LABELS } from "./labels.js";
export type {
  NavActiveMode,
  NavDividerProps,
  NavLabels,
  NavLinkItemProps,
  NavLinksAlign,
  NavLinksCollapse,
  NavLinksProps,
  NavLogoProps,
  NavProps,
  NavSidebarProps,
  NavResolvedMode,
  NavSize,
  NavSlotProps,
} from "./Nav.types.js";
