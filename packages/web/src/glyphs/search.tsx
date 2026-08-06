import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Search(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Glyph>
  );
}
