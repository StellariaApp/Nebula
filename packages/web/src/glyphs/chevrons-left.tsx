import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function ChevronsLeft(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="m17 18-6-6 6-6M11 18l-6-6 6-6" />
    </Glyph>
  );
}
