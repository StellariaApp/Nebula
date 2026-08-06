import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function ChevronLeft(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="m15 18-6-6 6-6" />
    </Glyph>
  );
}
