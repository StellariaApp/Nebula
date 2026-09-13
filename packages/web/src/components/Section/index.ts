import { SectionActions } from "./components/Actions.js";
import { SectionAside } from "./components/Aside.js";
import { SectionBody } from "./components/Body.js";
import { SectionDescription } from "./components/Description.js";
import { SectionEyebrow, type SectionEyebrowProps } from "./components/Eyebrow.js";
import { SectionFooter } from "./components/Footer.js";
import { SectionHeader, SectionHeading } from "./components/Header.js";
import { SectionTitle } from "./components/Title.js";
import { Section as SectionRoot } from "./Section.js";

export const Section = /* @__PURE__ */ Object.assign(SectionRoot, {
  Header: SectionHeader,
  Heading: SectionHeading,
  Title: SectionTitle,
  Description: SectionDescription,
  Eyebrow: SectionEyebrow,
  Actions: SectionActions,
  Aside: SectionAside,
  Body: SectionBody,
  Footer: SectionFooter,
});

export {
  SectionActions,
  SectionAside,
  SectionBody,
  SectionDescription,
  SectionEyebrow,
  SectionFooter,
  SectionHeader,
  SectionHeading,
  SectionTitle,
};
export type { SectionEyebrowProps };
export type {
  SectionAlign,
  SectionHeadingProps,
  SectionOrder,
  SectionProps,
  SectionRevealProps,
  SectionRevealTarget,
  SectionSize,
  SectionSlotProps,
} from "./Section.types.js";
