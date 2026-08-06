import type { IconComponent } from "@stellaria/nebula-icons";

import { Check, ChevronDown, Glyph } from "../glyphs/index.js";

type Expect<T extends true> = T;
type Eq<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

export type CheckGlyphIsIconComponent = Expect<
  Eq<typeof Check extends IconComponent ? true : false, true>
>;
export type CheckChevronIsIconComponent = Expect<
  Eq<typeof ChevronDown extends IconComponent ? true : false, true>
>;
export type CheckWrapperIsIconComponent = Expect<
  Eq<typeof Glyph extends IconComponent ? true : false, true>
>;
