import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Star(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01z" />
    </Glyph>
  );
}
