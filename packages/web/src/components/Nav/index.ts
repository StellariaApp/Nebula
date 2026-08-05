import { NavLinks as NavLinksBase, NavLinksLink } from "./Links.js";
import { NavLogo } from "./Logo.js";
import { NavSidebar } from "./Sidebar.js";
import { Nav as NavRoot } from "./Nav.js";
import { NavActions, NavDivider } from "./Section.js";

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
