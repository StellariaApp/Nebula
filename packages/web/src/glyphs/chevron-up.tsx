import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function ChevronUp(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="m18 15-6-6-6 6" />
    </Glyph>
  );
}
