import { HeroActions } from "./components/Actions.js";
import { HeroBottom } from "./components/Bottom.js";
import { HeroDescription } from "./components/Description.js";
import { HeroHeader } from "./components/Header.js";
import { HeroHiper } from "./components/Hiper.js";
import { HeroLeft } from "./components/Left.js";
import { HeroRight } from "./components/Right.js";
import { HeroSubtitle } from "./components/Subtitle.js";
import { HeroTitle } from "./components/Title.js";
import { Hero as HeroRoot } from "./Hero.js";

export const Hero = /* @__PURE__ */ Object.assign(HeroRoot, {
  Hiper: HeroHiper,
  Header: HeroHeader,
  Title: HeroTitle,
  Subtitle: HeroSubtitle,
  Description: HeroDescription,
  Actions: HeroActions,
  Left: HeroLeft,
  Right: HeroRight,
  Bottom: HeroBottom,
});

export {
  HeroActions,
  HeroBottom,
  HeroDescription,
  HeroHeader,
  HeroHiper,
  HeroLeft,
  HeroRight,
  HeroSubtitle,
  HeroTitle,
};
export type { HeroOrder, HeroProps, HeroSize, HeroSlotProps, HeroVariant } from "./Hero.types.js";
