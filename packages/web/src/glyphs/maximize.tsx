import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Maximize(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="m21 3-7 7" />
      <path d="m3 21 7-7" />
    </Glyph>
  );
}
