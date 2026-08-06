import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function ChevronsRight(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="m7 18 6-6-6-6M13 18l6-6-6-6" />
    </Glyph>
  );
}
