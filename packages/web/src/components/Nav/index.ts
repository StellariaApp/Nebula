import { NavLinks as NavLinksBase, NavLinksLink } from "./Links.js";
import { NavLogo } from "./Logo.js";
import { Nav as NavRoot } from "./Nav.js";
import { NavActions, NavDivider } from "./Section.js";

const NavLinks = /* @__PURE__ */ Object.assign(NavLinksBase, { Link: NavLinksLink });

export const Nav = /* @__PURE__ */ Object.assign(NavRoot, {
  Logo: NavLogo,
  Links: NavLinks,
  Actions: NavActions,
  Divider: NavDivider,
});

export { NavActions, NavDivider, NavLinks, NavLinksLink, NavLogo };
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
  NavResolvedMode,
  NavSize,
  NavSlotProps,
} from "./Nav.types.js";
