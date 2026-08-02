import {
  Footer as FooterRoot,
  FooterBrand,
  FooterGroup as FooterGroupBase,
  FooterLegal,
  FooterLink,
} from "./Footer.js";

const FooterGroup = /* @__PURE__ */ Object.assign(FooterGroupBase, { Link: FooterLink });

export const Footer = /* @__PURE__ */ Object.assign(FooterRoot, {
  Brand: FooterBrand,
  Group: FooterGroup,
  Legal: FooterLegal,
});

export { FooterBrand, FooterGroup, FooterLegal, FooterLink };
export type {
  FooterBrandProps,
  FooterGroupProps,
  FooterLegalProps,
  FooterLinkProps,
  FooterProps,
} from "./Footer.types.js";
