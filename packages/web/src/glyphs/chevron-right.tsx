import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function ChevronRight(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="m9 18 6-6-6-6" />
    </Glyph>
  );
}
